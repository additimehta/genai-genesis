import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/#services' },
    { name: 'Start Now', path: '/start-now' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4 md:py-5">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-accessible-dark font-bold text-2xl md:text-3xl transition-opacity hover:opacity-90"
            aria-label="Home"
          >
            <span className="font-extrabold tracking-tight">
              AccessPath
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-accessible-text hover:text-accessible-DEFAULT transition-all duration-200 text-lg ${
                  location.pathname === item.path ? 'font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-accessible-text hover:bg-accessible-light transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-accessible-light animate-slide-up">
          <div className="container-custom py-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`block transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-accessible-light/50 ${location.pathname === item.path ? 'bg-accessible-light/30' : ''}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
