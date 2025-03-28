import torch
import urllib.request
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load MiDaS model
midas = torch.hub.load("intel-isl/MiDaS", "DPT_Large", trust_repo=True)
midas.eval()

# Load transforms
midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms", trust_repo=True)
transform = midas_transforms.dpt_transform

# Load your image
img = cv2.imread("test_image.png")
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Preprocess (note: no unsqueeze here)
input_batch = transform(img)

# Move to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
midas.to(device)
input_batch = input_batch.to(device)

# Predict
with torch.no_grad():
    prediction = midas(input_batch)
    prediction = torch.nn.functional.interpolate(
        prediction.unsqueeze(1),
        size=img.shape[:2],
        mode="bicubic",
        align_corners=False
    ).squeeze()

depth_map = prediction.cpu().numpy()

# Visualize
plt.imshow(depth_map, cmap='inferno')
plt.title("Estimated Depth Map")
plt.axis('off')
plt.show()