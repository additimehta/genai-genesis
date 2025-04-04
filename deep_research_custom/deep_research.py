import os
import requests
from tavily import TavilyClient
import google.generativeai as genai
from concurrent.futures import ThreadPoolExecutor
import json
from time import time
from dotenv import load_dotenv

load_dotenv()

# Load API keys
TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')
JINA_API_KEY = os.getenv('JINA_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Verify API keys are loaded
print(f"TAVILY_API_KEY loaded: {'Yes' if TAVILY_API_KEY else 'No'}")
print(f"JINA_API_KEY loaded: {'Yes' if JINA_API_KEY else 'No'}")
print(f"GEMINI_API_KEY loaded: {'Yes' if GEMINI_API_KEY else 'No'}")

# Configure APIs
genai.configure(api_key=GEMINI_API_KEY)
tavily = TavilyClient(api_key=TAVILY_API_KEY)

def run_deep_research_from_file(input_file="cohere_post_processed.json", output_file="deep_research_report_1.json"):

    # Shared data structure to store research results
    research_data = {}

    # Step 1: Sub-Query Generation with Gemini
    def generate_sub_queries(upgrade_data):
        upgrade = upgrade_data["type"]
        description = upgrade_data["description"]
        location_reference = upgrade_data["location_reference"]
        dimensions = upgrade_data["dimensions"]
        material_preferences = upgrade_data["material_preferences"]
        accessibility_goal = upgrade_data["accessibility_goal"]
        dependencies = upgrade_data["dependencies"]

        prompt = (
            f"Given the following accessibility upgrade details:\n"
            f"- Upgrade: {upgrade}\n"
            f"- Description: {description}\n"
            f"- Location Reference: {location_reference}\n"
            f"- Dimensions: {dimensions}\n"
            f"- Material Preferences: {material_preferences}\n"
            f"- Accessibility Goal: {accessibility_goal}\n"
            f"- Dependencies: {dependencies}\n\n"
            "Generate 5 context-specific sub-queries to research the following factors: "
            "Cost, Materials, Contractors, Maintenance, Compliance. "
            "Each sub-query should be tailored to the upgrade’s specifics and suitable for web search. "
            "Focus all sub-queries on urban Canadian areas (e.g., Toronto, Ontario, Vancouver), ensuring relevance to Canadian standards and markets (e.g., use AODA, CNIB, Ontario Building Code, not US standards like ADA or OSHA). "
            "For the Cost, Materials, and Maintenance sub-queries, focus on variations within the preferred material: {material_preferences}. "
            "For the Contractors sub-query, explicitly focus on contractors in urban Canadian areas (e.g., Toronto, Ontario, Vancouver). "
            "For the Compliance sub-query, focus on only Canadian standards like AODA, CNIB, Ontario Building Code or other Canadian ones."
            "Return the sub-queries as a JSON list:\n"
            "[\n"
            "  \"sub-query for cost variations using {material_preferences} in urban Canada\",\n"
            "  \"sub-query for material variations of {material_preferences} in urban Canada\",\n"
            "  \"sub-query for contractors in urban Canada\",\n"
            "  \"sub-query for maintenance variations using {material_preferences} in urban Canada\",\n"
            "  \"sub-query for compliance with Canadian standards\"\n"
            "]"
        )

        model = genai.GenerativeModel("gemini-2.0-flash")
        try:
            response = model.generate_content(prompt)
            json_start = response.text.index("[")
            json_end = response.text.rindex("]") + 1
            sub_queries = json.loads(response.text[json_start:json_end])
            return sub_queries
        except Exception as e:
            print(f"Error generating sub-queries for {upgrade}: {e}")
            # Fallback to generic sub-queries (Canada focus)
            upgrade_lower = upgrade.lower()
            return [
                f"cost of {upgrade_lower} for stairways in urban Canada 2025",
                f"materials used in {upgrade_lower} compliant with AODA in urban Canada",
                f"contractors for {upgrade_lower} installation in urban Canada",
                f"maintenance requirements for {upgrade_lower} in urban Canada",
                f"AODA and CNIB compliance rules for {upgrade_lower} in Canada"
            ]

    # Step 2: Tavily Search for URLs
    def tavily_search(query):
        try:
            response = tavily.search(query=query, search_depth="basic", max_results=5, include_answer=False)
            return [{"url": result["url"], "title": result.get("title", ""), "description": result.get("description", "")} for result in response["results"]]
        except Exception as e:
            print(f"Error searching for '{query}': {e}")
            return []

    # Step 3: Extract Content with Jina Reader (with retries and fallback)
    def extract_with_jina(url_data, max_retries=2):
        url = url_data["url"]
        for attempt in range(max_retries + 1):
            try:
                jina_url = f"https://r.jina.ai/{url}"
                headers = {"Authorization": f"Bearer {JINA_API_KEY}"}
                response = requests.get(jina_url, headers=headers, timeout=30)
                response.raise_for_status()
                print(f"Successfully extracted content from {url}")
                return response.text[:20000]
            except Exception as e:
                print(f"Attempt {attempt + 1}/{max_retries + 1} - Error extracting content from {url}: {e}")
                if attempt < max_retries:
                    time.sleep(2)
                else:
                    # Fallback to URL metadata from Tavily
                    fallback_content = f"Title: {url_data.get('title', 'N/A')}\nDescription: {url_data.get('description', 'N/A')}"
                    print(f"Using fallback content for {url}: {fallback_content}")
                    return fallback_content if url_data.get("title") or url_data.get("description") else ""

    # Parallelized function to process a sub-query
    def process_sub_query(sub_query, upgrade_name):
        print(f"Processing sub-query for {upgrade_name}: {sub_query}")
        url_data_list = tavily_search(sub_query)
        if not url_data_list:
            print(f"No search results found for sub-query: {sub_query}")
            research_data[upgrade_name][sub_query] = {"content": "No results found.", "urls": []}
            return

        with ThreadPoolExecutor() as executor:
            contents = list(executor.map(extract_with_jina, url_data_list[:3]))

        filtered_contents = [content for content in contents if content and len(content) > 50]
        content = "\n".join(filtered_contents) if filtered_contents else "No relevant data extracted."
        research_data[upgrade_name][sub_query] = {"content": content, "urls": [url_data["url"] for url_data in url_data_list[:3]]}
        print(f"Completed sub-query for {upgrade_name}: {sub_query}, URLs: {[url_data['url'] for url_data in url_data_list[:3]]}")

    # Step 4: Deep Research for an Upgrade
    def deep_research(upgrade_data):
        upgrade = upgrade_data["type"]
        sub_queries = generate_sub_queries(upgrade_data)
        research_data[upgrade] = {}

        with ThreadPoolExecutor() as executor:
            executor.map(lambda sub_query: process_sub_query(sub_query, upgrade), sub_queries)

    # Step 5: Summarize with Gemini
    def summarize_with_gemini(upgrade, material_preferences):
        prompt_lines = [f"Deep research summary for {upgrade}:\n"]
        for sub_query, data in research_data[upgrade].items():
            prompt_lines.append(f"**{sub_query}**:\nContent:\n{data['content']}\nSource URLs:\n{json.dumps(data['urls'], indent=2)}\n")

        full_prompt = "\n".join(prompt_lines)
        full_prompt += (
            "\nUsing the above research data, generate a structured summary for the accessibility upgrade in JSON format:\n"
            "{\n"
            "  \"upgrade\": \"" + upgrade + "\",\n"
            "  \"cost_options\": [{\"label\": \"string\", \"estimated_cost\": \"string\", \"notes\": \"string\", \"source_urls\": [\"url1\", \"url2\", ...]}, ...],\n"
            "  \"material_options\": [{\"type\": \"string\", \"properties\": \"string\", \"source_urls\": [\"url1\", \"url2\", ...]}, ...],\n"
            "  \"contractors\": [{\"name\": \"string\", \"location\": \"string\", \"notes\": \"string\", \"source_urls\": [\"url1\", \"url2\", ...]}, ...],\n"
            "  \"maintenance\": [{\"frequency\": \"string\", \"notes\": \"string\", \"source_urls\": [\"url1\", \"url2\", ...]}, ...],\n"
            "  \"compliance\": [{\"regulation\": \"string\", \"notes\": \"string\", \"source_urls\": [\"url1\", \"url2\", ...]}, ...]\n"
            "}\n"
            "For cost_options, material_options, and maintenance, provide 3-4 variations strictly within the preferred material: " + material_preferences + ". "
            "Exclude any variations that do not use the specified material preferences (e.g., if the preference is 'rubber or composite', do not include options like polyurethane). "
            "For cost_options, estimate labor time realistically (e.g., installing a tactile strip on a single step should take 0.5-1 hour, not 2-5 hours). "
            "Ensure the total estimated cost is consistent with the sum of labor and materials, and include a breakdown in the notes (e.g., 'Materials: $X, Labor: $Y, Total: $Z'). "
            "For contractors, provide 3-4 options strictly in urban Canadian areas (e.g., Toronto, Ontario, Vancouver). Exclude any US-based contractors. "
            "If specific contractor names cannot be extracted, use realistic generic names (e.g., 'Toronto Accessibility Solutions', 'Vancouver Barrier-Free Contractors'). "
            "For compliance, provide 3-4 Canadian standards (e.g., AODA, CNIB, Ontario Building Code) with specific regulation details. Exclude any US standards like ADA or OSHA. "
            "For each variation in each category, include a 'source_urls' field listing the URLs from the provided Source URLs that most directly contributed to that variation. "
            "If a variation is informed by multiple URLs, list all relevant URLs. If no specific URL directly contributed, list the URLs used for the sub-query. "
            "Ensure the 'upgrade' field exactly matches the provided upgrade name: \"" + upgrade + "\". "
            "Estimate costs for 2025 in a Canadian urban area (e.g., Toronto, Ontario), assuming a labor rate of $56.65/hour. "
            "Keep the response concise to save tokens."
        )

        model = genai.GenerativeModel("gemini-2.0-flash")
        try:
            response = model.generate_content(full_prompt)
            json_start = response.text.index("{")
            json_end = response.text.rindex("}") + 1
            return json.loads(response.text[json_start:json_end])
        except Exception as e:
            print(f"Error parsing Gemini response for {upgrade}: {e}")
            return {"upgrade": upgrade, "error": "Failed to parse summary"}

    # Helper function to process a single upgrade (deep research + summarization)
    def process_single_upgrade(upgrade_data):
        upgrade = upgrade_data["type"]
        material_preferences = upgrade_data["material_preferences"]
        print(f"\nStarting deep research for {upgrade}...")
        deep_research(upgrade_data)
        print(f"Completed research for {upgrade}")
        print(f"Summarizing research for {upgrade}...")
        summary = summarize_with_gemini(upgrade, material_preferences)
        print(f"Completed summary for {upgrade}")
        return summary

    # Main function to process all upgrades in parallel
    def process_upgrades(upgrades_data):
        start_time = time()
        final_report = {"deep_research_results": []}

        print(f"Upgrades Data: {upgrades_data}")

        # Parallelize the processing of upgrades
        with ThreadPoolExecutor() as executor:
            results = list(executor.map(process_single_upgrade, upgrades_data))

        final_report["deep_research_results"] = results

        with open(output_file, "w") as f:
            json.dump(final_report, f, indent=2)

        print(f"\nDeep research completed in {time() - start_time:.2f} seconds")
        print("Report saved to deep_research_report.json")

    # Load upgrades from Cohere output
    with open(input_file, "r") as f:
        cohere_data = json.load(f)

    upgrades_data = cohere_data["upgrades"]
    return process_upgrades(upgrades_data)

if __name__ == "__main__":
    run_deep_research_from_file(
        input_file="cohere_post_processed.json",
        output_file="deep_research_1.json"
    )