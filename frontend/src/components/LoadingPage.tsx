
import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface LoadingPageProps {
  onComplete: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate processing time with increasing progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 500); // Small delay after reaching 100%
          return 100;
        }
        return prevProgress + 5;
      });
    }, 300);
    
    return () => {
      clearInterval(timer);
    };
  }, [onComplete]);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="glass-card p-10 text-center max-w-md w-full">
        <div className="blue-gradient-bg text-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Loader size={36} className="animate-spin" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-accessible-text">Analyzing Your Image</h2>
        <p className="text-accessible-text/70 mb-6">
          We're processing your upload to identify accessibility features and challenges.
        </p>
        
        <div className="w-full bg-accessible-light/30 h-3 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-accessible-light to-accessible-dark transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-accessible-text/60 text-sm">{progress}% Complete</p>
      </div>
      
      <div className="mt-8 text-center text-accessible-text/70 max-w-md">
        <p>Our AI is carefully analyzing the spatial elements in your image to identify potential accessibility improvements.</p>
      </div>
    </div>
  );
};

export default LoadingPage;
