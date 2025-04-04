import os
import json
import argparse
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed

from google import genai
from google.genai import types


##############################################################################
# 1. Load Gemini Client from .env
##############################################################################
def setup_gemini_client():
    load_dotenv()
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not found in environment.")
    return genai.Client(api_key=GEMINI_API_KEY)


##############################################################################
# 2. Scoring Prompt with Passed-In Accessibility Flag
##############################################################################
def build_scoring_prompt(accessible_flag):
    return (
        "You are a professional architectural visual auditor for hyperrealistic accessibility mockups.\n"
        "Your task is to evaluate if the image meets the visual quality AND the specific accessibility need.\n"
        "\n"
        "Each metric is scored from 1 to 10:\n"
        f"1. accessibility_fulfillment (0.5 weight): Is the image clearly fulfilling the following upgrade?\n"
        f"   Accessibility goal: {accessible_flag}\n"
        "   For example, if tactile indicators are shown on one stair, are they shown consistently on all stairs?\n"
        "\n"
        "2. realism (0.3 weight): Does the image look indistinguishable from a real photo?\n"
        "3. texture_fidelity (0.1 weight): Do materials/textures match their descriptions and look physically real?\n"
        "4. visual_clarity (0.05 weight): Can we clearly and unambiguously see the upgrades?\n"
        "5. bounding_box_accuracy (0.05 weight): Are upgrades located exactly as specified?\n"
        "\n"
        "Return ONLY this JSON structure:\n"
        "{\n"
        '  "accessibility_fulfillment": int,\n'
        '  "realism": int,\n'
        '  "texture_fidelity": int,\n'
        '  "visual_clarity": int,\n'
        '  "bounding_box_accuracy": int\n'
        "}"
    )


##############################################################################
# 3. Send One Image + Flag → Gemini → Get Scores
##############################################################################
def evaluate_image(client, image_path, accessible_flag):
    prompt = build_scoring_prompt(accessible_flag)
    image = Image.open(image_path).convert("RGB")

    response = client.models.generate_content(
        model="gemini-1.5-pro-latest",
        contents=[prompt, image],
        config=types.GenerateContentConfig(response_modalities=["Text"])
    )

    raw_text = response.candidates[0].content.parts[0].text.strip()

    # Clean LLM output
    if raw_text.startswith("```json"):
        raw_text = raw_text[len("```json"):].strip()
    if raw_text.endswith("```"):
        raw_text = raw_text[:-len("```")].strip()

    try:
        scores = json.loads(raw_text)
        weighted_score = compute_weighted_score(scores)
        return (image_path, weighted_score)
    except Exception as e:
        print(f"\n❌ Failed to parse score for {image_path}:\nRaw output:\n{raw_text}\nError: {e}")
        return (image_path, {
            "accessibility_fulfillment": 0,
            "realism": 0,
            "texture_fidelity": 0,
            "visual_clarity": 0,
            "bounding_box_accuracy": 0,
            "weighted_average": 0
        })


##############################################################################
# 4. Weighted Score Calculation
##############################################################################
def compute_weighted_score(score_dict):
    weights = {
        "accessibility_fulfillment": 0.5,
        "realism": 0.3,
        "texture_fidelity": 0.1,
        "visual_clarity": 0.05,
        "bounding_box_accuracy": 0.05
    }

    for k in weights:
        score_dict.setdefault(k, 0)

    total = sum(score_dict[k] * w for k, w in weights.items())
    score_dict["weighted_average"] = round(total, 2)
    return score_dict


##############################################################################
# 5. Rank Images by Accessibility + Realism
##############################################################################
def rank_generated_images(image_paths, accessible_flag, max_parallel=4):
    client = setup_gemini_client()
    results = []

    print(f"\n🔍 Scoring {len(image_paths)} images with accessibility flag: {accessible_flag}\n")

    with ThreadPoolExecutor(max_workers=max_parallel) as executor:
        futures = {
            executor.submit(evaluate_image, client, path, accessible_flag): path for path in image_paths
        }
        for future in as_completed(futures):
            path = futures[future]
            try:
                results.append(future.result())
            except Exception as e:
                print(f"❌ Scoring failed for {path}: {e}")

    # Sort by weighted average
    results.sort(key=lambda x: x[1]["weighted_average"], reverse=True)

    # Save results to file
    with open("image_scores.json", "w") as f:
        json.dump([{ "image": path, "scores": score } for path, score in results], f, indent=2)
    print("📁 Saved all scores to image_scores.json")

    best_path = results[0][0]
    best_scores = results[0][1]

    # Show Best Image
    print(f"\n🏆 BEST IMAGE: {os.path.basename(best_path)}")
    print(f"Weighted Score: {best_scores['weighted_average']}")
    print(json.dumps(best_scores, indent=2))
    Image.open(best_path).show(title="Best Scored Image")

    print("\n📊 All Image Scores:")
    for path, score in results:
        print(f"{os.path.basename(path)} → {score['weighted_average']}")

    return best_path, results


##############################################################################
# 6. CLI Entrypoint
##############################################################################
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dir", default=".", help="Directory containing image files")
    parser.add_argument("--accessibility", required=True, help="Accessibility flag (e.g., tactile paving, wheelchair ramp)")
    parser.add_argument("--max_parallel", type=int, default=4, help="Max parallel Gemini calls")
    args = parser.parse_args()

    image_paths = [
        os.path.join(args.dir, f)
        for f in os.listdir(args.dir)
        if f.startswith("hyperrealistic_variation_") and f.endswith(".png")
    ]

    if not image_paths:
        print("⚠️ No images found.")
    else:
        rank_generated_images(image_paths, accessible_flag=args.accessibility, max_parallel=args.max_parallel)
