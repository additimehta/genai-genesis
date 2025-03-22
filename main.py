from segment import process_image, visualize_results
from gemini import analyze_accessibility
from PIL import Image
import numpy as np
import cv2

def save_numpy_as_image(np_array, output_path, cmap='inferno'):
    """Converts a numpy array (like depth map) to a visual image and saves it."""
    import matplotlib.pyplot as plt
    plt.imsave(output_path, np_array, cmap=cmap)

def save_annotated_image(image_np, output_path):
    """Saves the annotated numpy image as a PNG."""
    annotated_img = Image.fromarray(cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR))
    annotated_img.save(output_path)

def main():
    image_path = "stairs.jpeg"
    accessibility_type = "visual"

    # Step 1: Process the image
    img_np, seg_mask, depth_map, detected_objects, annotated_img  = process_image(image_path)

    # Step 2: Save intermediary images
    depth_map_path = "stairs_depth.png"
    annotated_path = "stairs_annotated.png"
    save_numpy_as_image(depth_map, depth_map_path)
    save_numpy_as_image(annotated_img, annotated_path)

    # Step 3: Analyze with Gemini
    print("\n🔍 Calling Gemini for accessibility analysis...\n")
    report = analyze_accessibility(
        prepro_img_path=image_path,
        depth_map_path=depth_map_path,
        annotated_image_path=annotated_path,
        detected_objects=detected_objects,
        accessibility_type=accessibility_type
    )

    visualize_results(img_np, seg_mask, depth_map, detected_objects)

    # Step 4: Output results
    print("\n🧠 Gemini Accessibility Report:\n")
    print(report)

if __name__ == "__main__":
    main()
