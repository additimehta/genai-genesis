
import React from 'react';
import { Camera, AlertTriangle, FileText } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Camera size={36} className="text-accessible-DEFAULT" />,
      title: "Environmental Analysis",
      description: "Upload photos of your environment, and our system will identify potential accessibility challenges.",
    },
    {
      icon: <AlertTriangle size={36} className="text-accessible-DEFAULT" />,
      title: "Accessibility Assessment",
      description: "Receive a comprehensive analysis of accessibility issues with detailed recommendations for improvement.",
    },
    {
      icon: <FileText size={36} className="text-accessible-DEFAULT" />,
      title: "Resource Connection",
      description: "Access a curated list of resources, contractors, and tools to implement the recommended accessibility improvements.",
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white relative">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-accessible-text mb-4">Our Services</h2>
          <p className="text-lg text-accessible-text/70 max-w-2xl mx-auto">
            We provide a simple three-step process to help you identify and address accessibility challenges in any environment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="glass-card p-8 transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold text-accessible-text mb-3">{service.title}</h3>
              <p className="text-accessible-text/70">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block bg-accessible-light/30 px-6 py-3 rounded-full text-accessible-dark">
            Simple process. Real results. Better accessibility for everyone.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
