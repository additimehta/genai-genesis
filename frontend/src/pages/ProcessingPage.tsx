import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';
import PlaceholderPage from '../components/PlaceholderPage';
import Header from '../components/Header';
import ProgressIndicator from '../components/ProgressIndicator'; 
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const ProcessingPage = () => {
  const [currentStep, setCurrentStep] = useState<'loading' | 'analysis'>('loading');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const imageUrl = searchParams.get('image') || "/lovable-uploads/fe6dc10c-1ba2-4217-855f-cddb7829acd2.png";
  const thermalImageUrl = "/lovable-uploads/f07e86c1-9772-4f98-a96a-02fa1f65d153.png";

  useEffect(() => {
    // If no image parameter is provided, we now have a default
    const timer = setTimeout(() => {
      setCurrentStep('analysis');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [imageUrl]);

  const handleLoadingComplete = () => {
    setCurrentStep('analysis');
  };

  const handleContinueToReview = () => {
    // Navigate to review page with the staircase image
    navigate(`/review`);
  };

  // Determine progress step based on the current processing stage
  const progressStep = currentStep === 'loading' ? 1 : 2;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 container-custom">
        {/* Add ProgressIndicator at the top of the page */}
        <div className="max-w-3xl mx-auto mb-8">
          <ProgressIndicator currentStep={progressStep} />
        </div>
        
        <ResizablePanelGroup direction="horizontal" className="min-h-[400px] rounded-lg border">
          <ResizablePanel defaultSize={65} minSize={40}>
            {currentStep === 'loading' ? (
              <LoadingPage onComplete={handleLoadingComplete} />
            ) : (
              <PlaceholderPage onContinue={handleContinueToReview} />
            )}
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col items-center justify-center p-6 bg-black/5">
              <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={currentStep === 'loading' ? thermalImageUrl : imageUrl} 
                  alt={currentStep === 'loading' ? "Thermal imaging visualization" : "Staircase image for accessibility review"} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
                  <p>{currentStep === 'loading' ? "Thermal Imaging Analysis" : "Image Processing"}</p>
                  <p className="text-xs opacity-70">Visual representation of spatial analysis</p>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default ProcessingPage;