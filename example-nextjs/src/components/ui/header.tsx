'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaNpm, FaBug } from 'react-icons/fa';
import { AnimatedGrid } from './animated-grid';

interface HeaderProps {
  className?: string;
}

function Header({ className = '' }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
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
  }, [lastScrollY]);

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
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Library Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="flex items-center"
                >
                  <div>
                    <h1 className="text-white font-bold text-lg leading-none">
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
                  className="flex items-center gap-4"
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
                          p-2 text-gray-300 hover:text-white
                          transition-colors duration-200
                        "
                      >
                        <IconComponent className={link.iconSize} />
                      </motion.a>
                    );
                  })}
                </motion.nav>
              </div>
            </div>
          </AnimatedGrid>
        </motion.header>
      )}
    </AnimatePresence>
  );
}

export { Header }; 