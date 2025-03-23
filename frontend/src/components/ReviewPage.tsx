
import React, { useState } from 'react';
import { Home, Info, AlertTriangle, HelpCircle, FileText, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AccessibilityPoint {
  id: number;
  x: number;
  y: number;
  title: string;
  description: string;
  width: number;
  height: number;
  priority: 'low' | 'medium' | 'high';
  solutions: string[];
  cost: string;
  regulation?: string;
}

interface ReviewPageProps {
  imageUrl: string;
  edgesImageUrl?: string; // Optional URL of the edge-detected image
}

const ReviewPage: React.FC<ReviewPageProps> = ({ imageUrl, edgesImageUrl }) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);
  
  // Sample accessibility points based on the staircase image
  const accessibilityPoints: AccessibilityPoint[] = [
    {
      id: 1,
      x: 50, 
      y: 70,
      width: 70, 
      height: 25,
      title: "Staircase Safety",
      description: "The staircase lacks contrast marking on steps and adequate handrails. This creates fall hazards for visually impaired individuals and mobility challenges.",
      priority: 'high',
      solutions: [
        "Add high-contrast strips to the front edge of each step",
        "Install continuous handrails on both sides of the staircase",
        "Ensure adequate lighting throughout the stairwell"
      ],
      cost: "$1,200 - $2,500",
      regulation: "ADA Standards §§ 504.2, 504.4, 504.6"
    },
    {
      id: 2,
      x: 85, 
      y: 40,
      width: 12, 
      height: 12,
      title: "Door Accessibility",
      description: "The door appears to have insufficient clear width and may require excessive force to operate, creating barriers for wheelchair users.",
      priority: 'medium',
      solutions: [
        "Widen doorway to minimum 32 inches clear width",
        "Install automatic door opener or reduce opening force",
        "Add lever-style door handles instead of knobs"
      ],
      cost: "$800 - $3,500",
      regulation: "ADA Standards §§ 404.2.3, 404.2.7, 404.2.9"
    },
    {
      id: 3,
      x: 20, 
      y: 35,
      width: 15, 
      height: 30,
      title: "Wall Clearance",
      description: "The narrow corridor with concrete walls may not provide adequate passing space for wheelchair users or those with mobility aids.",
      priority: 'medium',
      solutions: [
        "Ensure minimum 36-inch pathway width throughout corridor",
        "Remove or relocate protruding objects that reduce clear width",
        "Add passing spaces at intervals for narrow corridors"
      ],
      cost: "$500 - $1,800",
      regulation: "ADA Standards §§ 403.5.1, 403.5.3"
    },
    {
      id: 4,
      x: 60, 
      y: 25,
      width: 20, 
      height: 10,
      title: "Lighting Levels",
      description: "The overhead lighting appears insufficient and unevenly distributed, creating navigation challenges for those with visual impairments.",
      priority: 'low',
      solutions: [
        "Increase lighting levels to minimum 10 foot-candles (108 lux)",
        "Eliminate glare and provide uniform illumination",
        "Consider motion-sensor lighting for energy efficiency"
      ],
      cost: "$600 - $1,500",
      regulation: "IBC § 1008 (Illumination of Means of Egress)"
    }
  ];

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  const priorityIcons = {
    high: <AlertTriangle size={14} className="text-red-600" />,
    medium: <Info size={14} className="text-amber-600" />,
    low: <HelpCircle size={14} className="text-green-600" />
  };
  
  return (
    <div className="py-8">
      <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-accessible-text">Accessibility Review</h2>
        <p className="text-accessible-text/70">
          Hover over the highlighted areas to see detailed accessibility recommendations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 relative bg-black/5 rounded-xl overflow-hidden">
          <div className="relative w-full" style={{ maxHeight: '80vh', overflow: 'hidden' }}>
            {/* User uploaded image */}
            <img 
              src={imageUrl} 
              alt="Uploaded environment with accessibility analysis" 
              className="w-full h-auto object-contain"
            />
            
            {/* Edge detection overlay if available */}
            {edgesImageUrl && (
              <img
                src={edgesImageUrl}
                alt="Edge-detected overlay"
                className="absolute top-0 left-0 w-full h-full opacity-60 pointer-events-none"
              />
            )}
            
            {/* Accessibility points */}
            {accessibilityPoints.map(point => (
              <React.Fragment key={point.id}>
                <HoverCard openDelay={100} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div 
                      className={`absolute cursor-pointer transition-all duration-300 border-2 ${
                        activePoint === point.id 
                          ? 'border-accessible-DEFAULT bg-accessible-DEFAULT/20' 
                          : 'border-accessible-DEFAULT hover:bg-accessible-DEFAULT/10'
                      }`}
                      style={{ 
                        left: `${point.x - (point.width/2)}%`, 
                        top: `${point.y - (point.height/2)}%`,
                        width: `${point.width}%`,
                        height: `${point.height}%`,
                        borderRadius: '4px',
                      }}
                      onMouseEnter={() => setActivePoint(point.id)}
                      onMouseLeave={() => setActivePoint(null)}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center ${
                              activePoint === point.id 
                                ? 'bg-accessible-DEFAULT text-white shadow-lg scale-110' 
                                : 'bg-accessible-DEFAULT text-white'
                            } transition-all duration-200`}>
                              {priorityIcons[point.priority]}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="font-medium">
                            {point.title}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-0 shadow-lg border-0 overflow-hidden bg-white">
                    <CardHeader className="bg-accessible-DEFAULT text-white p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{point.title}</CardTitle>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          point.priority === 'high' ? 'bg-red-500/20 text-white' :
                          point.priority === 'medium' ? 'bg-amber-500/20 text-white' :
                          'bg-green-500/20 text-white'
                        }`}>
                          {point.priority.charAt(0).toUpperCase() + point.priority.slice(1)} Priority
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-sm text-accessible-text/90">{point.description}</p>
                      
                      {point.regulation && (
                        <div className="mt-2 flex items-start gap-2">
                          <FileText size={16} className="text-accessible-DEFAULT mt-0.5" />
                          <p className="text-xs text-accessible-text/70">{point.regulation}</p>
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-accessible-DEFAULT flex items-center">
                          <Lightbulb size={14} className="mr-1" /> Solutions:
                        </h4>
                        <ul className="mt-1 space-y-1">
                          {point.solutions.map((solution, idx) => (
                            <li key={idx} className="text-xs text-accessible-text/80 flex">
                              <span className="mr-2">•</span>
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-accessible-light/20 p-3 text-xs">
                      <span className="font-medium text-accessible-dark">Est. Cost:</span>
                      <span className="ml-2 text-accessible-text/70">{point.cost}</span>
                    </CardFooter>
                  </HoverCardContent>
                </HoverCard>
                
                {/* Connect line when point is active */}
                {activePoint === point.id && (
                  <svg 
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                    style={{ overflow: 'visible' }}
                  >
                    <line 
                      x1={`${point.x}%`} 
                      y1={`${point.y}%`} 
                      x2="100%" 
                      y2={`${point.y}%`}
                      stroke="#1493C0"
                      strokeWidth="2"
                      strokeDasharray="4"
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-3">
          {activePoint !== null ? (
            <div className="card-gradient p-6 rounded-xl animate-fade-in">
              <h3 className="text-xl font-bold mb-3 text-accessible-dark flex items-center gap-2">
                {accessibilityPoints.find(p => p.id === activePoint)?.title}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  priorityColors[accessibilityPoints.find(p => p.id === activePoint)?.priority || 'medium']
                }`}>
                  {accessibilityPoints.find(p => p.id === activePoint)?.priority.toUpperCase()} PRIORITY
                </span>
              </h3>
              <p className="text-accessible-text/80">
                {accessibilityPoints.find(p => p.id === activePoint)?.description}
              </p>
              <div className="mt-6 pt-6 border-t border-accessible-light/30">
                <h4 className="font-medium mb-2 text-accessible-dark">Recommended Solutions:</h4>
                <ul className="list-disc list-inside text-accessible-text/80 space-y-2">
                  {accessibilityPoints.find(p => p.id === activePoint)?.solutions.map((solution, idx) => (
                    <li key={idx}>{solution}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card-gradient p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-accessible-dark">Accessibility Analysis</h3>
              <p className="text-accessible-text/80 mb-4">
                Hover over the highlighted areas in the image to see detailed accessibility recommendations.
              </p>
              <p className="text-accessible-text/70 text-sm mb-4">
                We've identified {accessibilityPoints.length} areas that could be improved for better accessibility.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-accessible-light/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-accessible-dark">Areas of Concern</h4>
                  <ul className="space-y-2">
                    {accessibilityPoints.map(point => (
                      <li key={point.id} className="flex items-center gap-2 text-sm">
                        {priorityIcons[point.priority]}
                        <span className="text-accessible-text/80">{point.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-accessible-light/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-accessible-dark">Priority Distribution</h4>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-red-500 rounded-sm"></div>
                      <span className="text-sm text-accessible-text/80">High Priority: {accessibilityPoints.filter(p => p.priority === 'high').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-amber-500 rounded-sm"></div>
                      <span className="text-sm text-accessible-text/80">Medium Priority: {accessibilityPoints.filter(p => p.priority === 'medium').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-green-500 rounded-sm"></div>
                      <span className="text-sm text-accessible-text/80">Low Priority: {accessibilityPoints.filter(p => p.priority === 'low').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="card-gradient p-6 rounded-xl mt-6">
            <h3 className="text-xl font-bold mb-3 text-accessible-dark">Summary</h3>
            <p className="text-accessible-text/80 mb-4">
              This stairwell area has several accessibility concerns that should be addressed to ensure compliance with ADA standards and improve usability for all visitors.
            </p>
            <div className="bg-accessible-light/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-accessible-dark">Overall Assessment</h4>
              <p className="text-accessible-text/80">
                <span className="font-medium">Priority Level:</span> High
              </p>
              <p className="text-accessible-text/80 mt-2">
                <span className="font-medium">Estimated Total Cost:</span> $3,100 - $9,300
              </p>
              <p className="text-accessible-text/80 mt-2">
                <span className="font-medium">Timeline:</span> 3-6 weeks
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-accessible-DEFAULT hover:text-accessible-dark transition-colors"
            >
              <Home size={18} />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
