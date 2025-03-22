import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UploadPage from "./pages/UploadPage";
import HomePage from './pages/HomePage';







/*
function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.1),transparent_50%)]" />
      <Header />
      <div className="max-w-4xl mx-auto pt-32 px-8 relative">
        <div className="bg-white/80 rounded-2xl p-12 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Upload Your Space Photos</h2>
          <p className="text-gray-600 mb-8">
            Take photos of the areas you'd like to assess for accessibility improvements. Include entrances, pathways, stairs, and any potential barriers.
          </p>
          <div className="border-2 border-dashed border-sky-200 rounded-xl p-12 text-center">
            <p className="text-gray-600 mb-4">Drag and drop your photos here, or click to select files</p>
            <button className="bg-sky-500 text-white px-8 py-3 rounded-full hover:bg-sky-600 transition-colors font-medium backdrop-blur-sm">
              Select Files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

*/




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/start" element={<UploadPage/>} />
      </Routes>
    </Router>
  );
}

export default App;