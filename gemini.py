import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

def analyze_accessibility(prepro_img_path, depth_map_path, annotated_image_path, detected_objects, accessibility_type="visual"):
    # Set your API key
    genai.configure(api_key=GEMINI_API_KEY)

    # Load your image
    original_image = Image.open(prepro_img_path).convert("RGB")
    depth_map_image = Image.open(depth_map_path).convert("RGB")
    annotated_image = Image.open(annotated_image_path).convert("RGB")

    prompt_lines = [
        "You are an expert accessibility architect with advanced spatial reasoning skills. Your task is to analyze a building scene and propose detailed, actionable modifications that improve accessibility.",

        "",
        "Accessibility Focus: " + ("All" if accessibility_type.lower() == "all" else accessibility_type.capitalize() + " accessibility"),

        "",
        "You are provided with three key images:",
        "1. The original image of the space, giving you the visual context of the area.",
        "2. A depth map of the image that shows distance estimates for various parts of the scene, giving you a 3D understanding of the space.",
        "3. An annotated image with bounding boxes and labels for detected objects (e.g., walls, doors, railings, stairways), providing precise locations and dimensions.",

        "",
        "For each detected object, the following details are given:",
        "• Label (e.g., wall, door, railing, stairway)",
        "• Bounding Box coordinates",
        "• Average Depth (in meters) – this helps determine the spatial size and distance of the object",
        "• Area in pixels (indicating the object’s relative size in the image)",
        "",

        "Your objective is to propose modifications that transform the space into one that is more accessible, with a particular focus on " +
        ("comprehensive improvements" if accessibility_type.lower() == "all" else accessibility_type + " needs") + ".",
        "",

        "When generating your response, consider the following:",
        "• Use the 3D spatial data (from the depth map and annotated image) to understand the actual sizes and placements of objects.",
        "• Recommend specific changes tailored to " +
        ("multiple accessibility needs" if accessibility_type.lower() == "all" else accessibility_type + " accessibility improvements") + ".",
        "• Provide clear and precise architectural suggestions that indicate how the modifications integrate with the current spatial layout.",
        "• Base your recommendations solely on the visual and spatial data provided, without mentioning any cost estimations or budgetary details.",
        "",
        "Below is the data for each detected object:",
    ]

    for obj in detected_objects:
        line = (
            f"• Label: {obj['label']}\n"
            f"  - Bounding Box: {obj['bbox']}\n"
            f"  - Average Depth: {obj['average_depth']:.2f} meters\n"
            f"  - Area: {obj['area']} pixels\n"
        )
        prompt_lines.append(line)

    prompt_lines.append(
        "Using the visual context and spatial information provided, generate a detailed textual description on how to modify this space to significantly improve its accessibility with an emphasis on " +
        ("a comprehensive set of improvements" if accessibility_type.lower() == "all" else accessibility_type + " needs") +
        "Be explicit about the changes (for example, installing ramps, adjusting the height and placement of railings, or widening doorways) and base your recommendations on the real dimensions and spatial layout. "
        "Avoid any discussion of costs or material price estimates."
    )

    full_prompt = "\n".join(prompt_lines)


    # Use the Gemini Pro Vision model
    model = genai.GenerativeModel("gemini-2.0-flash")

    # Send a prompt with the image
    response = model.generate_content(
        [original_image, depth_map_image, annotated_image, full_prompt]
    )

    return response.text

if __name__ == "__main__":
    # For standalone testing
    sample_objects = [
        {"label": "wall", "bbox": [0, 0, 1499, 1999], "average_depth": 14.47, "area": 1822062},
        {"label": "door", "bbox": [938, 250, 1349, 599], "average_depth": 2.98, "area": 23326},
        {"label": "railing", "bbox": [319, 913, 684, 1862], "average_depth": 16.53, "area": 105613},
        {"label": "stairway", "bbox": [507, 1113, 1378, 1887], "average_depth": 10.62, "area": 208523}
    ]
    result = analyze_accessibility("stairs.jpeg", "stairs_depth.png", "stairs_annotated.png", sample_objects)
    print(result)