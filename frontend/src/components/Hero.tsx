import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Lightbulb, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accessible-light/20 via-transparent to-transparent"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-accessible-light to-accessible/20 opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-gradient-to-tr from-accessible to-accessible-light/20 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              <span className="text-gradient">Making Spaces Accessible</span>
              <br />
              <span className="bg-gradient-to-r from-accessible to-accessible-dark bg-clip-text text-transparent">For Everyone</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-accessible-text/80 mb-8 md:mb-10"
            >
              We help identify accessibility challenges in physical spaces and provide actionable solutions to improve accessibility for all people.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-row justify-center gap-4 items-center"  // Ensuring vertical alignment of buttons
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/start-now"
                  className="bg-gradient-to-r from-accessible to-accessible-dark hover:from-accessible-dark hover:to-accessible-dark text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 group shadow-lg transition-all duration-300"
                >
                  Start Now
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="#services"
                  className="bg-white/80 hover:bg-white text-accessible-dark border border-accessible-light/50 px-8 py-4 rounded-lg font-medium transition-all shadow-md backdrop-blur-sm"
                >
                  Learn More
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Floating card elements with icons instead of numbers */}
          <motion.div 
            className="mt-20 relative h-32 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div 
              className="absolute left-0 top-0 p-4 rounded-xl glass-card shadow-lg bg-white/80 backdrop-blur-sm"
              animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accessible/20 flex items-center justify-center text-accessible-dark">
                  <Camera size={18} />
                </div>
                <p className="text-sm font-medium text-accessible-dark">Upload Photos</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute left-1/2 top-1/3 transform -translate-x-1/2 p-4 rounded-xl glass-card shadow-lg bg-white/80 backdrop-blur-sm"
              animate={{ y: [0, -15, 0], rotate: [0, -1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accessible/20 flex items-center justify-center text-accessible-dark">
                  <Lightbulb size={18} />
                </div>
                <p className="text-sm font-medium text-accessible-dark">AI Analysis</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute right-0 top-0 p-4 rounded-xl glass-card shadow-lg bg-white/80 backdrop-blur-sm"
              animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accessible/20 flex items-center justify-center text-accessible-dark">
                  <CheckCircle size={18} />
                </div>
                <p className="text-sm font-medium text-accessible-dark">Get Solutions</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
