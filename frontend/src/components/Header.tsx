import React from 'react';
import { Link } from 'react-router-dom'; // Correct import for Link

function Header() {
  return (
    <header className="absolute w-full py-6 px-8 z-10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-sky-500">
          AccessAbility
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/" className="text-gray-800 hover:text-sky-500 transition-colors">Home</Link>
          <Link to="/services" className="text-gray-800 hover:text-sky-500 transition-colors">Services</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
