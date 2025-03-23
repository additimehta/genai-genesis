
import React, { useState } from 'react';
import Header from '../components/Header';
import { Home, Heart, Target, Users, Lightbulb, Award, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const About = () => {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  
  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const faqs = [
    {
      id: "faq1",
      question: "How does the accessibility assessment process work?",
      answer: "Our process is simple: upload photos of your space, our AI analyzes them for accessibility issues, you receive detailed recommendations with cost estimates, and we connect you with resources to implement the changes."
    },
    {
      id: "faq2",
      question: "What types of spaces can you help make more accessible?",
      answer: "We can assist with homes, businesses, educational institutions, healthcare facilities, public spaces, and more. Our recommendations are tailored to the specific needs of each environment."
    },
    {
      id: "faq3",
      question: "How accurate are your cost estimates?",
      answer: "Our estimates are based on current market rates and typically fall within 10-15% of actual costs. We provide ranges to account for variations in materials, labor, and regional pricing differences."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 animate-fade-in">
        <div className="container-custom">
          <a 
            href="/"
            className="inline-flex items-center text-accessible-DEFAULT hover:text-accessible-dark transition-colors mb-6"
          >
            <Home size={18} className="mr-2" />
            Return Home
          </a>
          
          {/* Hero Section with Parallax Effect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl mb-16 bg-accessible-dark text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accessible-dark to-accessible opacity-80"></div>
            <div className="relative z-10 px-8 py-16 md:py-24 max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
              >
                Making Spaces Accessible for Everyone
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xl mb-8 text-white/90"
              >
                We believe in a world where every person can navigate physical spaces with dignity and independence.
              </motion.p>
              <motion.a 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/start-now" 
                className="inline-flex items-center bg-white text-accessible-dark hover:bg-accessible-light px-6 py-3 rounded-lg font-medium transition-all"
              >
                Start Your Journey
                <ArrowRight size={18} className="ml-2" />
              </motion.a>
            </div>
          </motion.div>
          
          {/* Mission Section with Interactive Cards */}
          <motion.section 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-accessible-text mb-10 text-center">Our Mission</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                variants={item}
                whileHover={{ y: -5 }}
                className="glass-card p-6 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accessible/10 flex items-center justify-center mb-4">
                  <Heart className="text-accessible-DEFAULT" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Empowering Independence</h3>
                <p className="text-accessible-text/80">Creating environments where everyone can navigate with confidence and dignity.</p>
              </motion.div>
              
              <motion.div 
                variants={item}
                whileHover={{ y: -5 }}
                className="glass-card p-6 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accessible/10 flex items-center justify-center mb-4">
                  <Target className="text-accessible-DEFAULT" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Practical Solutions</h3>
                <p className="text-accessible-text/80">Providing actionable insights and cost-effective recommendations tailored to your space.</p>
              </motion.div>
              
              <motion.div 
                variants={item}
                whileHover={{ y: -5 }}
                className="glass-card p-6 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-accessible/10 flex items-center justify-center mb-4">
                  <Users className="text-accessible-DEFAULT" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Inclusive Communities</h3>
                <p className="text-accessible-text/80">Building a world where everyone feels welcome and can participate fully.</p>
              </motion.div>
            </div>
          </motion.section>
          
          {/* Approach Section with Interactive Hover Elements */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-accessible-text mb-10 text-center">Our Approach</h2>
            
            <div className="space-y-6">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-6 border border-accessible-light/50 rounded-lg cursor-pointer flex items-center"
                  >
                    <span className="w-10 h-10 rounded-full bg-accessible-light/30 flex items-center justify-center mr-4 text-accessible-DEFAULT font-bold">1</span>
                    <div>
                      <h3 className="text-xl font-semibold text-accessible-text">Identify</h3>
                      <p className="text-accessible-text/70">Upload images of your environment for analysis</p>
                    </div>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">How It Works:</h4>
                    <p className="text-sm">Our AI-powered system analyzes your uploaded images for accessibility issues, identifying potential barriers and opportunities for improvement.</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-6 border border-accessible-light/50 rounded-lg cursor-pointer flex items-center"
                  >
                    <span className="w-10 h-10 rounded-full bg-accessible-light/30 flex items-center justify-center mr-4 text-accessible-DEFAULT font-bold">2</span>
                    <div>
                      <h3 className="text-xl font-semibold text-accessible-text">Understand</h3>
                      <p className="text-accessible-text/70">Receive detailed recommendations with associated costs</p>
                    </div>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">How It Works:</h4>
                    <p className="text-sm">We provide comprehensive reports with clear explanations of accessibility issues, prioritized recommendations, and realistic cost estimates for implementation.</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-6 border border-accessible-light/50 rounded-lg cursor-pointer flex items-center"
                  >
                    <span className="w-10 h-10 rounded-full bg-accessible-light/30 flex items-center justify-center mr-4 text-accessible-DEFAULT font-bold">3</span>
                    <div>
                      <h3 className="text-xl font-semibold text-accessible-text">Implement</h3>
                      <p className="text-accessible-text/70">Access resources to help you make the necessary improvements</p>
                    </div>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">How It Works:</h4>
                    <p className="text-sm">Connect with our network of accessibility professionals, contractors, and product suppliers to bring your accessibility improvements to life.</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </motion.section>
          
          {/* Why Accessibility Matters Section */}
          <motion.section 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-accessible-text mb-10 text-center">Why Accessibility Matters</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                variants={item}
                className="p-6 rounded-lg bg-gradient-to-br from-accessible-light/20 to-transparent"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-accessible-light/40 flex items-center justify-center mr-3">
                    <Lightbulb className="text-accessible-dark" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-accessible-text">Better for Everyone</h3>
                </div>
                <p className="text-accessible-text/80">Designs that accommodate people with disabilities often benefit everyone. Ramps help parents with strollers, clear signage helps visitors, and good lighting benefits people with all levels of vision.</p>
              </motion.div>
              
              <motion.div 
                variants={item}
                className="p-6 rounded-lg bg-gradient-to-br from-accessible-light/20 to-transparent"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-accessible-light/40 flex items-center justify-center mr-3">
                    <Award className="text-accessible-dark" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-accessible-text">Business Advantage</h3>
                </div>
                <p className="text-accessible-text/80">Accessible spaces attract a wider customer base. With over 1 billion people worldwide having some form of disability, accessibility is both socially responsible and good for business.</p>
              </motion.div>
            </div>
          </motion.section>
          
          {/* FAQ Section with Collapsible Content */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-accessible-text mb-10 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Collapsible key={faq.id} open={openFAQ === faq.id} onOpenChange={() => toggleFAQ(faq.id)}>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex justify-between items-center p-4 bg-accessible-light/10 rounded-lg hover:bg-accessible-light/20 transition-colors cursor-pointer">
                      <h3 className="text-lg font-medium text-accessible-text text-left">{faq.question}</h3>
                      <div className="flex items-center justify-center w-6 h-6">
                        {openFAQ === faq.id ? 
                          <span className="text-accessible-DEFAULT">−</span> : 
                          <span className="text-accessible-DEFAULT">+</span>
                        }
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-2 text-accessible-text/80">
                      <p>{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </motion.section>
          
          {/* Call to Action Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 bg-gradient-to-r from-accessible to-accessible-dark rounded-2xl text-white text-center max-w-4xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Accessibility Journey Today</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Whether you're a homeowner, business owner, or facility manager, we're here to help you make your space more accessible for everyone.
            </p>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/start-now" 
              className="inline-flex items-center bg-white text-accessible-dark hover:bg-accessible-light px-6 py-3 rounded-lg font-medium transition-all"
            >
              Get Started
              <ArrowRight size={18} className="ml-2" />
            </motion.a>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About;
