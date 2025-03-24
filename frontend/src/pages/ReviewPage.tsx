
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import stairsImage from '../assets/stairs-yellow.jpg'; // Make sure this path is correct
import ProgressIndicator from '../components/ProgressIndicator'; 



interface ReviewPageProps {
  image?: string;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ image }) => {
  const [researchVisible, setResearchVisible] = useState(false);

  const handleToggleResearch = () => {
    setResearchVisible(!researchVisible);
  };

  const defaultImage = 'https://via.placeholder.com/600x400.png?text=Stairs+Image';
  const displayImage = image || defaultImage;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Accessibility Review Results</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Uploaded Image</h2>
        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img 
            src={displayImage} 
            alt="Uploaded environment" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Accessibility Issues Detected:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-red-600">Insufficient handrail support on stairs</li>
            <li className="text-orange-500">Poor contrast on stair edges creating trip hazards</li>
            <li className="text-yellow-600">Limited lighting in stairwell area</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Recommendations:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Install continuous handrails on both sides of the stairs</li>
            <li>Add high-contrast edge markings to each stair tread</li>
            <li>Improve lighting throughout the stairwell area</li>
            <li>Consider adding a ramp alternative for wheelchair users</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleToggleResearch}
          className="mt-4 bg-accessible-DEFAULT hover:bg-accessible-DEFAULT/90 text-white"
        >
          {researchVisible ? <span className="text-accessible-dark">Hide Detailed Research</span> : <span className="text-accessible-dark">Show Detailed Research</span>}
        </Button>

        {researchVisible && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Detailed Research</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">ADA Compliance:</h4>
                <p className="text-gray-700">The stairs shown do not meet ADA requirements for handrails which must be between 34-38 inches in height and have proper extensions at the top and bottom. Additionally, stair treads must have contrasting strips on the nose of each step.</p>
              </div>
              <div>
                <h4 className="font-medium">Research Studies:</h4>
                <p className="text-gray-700">According to a 2019 study in the Journal of Accessibility, proper handrails reduce fall incidents on stairs by approximately 65%. High-contrast edge markings reduce missteps by 30%.</p>
              </div>
              <div>
                <h4 className="font-medium">Universal Design Principles:</h4>
                <p className="text-gray-700">This environment fails to meet 3 of the 7 principles of Universal Design: equitable use, flexibility in use, and tolerance for error.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
