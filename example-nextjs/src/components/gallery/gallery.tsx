'use client';

import React, { useState, useCallback, useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
}

export interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const [hoveredItem, setHoveredItem] = useState<GalleryItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((item: GalleryItem) => {
    setHoveredItem(item);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-[80vh]" style={{ cursor: 'none' }}>
      {/* Cursor with image */}
      <CustomCursor
        containerRef={containerRef}
        smoothness={2}
        className="z-40"
      >
        {hoveredItem ? (
          <div 
            className="pointer-events-none relative"
            style={{
              transform: 'translate(30px, -160px)', // Position like reference: right and slightly up
            }}
          >
            <img
              src={hoveredItem.imageUrl}
              alt={hoveredItem.title}
              className="w-[280px] h-[350px] object-cover rounded-sm shadow-xl"
              style={{
                transition: 'opacity 0.2s ease'
              }}
            />
          </div>
        ) : (
          <div className="w-4 h-4 bg-purple-500 rounded-full opacity-50" />
        )}
      </CustomCursor>

      {/* Flex Layout - No Gaps, Fully Responsive */}
      <div 
        className="p-8"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {items.map((item, index) => {
          // Vary text sizes to create visual interest like reference
          const sizes = [
            'text-4xl md:text-6xl',
            'text-3xl md:text-5xl', 
            'text-5xl md:text-7xl',
            'text-3xl md:text-4xl',
            'text-4xl md:text-5xl',
          ];
          
          const textSize = sizes[index % sizes.length];
          
          return (
            <div
              key={item.id}
              className="cursor-none p-4 flex-shrink-0"
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              <h2 
                className={`
                  ${textSize} font-bold
                  text-white/70
                  cursor-none select-none
                  transition-all duration-200 ease-out
                  ${hoveredItem?.id === item.id 
                    ? 'text-white scale-105' 
                    : 'hover:text-white/90'
                  }
                `}
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  lineHeight: '0.9',
                }}
              >
                {item.title}
              </h2>
              
              {/* Subtle category text like in reference */}
              <div className="mt-1">
                <span className="text-white/40 text-sm font-light tracking-wide">
                  Digital Art
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}