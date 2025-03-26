from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app) 

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/upload", methods=["POST"])
def upload_file():
    print("Incoming request:", request.content_type)  # Debug request type

    if "image" not in request.files:
        print("❌ No file part in request")
        return jsonify({"error": "No file part"}), 400  

    file = request.files["image"]
    print("Received file:", file.filename)  # Debug filename

    if file.filename == "":
        print("❌ No file selected")
        return jsonify({"error": "No selected file"}), 400  

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)
    print("✅ File saved:", file_path)

    return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200

if __name__ == "__main__":
    app.run(debug=True)
