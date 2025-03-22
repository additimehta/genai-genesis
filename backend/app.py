from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Set up a folder to store uploaded images
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_files():
    print("Received upload request")
    if 'files' not in request.files:
        print("No files in the request")
        return jsonify({"error": "No file part"}), 400
    
    files = request.files.getlist('files')
    uploaded_files = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            uploaded_files.append(file_path)
            print(f"File uploaded: {file_path}")
        else:
            print("Invalid file type")
            return jsonify({"error": "Invalid file type"}), 400
    
    return jsonify({"message": "Files uploaded successfully", "files": uploaded_files}), 200


if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
