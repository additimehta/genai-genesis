from transformers import SegformerFeatureExtractor, SegformerForSemanticSegmentation
from PIL import Image
import torch
import requests
import numpy as np
import matplotlib.pyplot as plt
import cv2

def process_image(image_path):
    image = Image.open(image_path).convert("RGB")
    img_np = np.array(image)

    # Segmenting the Image
    seg_feature_extractor = SegformerFeatureExtractor.from_pretrained("nvidia/segformer-b5-finetuned-ade-640-640")
    seg_model = SegformerForSemanticSegmentation.from_pretrained("nvidia/segformer-b5-finetuned-ade-640-640")

    ADE20K_LABELS = {
        0: "wall",
        14: "door",
        38: "railing",
        59: "stairway",
    }

    inputs = seg_feature_extractor(images=image, return_tensors="pt")
    outputs = seg_model(**inputs)
    logits = outputs.logits  # shape (batch_size, num_labels, height/4, width/4)

    segmentation_mask = logits.argmax(dim=1)[0].cpu().numpy()  # shape: (H, W)

    print(f"Reached the segmentation mask stage and completed! -> {segmentation_mask}")

    # Depth Map of the Image
    midas = torch.hub.load("intel-isl/MiDaS", "DPT_Large", trust_repo=True)
    midas.eval()

    midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms", trust_repo=True)
    transform = midas_transforms.dpt_transform

    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    input_batch = transform(img)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    midas.to(device)
    input_batch = input_batch.to(device)

    with torch.no_grad():
        prediction = midas(input_batch)
        prediction = torch.nn.functional.interpolate(
            prediction.unsqueeze(1),
            size=img.shape[:2],
            mode="bicubic",
            align_corners=False
        ).squeeze()

    depth_map = prediction.cpu().numpy()

    print(f"Reached the depth map stage and completed! -> {depth_map}")

    # --------------------------
    # Step 4: Merge Segmentation & Depth Data
    # --------------------------
    print("Merging segmentation with depth data...")
    # Ensure segmentation mask and depth map have the same dimensions.
    seg_h, seg_w = segmentation_mask.shape
    depth_h, depth_w = depth_map.shape

    if (seg_h != depth_h) or (seg_w != depth_w):
        print("The segmentation mask and the depth map don't have the same dimensions")
        segmentation_mask = cv2.resize(segmentation_mask.astype(np.uint8),
                                    (depth_w, depth_h),
                                    interpolation=cv2.INTER_NEAREST)

    # For each relevant object in our key class mapping, extract its mask, bounding box, and average depth.
    detected_objects = []
    unique_labels = np.unique(segmentation_mask)
    print(f"Unique_labels: {unique_labels}")
    for label in unique_labels:
        if label not in ADE20K_LABELS:
            print("Skip")
            continue  # Skip labels not in our defined mapping
        label_name = ADE20K_LABELS[label]
        mask = segmentation_mask == label
        if np.sum(mask) == 0:
            continue

        avg_depth = np.mean(depth_map[mask])
        # Find bounding box coordinates from the mask.
        coords = np.column_stack(np.where(mask))
        y_min, x_min = coords.min(axis=0)
        y_max, x_max = coords.max(axis=0)

        bbox = [int(x_min), int(y_min), int(x_max), int(y_max)]
        
        detected_objects.append({
            "label": label_name,
            "bbox": bbox,
            "average_depth": float(avg_depth),
            "area": int(np.sum(mask))
        })

    return img_np, segmentation_mask, depth_map, detected_objects

def visualize_results(image_np, segmentation_mask, depth_map, objects):
    # Create a copy of the original image for annotation
    annotated_img = image_np.copy()
    for obj in objects:
        x_min, y_min, x_max, y_max = obj["bbox"]
        cv2.rectangle(annotated_img, (x_min, y_min), (x_max, y_max), color=(255, 0, 0), thickness=2)
        label_text = f"{obj['label']} ({obj['average_depth']:.2f})"
        cv2.putText(annotated_img, label_text, (x_min, max(y_min - 5, 0)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), thickness=2)
    
    plt.figure(figsize=(14, 10))
    
    plt.subplot(2, 2, 1)
    plt.imshow(image_np)
    plt.title("Original Image")
    plt.axis("off")
    
    plt.subplot(2, 2, 2)
    plt.imshow(segmentation_mask, cmap="jet")
    plt.title("Segmentation Mask")
    plt.axis("off")
    
    plt.subplot(2, 2, 3)
    plt.imshow(depth_map, cmap="inferno")
    plt.title("Depth Map")
    plt.axis("off")
    
    plt.subplot(2, 2, 4)
    plt.imshow(annotated_img)
    plt.title("Annotated Image with Detected Objects")
    plt.axis("off")
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    # For standalone testing
    img_np, seg_mask, depth_map, objects = process_image("stairs.jpeg")
    print("Detected objects:", objects)
    visualize_results(img_np, seg_mask, depth_map, objects)