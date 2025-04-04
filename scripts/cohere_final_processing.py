import os
import json
import cohere
from dotenv import load_dotenv

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.Client(COHERE_API_KEY)

def load_json_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def generate_image_edit_description(cohere_path, deep_research_path, output_path="image_edit_description.txt"):
    cohere_data = load_json_file(cohere_path)
    research_data = load_json_file(deep_research_path)

    prompt = (
        "You are an accessibility upgrade specialist working with a visual AI team.\n\n"
        "Your task is to **analyze the accessibility upgrades** described below and write **a detailed, visual instruction manual** for how to transform the original image so that it reflects the upgrades perfectly.\n\n"
        "Your output should include:\n"
        "1. **What** to add, change, or remove in the image.\n"
        "2. **Where** to apply each change (refer to location references or bounding boxes if provided).\n"
        "3. **How** to implement it visually (materials, colors, shapes, dimensions).\n"
        "4. **Why** the change matters (brief reason linked to accessibility goal).\n\n"
        "Use realistic language. Be unambiguous. Do NOT hallucinate. Only describe changes based strictly on the input data.\n\n"
        "--- START OF DATA ---\n\n"
        f"COHERE POST PROCESSED UPGRADES:\n{json.dumps(cohere_data, indent=2)}\n\n"
        f"DEEP RESEARCH REPORT:\n{json.dumps(research_data, indent=2)}\n\n"
        "--- END OF DATA ---\n"
    )

    response = co.chat(
        model="command-r-plus",
        message=prompt,
        temperature=0.4,
    )

    description_text = response.text.strip()

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(description_text)

    print(f"[✅] Edit description saved to {output_path}")
    return description_text

if __name__ == "__main__":
    base_name = "stairs"
    cohere_file = f"database/{base_name}_upgrades.json"
    research_file = f"database/{base_name}_deep_research_report.json"
    output_txt = f"database/{base_name}_image_edit_description.txt"

    generate_image_edit_description(cohere_file, research_file, output_txt)
