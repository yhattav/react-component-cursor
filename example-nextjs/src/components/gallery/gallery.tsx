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

const sizes = [
  'text-4xl md:text-6xl',
  'text-3xl md:text-5xl', 
  'text-5xl md:text-7xl',
  'text-3xl md:text-4xl',
  'text-4xl md:text-5xl',
];

export function Gallery({ items }: GalleryProps) {
  const [hoveredItem, setHoveredItem] = useState<GalleryItem | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [cursorOffset, setCursorOffset] = useState({ x: 30, y: -160 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic offset using linear interpolation based on cursor position percentage
  const calculateDynamicOffset = useCallback((cursorPosition: { x: number; y: number }) => {
    if (!containerRef.current) return { x: 30, y: -160 };

    const container = containerRef.current.getBoundingClientRect();
    
    // Calculate cursor position as percentage within container (0 to 1)
    const xPercent = (cursorPosition.x - container.left) / container.width;
    const yPercent = (cursorPosition.y - container.top) / container.height;
    
    // Clamp percentages to 0-1 range
    const xPercentClamped = Math.max(0, Math.min(1, xPercent));
    const yPercentClamped = Math.max(0, Math.min(1, yPercent));
    
    // Define offset ranges for smooth linear interpolation
    const X_OFFSET_MIN = 50;    // When cursor at left edge (0%), show image on right
    const X_OFFSET_MAX = -290;  // When cursor at right edge (100%), show image on left
    const Y_OFFSET_MIN = 50;    // When cursor at top edge (0%), show image below
    const Y_OFFSET_MAX = -370;  // When cursor at bottom edge (100%), show image above
    
    // Linear interpolation: min + (max - min) * percentage
    const offsetX = X_OFFSET_MIN + (X_OFFSET_MAX - X_OFFSET_MIN) * xPercentClamped;
    const offsetY = Y_OFFSET_MIN + (Y_OFFSET_MAX - Y_OFFSET_MIN) * yPercentClamped;

    return { x: offsetX, y: offsetY };
  }, []);

  // Handle cursor movement to update offset
  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    const newOffset = calculateDynamicOffset(position);
    setCursorOffset(newOffset);
  }, [calculateDynamicOffset]);

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
    <div ref={containerRef} className="relative w-full min-h-[80vh]">
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
        smoothness={30}
        zIndex={40}
        offset={cursorOffset}
        onMove={handleCursorMove}
      >
        {hoveredItem ? (
          <div className="pointer-events-none relative">
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
          const textSize = sizes[index % sizes.length];
          
          return (
            <div
              key={item.id}
              className="p-4 flex-shrink-0 relative"
              style={{
                mixBlendMode: 'difference',
                zIndex: hoveredItem?.id === item.id ? 50 : 10
              }}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              <h2 
                className={`
                  ${textSize} font-bold
                  text-white/70
                  select-none
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
                  by {item.photographer}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}