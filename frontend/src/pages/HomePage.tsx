import React, { useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom'; // Correct import
import { ChevronDown } from 'lucide-react';

function HomePage() {
    const scrollToServices = (e: React.MouseEvent) => {
      e.preventDefault();
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_50%)]" />
        <Header />
        <main className="relative">
          {/* Hero Section */}
          <section className="pt-48 pb-32 px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="inline-block bg-sky-100/80 text-sky-500 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                Empowering Lives Through Accessibility
              </div>
              <h1 className="text-6xl font-bold text-gray-900 mb-6">
                Making the World More <span className="text-sky-500">Accessible</span>
                <br />for Everyone
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                We provide resources, support, and assistive technologies to help individuals
                with disabilities live more independent and fulfilling lives.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/start"
                  className="bg-sky-500 text-white px-8 py-4 rounded-full hover:bg-sky-600 transition-colors font-medium text-lg backdrop-blur-sm"
                >
                  Explore Our Services
                </Link>
                <button
                  onClick={scrollToServices}
                  className="bg-white/80 text-gray-800 px-8 py-4 rounded-full hover:bg-white transition-colors font-medium text-lg border border-gray-200 backdrop-blur-sm"
                >
                  Learn More
                </button>
              </div>
              <div className="mt-24 animate-bounce">
                <ChevronDown className="w-8 h-8 text-gray-400 mx-auto" />
              </div>
            </div>
          </section>
  
          {/* Services Section */}
          <section id="services" className="py-24 px-8 bg-gradient-to-b from-white via-sky-50/50 to-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_70%)]" />
            <div className="max-w-7xl mx-auto relative">
              <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Our Services</h2>
              <div className="grid md:grid-cols-3 gap-12">
                <div className="bg-white/80 p-8 rounded-2xl backdrop-blur-sm shadow-lg shadow-sky-100/50 hover:shadow-xl hover:shadow-sky-200/50 transition-all">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Space Analysis</h3>
                  <p className="text-gray-600">
                    Upload photos of your space and receive detailed accessibility analysis using our advanced assessment tools.
                  </p>
                </div>
                <div className="bg-white/80 p-8 rounded-2xl backdrop-blur-sm shadow-lg shadow-sky-100/50 hover:shadow-xl hover:shadow-sky-200/50 transition-all">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Detailed Reports</h3>
                  <p className="text-gray-600">
                    Get comprehensive reports with specific recommendations for improving accessibility in your space.
                  </p>
                </div>
                <div className="bg-white/80 p-8 rounded-2xl backdrop-blur-sm shadow-lg shadow-sky-100/50 hover:shadow-xl hover:shadow-sky-200/50 transition-all">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cost Estimation</h3>
                  <p className="text-gray-600">
                    Receive detailed cost estimates for implementing recommended accessibility improvements.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }


  export default HomePage