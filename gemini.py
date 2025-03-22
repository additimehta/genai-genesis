import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv
import cv2
import numpy as np

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

def calculate_brightness(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return np.mean(gray)

def analyze_accessibility(prepro_img_path, depth_map_path, annotated_image_path, detected_objects, accessibility_type="visual"):
    # Set your API key
    genai.configure(api_key=GEMINI_API_KEY)

    # Load your image
    original_image = Image.open(prepro_img_path).convert("RGB")
    depth_map_image = Image.open(depth_map_path).convert("RGB")
    annotated_image = Image.open(annotated_image_path).convert("RGB")

    # Calculate brightness for lighting context
    brightness = calculate_brightness(prepro_img_path)

    # Identify existing accessibility features
    accessibility_features = ['tactile_strip', 'ramp', 'signage']  # Expand as needed
    existing_features = [obj['label'] for obj in detected_objects if obj['label'] in accessibility_features]
    existing_features_str = ", ".join(existing_features) if existing_features else "None detected"

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
        "• Median Depth (in meters) – this helps determine the spatial size and distance of the object",
        "• Area in pixels (indicating the object’s relative size in the image)",
        "• Estimated real-world width and height (in meters, if provided)",

        "",
        "Additional information:",
        f"• Lighting conditions: Average brightness {brightness:.2f} (well-lit if > 100).",
        f"• Existing accessibility features detected: {existing_features_str}",

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
        "• Consider the available space based on the depth map when suggesting extensions or additions (e.g., ensure sufficient clearance for handrail extensions).",
        "• Suggest a full range of upgrades, including signage, ramps, tactile elements, etc., to ensure comprehensive accessibility improvements.",

        "",
        "Below is the data for each detected object:",
    ]

    for obj in detected_objects:
        # Include new fields from segment.py if available
        width_str = f"  - Estimated Width: {obj['estimated_width']:.2f} meters\n" if 'estimated_width' in obj else ""
        height_str = f"  - Estimated Height: {obj['estimated_height']:.2f} meters\n" if 'estimated_height' in obj else ""
        line = (
            f"• Label: {obj['label']}\n"
            f"  - Bounding Box: {obj['bbox']}\n"
            f"  - Median Depth: {obj.get('median_depth', obj.get('average_depth', 0)):.2f} meters\n"  # Fallback to average_depth if needed
            f"  - Area: {obj['area']} pixels\n" +
            width_str + height_str
        )
        prompt_lines.append(line)

    prompt_lines.append(
        "Using the visual context and spatial information provided, generate a detailed textual description on how to modify this space to significantly improve its accessibility with an emphasis on " +
        ("a comprehensive set of improvements" if accessibility_type.lower() == "all" else accessibility_type + " needs") +
        " Be explicit about the changes (for example, installing ramps, adjusting the height and placement of railings, or widening doorways) and base your recommendations on the real dimensions and spatial layout. "
        "Avoid any discussion of costs or material price estimates."
    )

    prompt_lines.append(
        "Please output each accessibility upgrade suggestion as a clearly numbered list with the following structured information for each: " +
        "1. **Type** of upgrade (e.g., ramp, widened door, railing extension)" +
        "2. **Description**: A detailed explanation of what should be done and why." +
        "3. **Location Reference**: Refer to the object involved (e.g., “existing stairway with bounding box [507, 1113, 1378, 1887]”)." +
        "4. **Bounding Box (bbox)**: The numeric bounding box coordinates as a list of [x1, y1, x2, y2] arrays if multiple locations." +
        "5. **Median Depth**: Depth value in meters at the site." +
        "6. **Dimensions**: Estimated size required for the upgrade (e.g., ramp length, door width)." +
        "7. **Slope Ratio** (if applicable): For ramps, specify the slope (e.g., 1:12)." +
        "8. **Material Preferences**: If possible, recommend commonly used or suitable materials." +
        "9. **Accessibility Goal**: What problem does this solve? (e.g., “wheelchair navigation”)" +
        "10. **Priority Level**: High, Medium, or Low based on urgency/impact." +
        "11. **Dependencies**: If this upgrade depends on another (e.g., a wall must be modified before widening door), list those here." +
        "You may omit fields only when they are clearly not applicable (e.g., slope_ratio for door widening)."
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