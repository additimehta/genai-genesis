from flask import Flask, request, jsonify
import os
import tempfile
import cv2
import numpy as np
import json
from segment import process_image

app = Flask(__name__)


# For proper documentation explain what this api does!!!

def convert_numpy(obj):
    """Convert NumPy types to native Python types."""
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

def process_uploaded_images(images):
    """
    Handles saving, processing, and storing all uploaded images.
    Saves annotated image and depth map in 'database/' directory.
    Also saves detected_objects to a sidecar JSON.
    Returns a list of results.
    """
    database_dir = os.path.join(os.getcwd(), "database")
    os.makedirs(database_dir, exist_ok=True)

    saved_files = []

    with tempfile.TemporaryDirectory() as input_dir:
        for image in images:
            image_path = os.path.join(input_dir, image.filename)
            image.save(image_path)

            try:
                # Run segmentation + depth + annotation
                img_np, seg_mask, depth_map, detected_objects, annotated_img = process_image(image_path)

                # Normalize and colorize depth map
                depth_map_norm = cv2.normalize(depth_map, None, 0, 255, cv2.NORM_MINMAX)
                depth_map_color = cv2.applyColorMap(depth_map_norm.astype("uint8"), cv2.COLORMAP_INFERNO)

                # Filenames
                base_name = os.path.splitext(image.filename)[0]
                annotated_path = os.path.join(database_dir, f"{base_name}_annotated.jpg")
                depth_path = os.path.join(database_dir, f"{base_name}_depth.jpg")
                detected_objects_path = os.path.join(database_dir, f"{base_name}_objects.json")

                # Save images
                cv2.imwrite(annotated_path, cv2.cvtColor(annotated_img, cv2.COLOR_RGB2BGR))
                cv2.imwrite(depth_path, depth_map_color)

                # Convert detected_objects to serializable and save
                cleaned_objects = [
                    {k: convert_numpy(v) for k, v in obj.items()} for obj in detected_objects
                ]
                with open(detected_objects_path, 'w') as f:
                    json.dump(cleaned_objects, f, indent=2)

                saved_files.append({
                    "filename": image.filename,
                    "annotated_saved_as": annotated_path,
                    "depth_saved_as": depth_path,
                    "detected_objects_saved_as": detected_objects_path,
                    "detected_objects": cleaned_objects
                })

            except Exception as e:
                saved_files.append({
                    "filename": image.filename,
                    "error": str(e)
                })

    return saved_files

@app.route('/process', methods=['POST'])
def analyze_images():
    if 'images' not in request.files:
        return jsonify({"error": "No images uploaded"}), 400

    images = request.files.getlist('images')
    results = process_uploaded_images(images)

    return jsonify(results), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)


## no need for a get request api the post handles uploading it in the database make the ui handle this request