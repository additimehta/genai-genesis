import cohere
import os
import json
from dotenv import load_dotenv

load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY") 

def parse_gemini_output(gemini_output: str):
    # Load API key from environment
    # Initialize Cohere client
    co = cohere.Client(COHERE_API_KEY)   

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
                    "required": [ 
                        "type", "description", "location_reference", "bbox", "depth",
                        "dimensions", "slope_ratio", "material_preferences", 
                        "accessibility_goal", "priority_level", "dependencies"
                    ]
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

    Make sure that **all fields** defined in the schema are present in each upgrade object.  
    If a field is missing in the input, still include it using these defaults:
    - Strings → `""`
    - Numbers → `0.0`
    - Arrays → `[]`

    DO NOT OMIT ANY FIELDS. Output valid JSON only.

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

    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"[❌ JSON Parsing Error]: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    gemini_output = """
        1. **Type**: Ramp Installation
            *   **Description**: Install a ramp parallel to the existing stairway, allowing wheelchair users to bypass the stairs and access the upper and lower levels. The ramp should have a non-slip surface and a consistent slope.
            *   **Location Reference**: Parallel to existing stairway with bounding box [507, 1113, 1378, 1887].
            *   **Bounding Box (bbox)**: Consider an area adjacent to [507, 1113, 1378, 1887] for ramp placement.
            *   **Median Depth**: 11.05 meters (approximate depth where the ramp will be located relative to the camera).
            *   **Dimensions**: The ramp length should be sufficient to achieve a maximum slope of 1:12 (as per ADA guidelines) given the vertical height difference between the upper and lower levels. The ramp width should be at least 1 meter to allow for comfortable wheelchair passage.
            *   **Slope Ratio**: 1:12 (or less).
            *   **Material Preferences**: Concrete with a textured, non-slip finish.
            *   **Accessibility Goal**: Enable wheelchair navigation between levels.
            *   **Priority Level**: High
            *   **Dependencies**: Assessment of the landing sizes at the top and bottom of the stairs to ensure sufficient space for ramp transitions.

        2. **Type**: Handrail Extension & Modification
            *   **Description**: Extend the existing railing beyond the top and bottom of the stairway and ramp by at least 300mm (0.3 meters) horizontally. The railing should be continuous and graspable along its entire length and must contrast visually with the background. The handrails should be installed at two heights: one at 900mm and one at 700mm from the ramp/stair surface to accommodate users of different heights.
            *   **Location Reference**: Existing railing with bounding box [319, 913, 684, 1862] alongside the stairs and along new ramp.
            *   **Bounding Box (bbox)**: [319, 913, 684, 1862] (for existing railing), plus extensions beyond top and bottom of stairs and ramp.
            *   **Median Depth**: 18.98 meters (existing railing location).
            *   **Dimensions**: Extend horizontally 0.3 meters beyond the top and bottom of stairs/ramp. Two heights: 0.9 meters and 0.7 meters.
            *   **Material Preferences**: Stainless steel or powder-coated steel for durability and grip.
            *   **Accessibility Goal**: Enhanced safety and support for users with mobility impairments using both the stairs and the ramp.
            *   **Priority Level**: High
            *   **Dependencies**: Installation of ramp.

        3. **Type**: Tactile Warning Strips
            *   **Description**: Install tactile warning strips at the top and bottom of both the stairway and the ramp to warn visually impaired users of the change in level. These strips should be at least 600mm (0.6 meters) deep and run the full width of the stairway/ramp. The strips should provide a high contrast with the surrounding flooring.
            *   **Location Reference**: Top and bottom of the existing stairway [507, 1113, 1378, 1887] and newly installed ramp.
            *   **Bounding Box (bbox)**: Position at the beginning and end of stairs and ramp area.
            *   **Median Depth**: Approximately 11.05 meters for the stairway, and the corresponding depth for the ramp location.
            *   **Dimensions**: 0.6 meter depth strips. Width to match the stairway/ramp.
            *   **Material Preferences**: Durable, slip-resistant material, contrasting color with the floor.
            *   **Accessibility Goal**: Provide warning to visually impaired users of changes in level.
            *   **Priority Level**: High
            *   **Dependencies**: None.

        4. **Type**: Doorway Widening
            *   **Description**: Widen the doorway to a minimum clear width of 810mm (0.81 meters) to accommodate wheelchair passage. If structural modifications are needed, ensure they comply with building codes.
            *   **Location Reference**: Existing door with bounding box [938, 250, 1349, 599].
            *   **Bounding Box (bbox)**: [938, 250, 1349, 599].
            *   **Median Depth**: 3.13 meters.
            *   **Dimensions**: Achieve a clear opening of at least 0.81 meters.
            *   **Material Preferences**: If a new door is installed, use a sturdy material suitable for high traffic.
            *   **Accessibility Goal**: Ensure wheelchair users can easily access the room beyond the doorway.
            *   **Priority Level**: Medium
            *   **Dependencies**: Possible wall modifications.

        5. **Type**: Signage Improvements
            *   **Description**: Install clear, high-contrast directional signage indicating the location of the ramp and accessible routes. Use tactile signage (Braille and raised characters) alongside visual signage to accommodate users with visual impairments. Mount signage at a consistent height (approximately 1.5 meters from the floor) and location throughout the building.
            *   **Location Reference**: Adjacent to the stairway and the ramp entrances, and at decision-making points in the corridor.
            *   **Bounding Box (bbox)**: Place strategically throughout the viewed area.
            *   **Median Depth**: Variable depending on placement location.
            *   **Dimensions**: Signage dimensions should comply with accessibility guidelines.
            *   **Material Preferences**: Durable, non-glare materials.
            *   **Accessibility Goal**: Improve wayfinding for all users, especially those with visual impairments or mobility limitations.
            *   **Priority Level**: Medium
            *   **Dependencies**: None

        6. **Type**: Visual Contrast Enhancement
            *   **Description**: Enhance the visual contrast between the stair treads and risers using color. This aids individuals with low vision in discerning the edges of each step.
            *   **Location Reference**: Stairway [507, 1113, 1378, 1887].
            *   **Bounding Box (bbox)**: [507, 1113, 1378, 1887]
            *   **Median Depth**: 11.05 meters.
            *   **Dimensions**: N/A
            *   **Material Preferences**: Paint or applied non-slip strips
            *   **Accessibility Goal**: Improves step edge visibility for users with low vision.
            *   **Priority Level**: Medium
            *   **Dependencies**: None
        """

    result = parse_gemini_output(gemini_output=gemini_output)
    print(result)