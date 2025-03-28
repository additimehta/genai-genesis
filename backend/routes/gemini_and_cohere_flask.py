from flask import Flask, request, jsonify
import os
import json
from gemini import main_gemini_analysis
from cohere_post_processing import parse_gemini_output

app = Flask(__name__)

DATABASE_DIR = os.path.join(os.getcwd(), "database")

@app.route('/analyze_full', methods=['POST'])
def full_accessibility_pipeline():
    data = request.get_json()

    if not data or 'filename' not in data:
        return jsonify({"error": "Filename is required."}), 400

    filename = data['filename']
    base_name = os.path.splitext(filename)[0]

    # Load detected_objects from saved .json file
    detected_objects_path = os.path.join(DATABASE_DIR, f"{base_name}_objects.json")
    try:
        with open(detected_objects_path, 'r') as f:
            detected_objects = json.load(f)
    except Exception as e:
        return jsonify({"error": f"Could not load detected objects: {e}"}), 500

    # Image paths
    annotated_path = os.path.join(DATABASE_DIR, f"{base_name}_annotated.jpg")
    depth_path = os.path.join(DATABASE_DIR, f"{base_name}_depth.jpg")
    prepro_img_path = os.path.join(DATABASE_DIR, filename)

    if not all(os.path.exists(p) for p in [prepro_img_path, annotated_path, depth_path]):
        return jsonify({"error": "Required image files not found in database/"}), 404

    # === Step 1: Run Gemini ===
    gemini_text = main_gemini_analysis(
        prepro_img_path=prepro_img_path,
        depth_map_path=depth_path,
        annotated_image_path=annotated_path,
        detected_objects=detected_objects,
        accessibility_type="visual"
    )

    # === Save Gemini Output ===
    gemini_output_path = os.path.join(DATABASE_DIR, f"{base_name}_gemini_raw.txt")
    with open(gemini_output_path, "w", encoding="utf-8") as f:
        f.write(gemini_text or "EMPTY_GEMINI_RESPONSE")

    # === Validate Gemini Output ===
    if not gemini_text or len(gemini_text.strip()) < 20:
        return jsonify({
            "error": "Gemini returned empty or invalid response.",
            "gemini_raw_text_saved_as": gemini_output_path
        }), 500

    # === Try Cohere Parsing ===
    try:
        structured_json = parse_gemini_output(gemini_text)
    except Exception as e:
        structured_json = None
        cohere_error = str(e)
    else:
        cohere_error = None

    # === Save Parsed Output or Failure ===
    structured_output_path = os.path.join(DATABASE_DIR, f"{base_name}_upgrades.json")
    with open(structured_output_path, "w", encoding="utf-8") as f:
        json.dump(structured_json or {"error": cohere_error}, f, indent=2)

    # === Final Response ===
    return jsonify({
        "original_filename": filename,
        "annotated_image_path": annotated_path,
        "depth_image_path": depth_path,
        "detected_objects_path": detected_objects_path,
        "gemini_raw_text_saved_as": gemini_output_path,
        "structured_upgrades_saved_as": structured_output_path,
        "structured_upgrades": structured_json,
        "cohere_parsing_error": cohere_error
    })


@app.route('/get_analysis/<filename>', methods=['GET'])
def get_analysis(filename):
    base_name = os.path.splitext(filename)[0]
    structured_output_path = os.path.join(DATABASE_DIR, f"{base_name}_upgrades.json")
    if not os.path.exists(structured_output_path):
        return jsonify({"error": "File not found"}), 404
    with open(structured_output_path, "r", encoding="utf-8") as f:
        structured_json = json.load(f)
    return jsonify(structured_json)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
