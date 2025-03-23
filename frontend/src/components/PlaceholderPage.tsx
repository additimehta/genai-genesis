
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PlaceholderPageProps {
  onContinue: () => void;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="card-gradient p-8 rounded-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-accessible-text">Analysis Complete</h2>
        <p className="text-accessible-text/70 mb-6">
          Your image has been analyzed. We've identified several accessibility considerations.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item} 
              className="bg-white/50 p-4 rounded-lg border border-accessible-light/30"
            >
              <div className="w-full h-4 bg-accessible-light/30 rounded-full mb-2"></div>
              <div className="w-3/4 h-3 bg-accessible-light/30 rounded-full"></div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onContinue}
          className="button-gradient text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          Continue to Review
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
