import cv2
import numpy as np
import matplotlib.pyplot as plt

def preprocess_image(image_path):
    # Step 1: Read the image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Error: Image not found or could not be loaded.")
    
    # Convert from BGR (OpenCV default) to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Step 2: Resize the image to a standard dimension (e.g., 800x600)
    target_width, target_height = 800, 600
    image_resized = cv2.resize(image_rgb, (target_width, target_height))
    
    # Step 3: Enhance Contrast
    # Convert to YUV color space and equalize the Y channel
    img_yuv = cv2.cvtColor(image_resized, cv2.COLOR_RGB2YUV)
    img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])
    image_contrast = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)
    
    # Step 4: Denoise the image using fastNlMeansDenoisingColored
    image_denoised = cv2.fastNlMeansDenoisingColored(image_contrast, None, 10, 10, 7, 21)
    
    # Step 5: Sharpen the image
    kernel_sharpening = np.array([[-1, -1, -1],
                                  [-1,  9, -1],
                                  [-1, -1, -1]])
    image_sharpened = cv2.filter2D(image_denoised, -1, kernel_sharpening)
    
    return image_sharpened

def display_image(image, title="Image"):
    plt.figure(figsize=(10, 8))
    plt.imshow(image)
    plt.title(title)
    plt.axis("off")
    plt.show()

if __name__ == "__main__":
    image_path = "test_image.png"
    try:
        preprocessed_image = preprocess_image(image_path)
        display_image(preprocessed_image, "Preprocessed Image")
    except Exception as e:
        print(e)
