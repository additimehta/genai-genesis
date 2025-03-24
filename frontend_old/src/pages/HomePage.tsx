import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Your App
        </h1>
        <p className="text-lg text-gray-600">
          This is your homepage. The background gradients should be visible, and this content should be rendered on top of them.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
