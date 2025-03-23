
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../components/Header';

const Costings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-16 container-custom animate-fade-in relative">
        {/* Background gradient elements */}
        <div className="absolute -top-20 right-0 w-96 h-96 bg-accessible-light rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-accessible-light rounded-full opacity-30 blur-3xl"></div>
        
        <div className="max-w-3xl mx-auto">
          <a 
            href="/"
            className="inline-flex items-center text-accessible hover:text-accessible-dark transition-colors mb-6"
          >
            <Home size={18} className="mr-2" />
            Return Home
          </a>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">Costings Overview</h1>
          <p className="text-lg text-accessible-text/70 mb-12">
            Here's an overview of potential costs for implementing the recommended accessibility improvements.
          </p>
          
          <div className="card-gradient p-10 text-center rounded-2xl">
            <h2 className="text-2xl font-semibold text-accessible-text mb-4">Coming Soon</h2>
            <p className="text-accessible-text/70 mb-8">
              This feature is currently under development. Check back later for detailed cost analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/start-now')}
                className="bg-accessible-light hover:bg-accessible-light/80 text-accessible-dark px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              
              <button
                onClick={() => navigate('/resources')}
                className="button-gradient text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Costings;
