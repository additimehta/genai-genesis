import requests

url = "http://127.0.0.1:5001/segment/process"
image_path = "backend/database/stairs.jpeg" 
files = {"images": open(image_path, "rb")}

response = requests.post(url, files=files)
print(response.json())

files["images"].close()  # Close the file after request
