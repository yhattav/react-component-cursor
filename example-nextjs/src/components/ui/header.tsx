'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaNpm } from 'react-icons/fa';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { HiOutlineExternalLink } from 'react-icons/hi';

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
    },
    {
      label: 'NPM',
      href: 'https://www.npmjs.com/package/@yhattav/react-component-cursor',
      icon: FaNpm,
      tooltip: 'Install package',
    },
    {
      label: 'Issues',
      href: 'https://github.com/yhattav/react-component-cursor/issues',
      icon: IoAlertCircleOutline,
      tooltip: 'Report issues',
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
            border-b border-white/10
            ${className}
          `}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Library Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RC</span>
                </div>
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
                className="flex items-center gap-1"
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
                        scale: 1.1,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="
                        group relative flex items-center gap-2 
                        px-3 py-2 rounded-lg
                        text-gray-300 hover:text-white
                        bg-white/5 hover:bg-white/10
                        border border-white/10 hover:border-white/20
                        transition-all duration-200
                      "
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm font-medium">
                        {link.label}
                      </span>
                      <HiOutlineExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      
                      {/* Tooltip for mobile */}
                      <div className="
                        sm:hidden absolute -bottom-8 left-1/2 transform -translate-x-1/2
                        bg-gray-900 text-white text-xs px-2 py-1 rounded
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none
                      ">
                        {link.tooltip}
                      </div>
                    </motion.a>
                  );
                })}
              </motion.nav>
            </div>
          </div>

          {/* Subtle bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.header>
      )}
    </AnimatePresence>
  );
}

export { Header }; 