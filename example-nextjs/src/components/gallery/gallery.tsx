'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  photographer: string;
}

export interface GalleryProps {
  items: GalleryItem[];
}

export function Gallery({ items }: GalleryProps) {
  const [hoveredItem, setHoveredItem] = useState<GalleryItem | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload all images for instant hover response
  useEffect(() => {
    const loadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set(prev).add(src));
          resolve();
        };
        img.onerror = () => resolve(); // Continue even if image fails
        img.src = src;
      });
    };

    // Preload all images in parallel
    Promise.all(items.map(item => loadImage(item.imageUrl)));
  }, [items]);

  const handleMouseEnter = useCallback((item: GalleryItem) => {
    setHoveredItem(item);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-[80vh]" style={{ cursor: 'none' }}>
      {/* Hidden preloaded images for instant display */}
      <div className="absolute opacity-0 pointer-events-none -z-50">
        {items.map(item => (
          <img
            key={item.id}
            src={item.imageUrl}
            alt={item.title}
            className="w-[280px] h-[350px] object-cover"
            loading="eager"
            decoding="sync"
          />
        ))}
      </div>

      {/* Cursor with image - controlled z-index to stay below hovered text */}
      <CustomCursor
        containerRef={containerRef}
        smoothness={1}
        zIndex={40}
      >
        {hoveredItem ? (
          <div 
            className="pointer-events-none relative"
            style={{
              transform: 'translate(30px, -160px)',
            }}
          >
            <img
              src={hoveredItem.imageUrl}
              alt={hoveredItem.title}
              className="w-[280px] h-[350px] object-cover rounded-sm shadow-xl"
              loading="eager"
              decoding="sync"
              style={{
                // No transition for instant appearance
                opacity: preloadedImages.has(hoveredItem.imageUrl) ? 1 : 0.5
              }}
            />
          </div>
        ) : (
          <div className="w-1 h-1 bg-purple-500/30 rounded-full" />
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
              className="cursor-none p-4 flex-shrink-0 relative"
              style={{
                zIndex: hoveredItem?.id === item.id ? 50 : 10
              }}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              <h2 
                className={`
                  ${textSize} font-bold
                  text-white/70
                  cursor-none select-none
                  transition-all duration-75 ease-out
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
              
              {/* Photographer credit */}
              <div className="mt-1">
                <span className="text-white/40 text-sm font-light tracking-wide">
                  Photo by {item.photographer}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}