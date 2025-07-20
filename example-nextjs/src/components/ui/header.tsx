'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaNpm, FaBug, FaDesktop } from 'react-icons/fa';
import { AnimatedGrid } from './animated-grid';

interface HeaderProps {
  className?: string;
}

function Header({ className = '' }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showMobileIndicator, setShowMobileIndicator] = useState(true);

  useEffect(() => {
    const checkTouchDevice = () => {
      // Multiple checks for better cross-browser compatibility
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const isTouchScreen = hasTouchSupport || hasCoarsePointer;
      
      setIsTouchDevice(isTouchScreen);
    };

    checkTouchDevice();
    
    // Listen for media query changes (e.g., when docking/undocking tablet)
    const pointerMediaQuery = window.matchMedia('(pointer: coarse)');
    const handlePointerChange = () => checkTouchDevice();
    
    pointerMediaQuery.addEventListener('change', handlePointerChange);
    
    return () => {
      pointerMediaQuery.removeEventListener('change', handlePointerChange);
    };
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Header is hiding for the first time - permanently hide mobile indicator
        if (isVisible && showMobileIndicator) {
          setShowMobileIndicator(false);
        }
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const handleScroll = () => {
      requestAnimationFrame(controlNavbar);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isVisible, showMobileIndicator]);

  const getResponsiveIconClasses = (label: string) => {
    if (label === 'NPM') {
      return 'w-8 h-8 sm:w-10 sm:h-10';
    }
    return 'w-4 h-4 sm:w-5 sm:h-5';
  };

  const navigationLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com/yhattav/react-component-cursor',
      icon: FaGithub,
      tooltip: 'View source code',
      iconSize: 'w-5 h-5',
    },
    {
      label: 'NPM',
      href: 'https://www.npmjs.com/package/@yhattav/react-component-cursor',
      icon: FaNpm,
      tooltip: 'Install package',
      iconSize: 'w-10 h-10',
    },
    {
      label: 'Issues',
      href: 'https://github.com/yhattav/react-component-cursor/issues',
      icon: FaBug,
      tooltip: 'Report issues',
      iconSize: 'w-5 h-5',
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className={`
            fixed top-0 left-0 right-0 z-50 
            backdrop-blur-md bg-black/10 
            ${className}
          `}
        >
          <AnimatedGrid
            cols={{ base: 1 }}
            borderColor="rgba(59, 130, 246, 1)"
            borderThickness={1}
            borderSides={['bottom']}
            glowRadius={250}
            smoothness={3}
            className="w-full"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Library Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center"
                >
                  <div>
                    <h1 className="text-white font-bold text-base sm:text-lg leading-none">
                      React Component Cursor
                    </h1>
                    <p className="text-gray-400 text-xs">
                      Professional cursor enhancement
                    </p>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <motion.nav
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center gap-2 sm:gap-4"
                >
                  {navigationLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.tooltip}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: 0.3 + (index * 0.1), 
                          duration: 0.3,
                          type: 'spring',
                          stiffness: 200
                        }}
                        whileHover={{ 
                          scale: 1.2,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="
                          p-1.5 sm:p-2 text-gray-300 hover:text-white
                          transition-colors duration-200
                        "
                      >
                        <IconComponent className={getResponsiveIconClasses(link.label)} />
                      </motion.a>
                    );
                  })}
                </motion.nav>
              </div>

              {/* Touch Device Desktop Indicator */}
              <AnimatePresence>
                {isTouchDevice && showMobileIndicator && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="border-t border-gray-700/50 mt-3 pt-3"
                  >
                    <div className="flex items-center justify-center gap-2 text-orange-300/90">
                      <FaDesktop className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Best viewed on desktop for full cursor experience
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AnimatedGrid>
        </motion.header>
      )}
    </AnimatePresence>
  );
}

export { Header }; 