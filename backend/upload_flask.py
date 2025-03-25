from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS for handling CORS issues
import os
import json

app = Flask(__name__)

CORS(app)  

UPLOAD_FOLDER = 'uploads'  
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  

@app.route('/upload', methods=['POST'])
def upload_file():
    try:



        # FILE UPLOADS
        # Get the uploaded file from the request
        if 'image' not in request.files:
            return jsonify({"message": "No image part in request"}), 400
        file = request.files['image']
        
        # If no file is selected
        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400
        
        # Save the file to the server
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        # Log the file save
        print(f"File saved to: {file_path}")
        
        # DISABILITY TYPE JSON FORMAT
        disability_data = request.form.get('disabilityData')
        if disability_data:
            disability_data = json.loads(disability_data)  # Parse the disability data
        
        # FOMRAT
        json_data = {
            "disabilityType": disability_data.get('type', 'Unknown'),
            "filePath": file_path
        }

        # Log the JSON data
        print(f"Generated JSON data: {json_data}")

        # JSON FILE PATH
        json_filename = os.path.splitext(file.filename)[0] + "_data.json"
        json_file_path = os.path.join(UPLOAD_FOLDER, json_filename)
        

        print(f"JSON file will be saved at: {json_file_path}")
        with open(json_file_path, 'w') as json_file:
            json.dump(json_data, json_file)

        print(f"JSON file saved: {json_file_path}")
        return jsonify({
            "message": "Image uploaded successfully",
            "disabilityType": disability_data.get('type', 'Unknown'),
            "filePath": file_path,
            "jsonFilePath": json_file_path  # Include the JSON file path
        }), 200

    except Exception as e:
        # Log the error
        print(f"Error uploading file: {str(e)}")
        return jsonify({"message": f"Error uploading file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
