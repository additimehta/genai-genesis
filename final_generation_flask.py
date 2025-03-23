from flask import Flask, request, jsonify
import os
from final_generation import generate_accessibility_upgraded_images

from PIL import Image
from dotenv import load_dotenv

app = Flask(__name__)

DATABASE_FOLDER = "database"
os.makedirs(DATABASE_FOLDER, exist_ok=True)

@app.route('/generate_variations', methods=['POST'])
def generate_variation_api():
    req = request.get_json()

    if not req or "base_name" not in req:
        return jsonify({"error": "Missing 'base_name' in request body"}), 400

    base_name = os.path.splitext(req["base_name"])[0]

    original_image_path = os.path.join(DATABASE_FOLDER, f"{base_name}.jpeg")
    cohere_path = os.path.join(DATABASE_FOLDER, f"{base_name}_upgrades.json")
    research_path = os.path.join(DATABASE_FOLDER, f"{base_name}_deep_research_report.json")

    # File existence checks
    for path in [original_image_path, cohere_path, research_path]:
        if not os.path.exists(path):
            return jsonify({"error": f"Required file not found: {path}"}), 404

    try:
        images = generate_accessibility_upgraded_images(
            original_image_path=original_image_path,
            cohere_post_processed_path=cohere_path,
            deep_research_report_path=research_path,
            max_variations=req.get("max_variations", 3)
        )

        output_paths = []
        for idx, img in enumerate(images):
            if img:
                out_path = os.path.join(DATABASE_FOLDER, f"{base_name}_variation_{idx+1}.png")
                img.save(out_path)
                output_paths.append(out_path)

        return jsonify({"generated_images": output_paths})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5004)
