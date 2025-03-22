import cohere
import os
from dotenv import load_dotenv

# Load API key from environment
load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

# Initialize Cohere client
co = cohere.Client(COHERE_API_KEY)

# -------- Replace this with actual Gemini output --------
gemini_output = """
Here are the accessibility upgrade suggestions for the provided space, focusing on visual accessibility:

1.  **Type**: Stairway Tactile Indicators
    *   **Description**: Install tactile warning strips along the leading edge of each step on the existing stairway. These strips should be a high-contrast color compared to the step surface and be made of a durable, slip-resistant material. Each strip should be at least 2 inches (50 mm) wide and extend the full width of the step.
    *   **Location Reference**: Existing stairway with bounding box [507, 1113, 1378, 1887].
    *   **Bounding Box (bbox)**: [507, 1113, 1378, 1887]
    *   **Median Depth**: 10.62 meters
    *   **Dimensions**: 50 mm width, full step width (approximately 1.4 meters).
    *   **Material Preferences**: Durable, slip-resistant rubber or composite material.
    *   **Accessibility Goal**: Provide warning of upcoming steps for individuals with low vision, reducing the risk of falls.
    *   **Priority Level**: High
    *   **Dependencies**: None

2.  **Type**: Stairway High-Contrast Edges
    *   **Description**: Paint or otherwise mark the edges of each step with a high-contrast color that differs significantly from both the step's tread and riser. This visual cue will enhance depth perception and make the steps more discernible. The contrasting color should extend 1-2 inches onto the tread and riser.
    *   **Location Reference**: Existing stairway with bounding box [507, 1113, 1378, 1887].
    *   **Bounding Box (bbox)**: [507, 1113, 1378, 1887]
    *   **Median Depth**: 10.62 meters
    *   **Dimensions**: 25-50 mm width, full step width (approximately 1.4 meters).
    *   **Material Preferences**: Durable, non-slip paint or tape.
    *   **Accessibility Goal**: Improve visibility of steps, reducing trip hazards for those with low vision or depth perception issues.
    *   **Priority Level**: High
    *   **Dependencies**: None

3.  **Type**: Railing Extension
    *   **Description**: Extend the existing railing at both the top and bottom of the stairway at least 12 inches (300 mm) beyond the first and last risers, respectively. Ensure that the extensions are parallel to the floor.
    *   **Location Reference**: Existing railing with bounding box [319, 913, 684, 1862].
    *   **Bounding Box (bbox)**: [319, 913, 684, 1862]
    *   **Median Depth**: 16.53 meters
    *   **Dimensions**: 300 mm extension at both ends.
    *   **Material Preferences**: Match existing railing material.
    *   **Accessibility Goal**: Provide a secure and continuous grip for visually impaired individuals as they approach and depart the stairway.
    *   **Priority Level**: High
    *   **Dependencies**: None

4.  **Type**: Handrail Contrast Marking
    *   **Description**: Mark the handrails with a high contrast band, using a durable and tactile material. Apply this band to the top surface of the handrail, covering the entire length, to visually enhance it for individuals with limited sight.
    *   **Location Reference**: Existing railing with bounding box [319, 913, 684, 1862].
    *   **Bounding Box (bbox)**: [319, 913, 684, 1862]
    *   **Median Depth**: 16.53 meters
    *   **Dimensions**: The contrast band will extend the entire length of the railing.
    *   **Material Preferences**: Durable tape or non-slip paint.
    *   **Accessibility Goal**: Enhances visibility of the handrails, improving stair navigation.
    *   **Priority Level**: Medium
    *   **Dependencies**: None
"""
# --------------------------------------------------------

# JSON schema to structure Gemini output
schema = {
    "type": "object",
    "properties": {
        "upgrades": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {"type": "string"},
                    "description": {"type": "string"},
                    "location_reference": {"type": "string"},
                    "bbox": {
                        "type": "array",
                        "items": {
                            "type": "array",
                            "items": {"type": "integer"},
                        }
                    },
                    "depth": {"type": "number"},
                    "dimensions": {"type": "string"},
                    "slope_ratio": {"type": "string"},
                    "material_preferences": {"type": "string"},
                    "accessibility_goal": {"type": "string"},
                    "priority_level": {
                        "type": "string",
                        "enum": ["high", "medium", "low"]
                    },
                    "dependencies": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["type", "description", "location_reference"]
            }
        }
    },
    "required": ["upgrades"]
}

# Call Cohere's Command R+ model
response = co.chat(
    model="command-r-plus",
    message=f"""Convert the following accessibility upgrade suggestions into structured JSON using the schema provided. 
For upgrades that apply to multiple locations, such as tactile strips at both the top and bottom of the stairway, include multiple bounding boxes in the 'bbox' field as a list of [x1, y1, x2, y2] arrays.
Respond ONLY with valid JSON.

Suggestions:
{gemini_output}
""",
    response_format={
        "type": "json_object",
        "schema": schema
    }
)

# Output result
print("\n🎯 Structured JSON Output:\n")
print(response.text)