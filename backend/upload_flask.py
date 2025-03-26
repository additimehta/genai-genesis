from flask import Flask, request, jsonify
from flask_cors import CORS 
import os
import json 


app = Flask(__name__)


CORS(app)

UPLOAD_FOLDER = 'uploads' 
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
       
        if 'image' not in request.files:
            return jsonify({"message": "No image part in request"}), 400
        file = request.files['image']
        

        if file.filename == '':
            return jsonify({"message": "No selected file"}), 400

      
        disability_data = request.form.get('disabilityData')
        if disability_data:
            disability_data = json.loads(disability_data) 
            disability_type = disability_data.get('type', 'unknown')
        else:
            disability_type = 'unknown'  
        

        sanitized_filename = f"{disability_type.replace(' ', '_').lower()}.png"
        new_file_path = os.path.join(UPLOAD_FOLDER, sanitized_filename)

       
        file.save(new_file_path)


        print(f"File renamed and saved as: {new_file_path}")

        return jsonify({
            "message": "Image uploaded successfully",
            "filePath": new_file_path
        }), 200

    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        return jsonify({"message": f"Error uploading file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
