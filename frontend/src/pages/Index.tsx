
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient orbs for visual interest */}
      <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-gradient-to-r from-accessible-light/30 to-accessible/20 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-gradient-to-l from-accessible/30 to-accessible-dark/20 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-accessible-dark/20 to-accessible-light/20 blur-3xl animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      
      {/* Interactive floating elements */}
      <motion.div 
        className="absolute top-[30%] right-[10%] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute top-[60%] left-[5%] w-10 h-10 rounded-full bg-accessible-light/20 backdrop-blur-sm border border-white/10"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-[15%] right-[15%] w-16 h-16 rounded-lg bg-gradient-to-r from-accessible/20 to-accessible-dark/10 backdrop-blur-sm"
        animate={{
          y: [0, -25, 0],
          rotate: [0, -8, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <Header />
      <main className="relative z-10">
        <Hero />
        <Services />
        
        {/* Additional gradient section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accessible-light/10 to-transparent"></div>
          <div className="container-custom relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">Begin Your Accessibility Journey</h2>
              <p className="text-lg text-accessible-text/80 mb-8">
                Our innovative platform combines AI technology with accessibility expertise to make your spaces more inclusive.
              </p>
              <motion.a 
                href="/start-now"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center button-gradient text-white px-6 py-3 rounded-lg font-medium"
              >
                Get Started Today
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
