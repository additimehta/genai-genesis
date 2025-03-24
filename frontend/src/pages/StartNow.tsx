import React, { useState } from 'react';
import { FileInput, X, Home, Check, Eye, Brain, CircleUserRound, Users2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import ProgressIndicator from '../components/ProgressIndicator';

const StartNow = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [disabilityType, setDisabilityType] = useState("all");
  const [uploadStatus, setUploadStatus] = useState("");
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      handleFiles(newFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      handleFiles(newFiles);
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.match('image.*'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please select at least one image file",
        variant: "destructive"
      });
      return;
    }
    
    const updatedImages = [...images, ...imageFiles];
    setImages(updatedImages);
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previews];
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };




  /// HANDLER FOR THE API VERY IMPORTANT
  const handleContinue = async () => {
    if (images.length > 0) {
      // Always proceed to the processing page with the preview image
      const proceedToProcessing = () => {
        navigate(`/processing?image=${encodeURIComponent(previews[0])}`);
      };

      // Try to upload to backend but don't block the user experience
      try {
        const formData = new FormData();
        formData.append("image", images[0]); // Upload the first image
        formData.append("disabilityType", disabilityType);

        // Set a timeout to ensure we continue even if the server is slow
        const uploadTimeout = setTimeout(() => {
          proceedToProcessing();
        }, 2000);

        const response = await fetch("http://127.0.0.1:5001/upload", {
          method: "POST",
          body: formData,
        });

        clearTimeout(uploadTimeout);

        if (response.ok) {
          const data = await response.json();
          setUploadStatus(data.message);
          toast({
            title: "Upload successful",
            description: data.message || "Image uploaded successfully",
          });
        }
        
        // Always proceed regardless of upload success
        proceedToProcessing();
      } catch (error) {
        console.log("Upload could not complete, but continuing with preview");
        // Continue with the preview regardless of upload status
        proceedToProcessing();
      }
    } else {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to continue",
        variant: "destructive"
      });
    }
  };

  const handleDisabilityTypeChange = (value: string) => {
    setDisabilityType(value);
  };

  const renderDisabilityTypeSelector = () => {
    return (
      <div className="mb-8 animate-fade-in">
        <h2 className="text-xl font-medium text-accessible-text mb-4">Select Accessibility Analysis Type</h2>
        <p className="text-accessible-text/70 mb-6">Choose which type of accessibility challenges to analyze for:</p>
        
        <RadioGroup 
          value={disabilityType} 
          onValueChange={handleDisabilityTypeChange}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="relative">
            <RadioGroupItem value="visual" id="visual" className="sr-only" />
            <Label
              htmlFor="visual"
              className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                disabilityType === 'visual' 
                  ? 'border-accessible-DEFAULT bg-accessible-dark/30 text-accessible-text' 
                  : 'border-accessible-light/50 hover:border-accessible-light'
              }`}
            >
              <div className="w-12 h-12 bg-accessible-light/70 rounded-full flex items-center justify-center mb-3">
                <Eye size={24} className="text-accessible-dark" />
              </div>
              <span className="font-medium">Visual</span>
              <p className="text-sm text-accessible-text/70 text-center mt-2">
                For challenges related to vision impairments
              </p>
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem value="cognitive" id="cognitive" className="sr-only" />
            <Label
              htmlFor="cognitive"
              className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                disabilityType === 'cognitive' 
                  ? 'border-accessible-DEFAULT bg-accessible-dark/30 text-accessible-text' 
                  : 'border-accessible-light/50 hover:border-accessible-light'
              }`}
            >
              <div className="w-12 h-12 bg-accessible-light/70 rounded-full flex items-center justify-center mb-3">
                <Brain size={24} className="text-accessible-dark" />
              </div>
              <span className="font-medium">Cognitive</span>
              <p className="text-sm text-accessible-text/70 text-center mt-2">
                For challenges related to cognitive processing
              </p>
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem value="mobility" id="mobility" className="sr-only" />
            <Label
              htmlFor="mobility"
              className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                disabilityType === 'mobility' 
                  ? 'border-accessible-DEFAULT bg-accessible-dark/30 text-accessible-text' 
                  : 'border-accessible-light/50 hover:border-accessible-light'
              }`}
            >
              <div className="w-12 h-12 bg-accessible-light/70 rounded-full flex items-center justify-center mb-3">
                <CircleUserRound size={24} className="text-accessible-dark" />
              </div>
              <span className="font-medium">Mobility</span>
              <p className="text-sm text-accessible-text/70 text-center mt-2">
                For challenges related to physical limitations
              </p>
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem value="all" id="all" className="sr-only" />
            <Label
              htmlFor="all"
              className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                disabilityType === 'all' 
                  ? 'border-accessible-DEFAULT bg-accessible-dark/30 text-accessible-text' 
                  : 'border-accessible-light/50 hover:border-accessible-light'
              }`}
            >
              <div className="w-12 h-12 bg-accessible-light/70 rounded-full flex items-center justify-center mb-3">
                <Users2 size={24} className="text-accessible-dark" />
              </div>
              <span className="font-medium">All Types</span>
              <p className="text-sm text-accessible-text/70 text-center mt-2">
                Analyze for all accessibility challenges
              </p>
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 container-custom">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <a 
            href="/"
            className="inline-flex items-center text-accessible-DEFAULT hover:text-accessible-dark transition-colors mb-6"
          >
            <Home size={18} className="mr-2" />
            Return Home
          </a>
          
          <h1 className="text-3xl md:text-4xl font-bold text-accessible-text mb-4">Upload Images</h1>
          <p className="text-lg text-accessible-text/70 mb-8">
            Take photos of your environment (indoors or outdoors) and upload them here. 
            We'll analyze them for accessibility challenges.
          </p>
          
          {/* Add ProgressIndicator component here */}
          <ProgressIndicator currentStep={0} />
          
          {renderDisabilityTypeSelector()}
          
          {previews.length === 0 ? (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                isDragging 
                  ? 'border-accessible-DEFAULT bg-accessible-light/20' 
                  : 'border-accessible-light hover:border-accessible-DEFAULT'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <FileInput 
                size={48} 
                className="mx-auto mb-4 text-accessible-dark" 
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-medium text-accessible-text mb-2">Drag & Drop your images here</h3>
              <p className="text-accessible-text/60 mb-6">or</p>
              
              <Button 
                className="bg-accessible-DEFAULT text-white px-6 py-3 rounded-lg font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('file-upload')?.click();
                }}
              >
                Browse Files
              </Button>
              
              <input 
                id="file-upload"
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                onChange={handleFileInput} 
                aria-label="Upload images"
              />
              
              <p className="mt-4 text-sm text-accessible-text/60">
                Supported formats: JPG, PNG, WebP. Max size: 10MB
              </p>
              
              {uploadStatus && (
                <p className="mt-4 p-3 bg-accessible-light/20 rounded-lg">
                  {uploadStatus}
                </p>
              )}
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-40 object-cover rounded-xl shadow-md"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-accessible-dark hover:bg-white transition-colors"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                <div 
                  className="border-2 border-dashed border-accessible-light rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-accessible-DEFAULT transition-colors"
                  onClick={() => document.getElementById('add-more-images')?.click()}
                >
                  <FileInput size={32} className="mb-2 text-accessible-dark" strokeWidth={1.5} />
                  <p className="text-accessible-text/70 text-center px-4">Add more images</p>
                  <input
                    id="add-more-images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-accessible-text">
                  <span className="font-medium">{images.length} {images.length === 1 ? 'image' : 'images'}</span> selected
                </p>
                
                {uploadStatus && (
                  <p className="text-sm bg-accessible-light/20 p-2 rounded-lg">
                    {uploadStatus}
                  </p>
                )}
                
                <Button
                  onClick={handleContinue}
                  className="bg-accessible-dark hover:bg-accessible-dark/90 text-white font-medium shadow-md transition-colors"
                >
                  Upload <Check size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-12 p-6 bg-accessible-light/30 rounded-lg">
            <h3 className="text-lg font-medium text-accessible-text mb-2">Privacy Note</h3>
            <p className="text-accessible-text/70">
              Your uploaded images are processed securely and used only for the purpose of 
              accessibility analysis. We don't store or share your images without your consent.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartNow;