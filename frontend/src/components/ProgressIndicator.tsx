
import React from 'react';
import { Check, Upload, Image, MousePointer, Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  currentStep: number;
}

const steps = [
  { name: 'Upload', icon: Upload },
  { name: 'Processing', icon: Loader },
  { name: 'Analyze', icon: Image },
  { name: 'Review', icon: MousePointer },
];

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <Progress value={progress} className="h-2 mb-4" />
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-accessible-dark text-accessible-light' 
                    : isActive 
                      ? 'bg-accessible-dark text-accessible-light' 
                      : 'bg-accessible-light/50 text-accessible-dark'
                }`}
              >
                {isCompleted ? (
                  <Check size={20} stroke="#FFFFFF" />
                ) : (
                  <StepIcon size={20} stroke={isActive ? "#FFFFFF" : "#403E43"} />
                )}
              </div>
              <span 
                className={`text-sm font-medium ${
                  isCompleted || isActive ? 'text-accessible-text' : 'text-accessible-text/60'
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
