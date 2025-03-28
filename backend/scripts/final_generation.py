import os
import json
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv
from google import genai
from google.genai import types
from concurrent.futures import ThreadPoolExecutor, as_completed


def extract_upgrades(cohere_post_processed_path):
    with open(cohere_post_processed_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    if "upgrades" in data:
        return data["upgrades"]
    else:
        print("Warning: 'upgrades' not found in cohere_post_processed.json")
        return []

def extract_deep_research_information(deep_research_report_path):
    with open(deep_research_report_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    style_variations_map = {}
    if "deep_research_results" in data:
        for item in data["deep_research_results"]:
            upgrade_name = item.get("upgrade", "Unknown Upgrade")
            material_options = item.get("material_options", [])
            cost_options = item.get("cost_options", [])

            variations = []
            max_pairs = min(len(material_options), len(cost_options))
            for i in range(max_pairs):
                variation = {
                    "material": material_options[i],
                    "cost": cost_options[i]
                }
                variations.append(variation)

            style_variations_map[upgrade_name] = {"variations": variations}
    
    return style_variations_map

def get_base_prompt():
    return (
        "YOU ARE A HIGHLY CAPABLE MULTIMODAL MODEL.\n"
        "TASK:\n"
        "1) Start with the provided input image.\n"
        "2) For each listed 'upgrade', incorporate it EXACTLY in the specified location(s)\n"
        "   (using bounding boxes if available) with realistic geometry.\n"
        "3) Use the EXACT material that is recommended in the cost option label.\n"
        "   For example, if cost label says 'Rubber Stair Treads', show real rubber treads.\n"
        "4) Each upgrade must be visually distinct so we can see each one clearly\n"
        "   (e.g. distinct color or finishing). Yet keep it looking natural & hyperrealistic.\n"
        "5) Show accurate dimensions/scale: read the 'dimensions' or 'depth' if provided.\n"
        "6) The final result must look like a REAL photograph, not an illustration.\n"
        "7) The cost label may not appear as literal text in the final image, but the style\n"
        "   or brand implied by the label must be physically represented.\n"
        "8) The bounding boxes in the data are given as [x1, y1, x2, y2] or similar. Use them\n"
        "   to locate exactly where to place the upgrade. If multiple bboxes are listed,\n"
        "   apply the upgrade to each bounding box region.\n"
        "9) Make sure all upgrades are integrated into the same final image.\n"
        "10) Be sure to incorporate any 'material_preferences' that appear in the data.\n"
        "11) ABSOLUTELY DO NOT add anything that is not explicitly mentioned in the UPGRADE DETAILS.\n"
        "    This includes: posters, text signs, glowing panels, floating labels, icons, or any decorative content.\n"
        "12) The final image must contain ONLY the requested accessibility upgrades.\n"
        "13) Maintain a realistic indoor lighting style and color palette.\n"
        "14) DO NOT generate any extra annotation or diagrammatic overlays.\n"
        "END TASK.\n\n"
        "BEGIN UPGRADE DETAILS:\n"
    )

def generate_single_variation(client, original_image, upgrades, style_variations_map, variation_index):
    base_prompt = get_base_prompt()
    upgrade_snippets = []

    for upg in upgrades:
        upg_type = upg.get("type", "Unknown Upgrade")
        upg_desc = upg.get("description", "")
        upg_bbox = upg.get("bbox", [])
        upg_dims = upg.get("dimensions", "")
        upg_loc_ref = upg.get("location_reference", "")
        upg_mat_pref = upg.get("material_preferences", "")
        upg_depth = upg.get("depth", "")
        upg_acc_goal = upg.get("accessibility_goal", "")
        upg_priority = upg.get("priority_level", "")

        snippet = (
            f"=== Upgrade: {upg_type} ===\n"
            f"Description: {upg_desc}\n"
            f"Location Reference: {upg_loc_ref}\n"
            f"Bounding Boxes: {upg_bbox}\n"
            f"Dimensions: {upg_dims}, Depth: {upg_depth}\n"
            f"Material Preferences (from cohere): {upg_mat_pref}\n"
            f"Accessibility Goal: {upg_acc_goal}, Priority: {upg_priority}\n"
        )

        if upg_type in style_variations_map:
            variations = style_variations_map[upg_type]["variations"]
            if len(variations) > variation_index:
                chosen_var = variations[variation_index]
                mat_info = chosen_var["material"]
                cost_info = chosen_var["cost"]

                snippet += (
                    f"CHOSEN COST & MATERIAL (Variation #{variation_index+1}):\n"
                    f" - Cost Option Label: {cost_info.get('label')}\n"
                    f"   Estimated Cost: {cost_info.get('estimated_cost')}\n"
                    f"   Notes: {cost_info.get('notes')}\n"
                    f" - Material Type: {mat_info.get('type')}\n"
                    f"   Material Properties: {mat_info.get('properties')}\n"
                    "In the final image, reflect the real-world look/feel of this product.\n"
                    "Visually differentiate it from other upgrades.\n"
                )

        upgrade_snippets.append(snippet)

    final_prompt = (
        base_prompt + "\n".join(upgrade_snippets) +
        "\nEND UPGRADE DETAILS.\n"
        "AGAIN, produce a SINGLE FINAL IMAGE with all these modifications, "
        "hyperrealistically integrated. Distinct visuals.\n"
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash-exp-image-generation",
        contents=[final_prompt, original_image],
        config=types.GenerateContentConfig(
            response_modalities=['Text', 'Image']
        )
    )

    updated_image = None
    raw_text_output = ""

    for part in response.candidates[0].content.parts:
        if part.text:
            raw_text_output += part.text
        elif part.inline_data:
            updated_image = Image.open(BytesIO(part.inline_data.data))

    return (variation_index, updated_image, raw_text_output)

def generate_accessibility_upgraded_images(
    original_image_path,
    cohere_post_processed_path,
    deep_research_report_path,
    max_variations=3
):
    load_dotenv()
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")

    client = genai.Client(api_key=GEMINI_API_KEY)
    original_image = Image.open(original_image_path).convert("RGB")
    upgrades = extract_upgrades(cohere_post_processed_path)
    style_variations_map = extract_deep_research_information(deep_research_report_path)

    n_variations_per_upgrade = [
        len(style_variations_map.get(upg.get("type", ""), {}).get("variations", []))
        for upg in upgrades
    ]
    possible_variations = min(n_variations_per_upgrade or [0])
    possible_variations = min(possible_variations, max_variations)

    generated_images_map = {}

    with ThreadPoolExecutor(max_workers=possible_variations) as executor:
        future_to_index = {
            executor.submit(generate_single_variation, client, original_image, upgrades, style_variations_map, i): i
            for i in range(possible_variations)
        }

        for future in as_completed(future_to_index):
            idx = future_to_index[future]
            try:
                var_idx, image, raw_text = future.result()
                generated_images_map[var_idx] = image
                print(f"[Variation {var_idx + 1}] Generated successfully.")
            except Exception as e:
                print(f"[Variation {idx + 1}] Failed: {e}")

    return [generated_images_map[i] for i in sorted(generated_images_map.keys())]


if __name__ == "__main__":
    original_image_path = "stairs.jpeg"
    cohere_post_processed_path = "cohere_post_processed.json"
    deep_research_report_path = "deep_research_report.json"

    images = generate_accessibility_upgraded_images(
        original_image_path=original_image_path,
        cohere_post_processed_path=cohere_post_processed_path,
        deep_research_report_path=deep_research_report_path,
        max_variations=3
    )

    for idx, img in enumerate(images):
        if img is not None:
            out_file = f"hyperrealistic_variation_{idx+1}.png"
            img.save(out_file)
            print(f"Saved {out_file}")
