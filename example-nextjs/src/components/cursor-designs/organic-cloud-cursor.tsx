'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props for OrganicCloudCursor component
 */
interface OrganicCloudCursorProps {
  /** Base amount multiplier for particle counts (default: 8) */
  amount?: number;
}

/**
 * Organic Cloud Cursor Design
 * Beautiful gradient cursor with organic cloud backdrop and particle effects
 * 
 * Features:
 * - Particle-based organic cloud effect with configurable particle counts
 * - Additional smaller particles for depth
 * - Smooth animations with randomized movement patterns
 * - Subtle outer particles with ping animation
 * 
 * @param amount - Base multiplier for particle counts:
 *   - Main particles: amount * 3
 *   - Small particles: amount * 2  
 *   - Subtle particles: amount * 0.5
 */
function OrganicCloudCursor({ amount = 8 }: OrganicCloudCursorProps) {
  // Calculate particle counts based on amount multiplier
  const mainParticleCount = Math.round(amount * 3);
  const smallParticleCount = Math.round(amount * 2);
  const subtleParticleCount = Math.max(1, Math.round(amount * 0.5));

  // Generate random offsets for each particle type (stable per component instance)
  const randomOffsets = React.useMemo(() => ({
    main: Math.floor(Math.random() * Math.max(1, mainParticleCount)),
    small: Math.floor(Math.random() * Math.max(1, smallParticleCount)),
    subtle: Math.floor(Math.random() * Math.max(1, subtleParticleCount)),
  }), [mainParticleCount, smallParticleCount, subtleParticleCount]);

  // Pre-generate stable random values to prevent jumpy animations
  const particles = React.useMemo(() => 
    [...Array(mainParticleCount)].map((_, i) => {
      const offsetI = i + randomOffsets.main;
      return {
        id: i,
        size: 20 + (Math.sin(offsetI * 2.3) * 0.5 + 0.5) * 40,
        baseX: Math.sin(offsetI * 1.7) * 60 - 30, 
        baseY: Math.cos(offsetI * 1.3) * 60 - 30, 
        moveRangeX: 15 + (Math.sin(offsetI * 3.1) * 0.5 + 0.5) * 20,
        moveRangeY: 15 + (Math.cos(offsetI * 2.7) * 0.5 + 0.5) * 20,
        hue: 147 + (Math.sin(offsetI * 1.9) * 0.5 + 0.5) * 89,
        saturation: 51 + (Math.cos(offsetI * 2.1) * 0.5 + 0.5) * 134,
        lightness: 234 + (Math.sin(offsetI * 1.1) * 0.5 + 0.5) * 21,
        opacity: 0.4 + (Math.cos(offsetI * 1.5) * 0.5 + 0.5) * 0.15,
        blur: 8 + (Math.sin(offsetI * 2.9) * 0.5 + 0.5) * 16,
        duration: 8 + (Math.cos(offsetI * 1.8) * 0.5 + 0.5) * 6,
        delay: (Math.sin(offsetI * 0.7) * 0.5 + 0.5) * 4,
             };
     }), [mainParticleCount, randomOffsets.main]
   );

    const smallParticles = React.useMemo(() => 
    [...Array(smallParticleCount)].map((_, i) => {
      const offsetI = i + randomOffsets.small;
      return {
        id: i,
        size: 8 + (Math.sin(offsetI * 3.2) * 0.5 + 0.5) * 15,
        baseX: Math.sin(offsetI * 2.4) * 40 - 20,
        baseY: Math.cos(offsetI * 1.8) * 40 - 20, 
        moveRangeX: 8 + (Math.sin(offsetI * 2.6) * 0.5 + 0.5) * 12,
        moveRangeY: 8 + (Math.cos(offsetI * 3.4) * 0.5 + 0.5) * 12,
        hue: 236 + (Math.sin(offsetI * 2.2) * 0.5 + 0.5) * 19,
        saturation: 72 + (Math.cos(offsetI * 1.6) * 0.5 + 0.5) * 103,
        lightness: 153 + (Math.sin(offsetI * 2.8) * 0.5 + 0.5) * 102,
        opacity: 0.4 + (Math.cos(offsetI * 2.0) * 0.5 + 0.5) * 0.1,
        blur: 4 + (Math.sin(offsetI * 1.4) * 0.5 + 0.5) * 8,
        duration: 6 + (Math.cos(offsetI * 2.5) * 0.5 + 0.5) * 4,
        delay: (Math.sin(offsetI * 1.2) * 0.5 + 0.5) * 3,
      };
    }), [smallParticleCount, randomOffsets.small]
   );

  return (
    <div className="relative">
      {/* Particle-based organic cloud effect */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.baseX}px`,
            top: `${particle.baseY}px`,
            background: `rgba(${Math.round(particle.hue)}, ${Math.round(particle.saturation)}, ${Math.round(particle.lightness)}, ${particle.opacity})`,
            filter: `blur(${particle.blur}px)`,
          }}
          animate={{
            x: [
              -particle.moveRangeX, 
              particle.moveRangeX * 0.7, 
              -particle.moveRangeX * 0.3, 
              particle.moveRangeX, 
              -particle.moveRangeX
            ],
            y: [
              -particle.moveRangeY, 
              particle.moveRangeY * 0.5, 
              particle.moveRangeY, 
              -particle.moveRangeY * 0.8, 
              -particle.moveRangeY
            ],
            scale: [1, 1.2, 0.8, 1.1, 1],
            opacity: [particle.opacity, particle.opacity * 1.8, particle.opacity * 0.6, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Additional smaller particles for depth */}
      {smallParticles.map((particle) => (
        <motion.div
          key={`small-${particle.id}`}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.baseX}px`,
            top: `${particle.baseY}px`,
            background: `rgba(${Math.round(particle.hue)}, ${Math.round(particle.saturation)}, ${Math.round(particle.lightness)}, ${particle.opacity})`,
            filter: `blur(${particle.blur}px)`,
          }}
          animate={{
            x: [
              -particle.moveRangeX, 
              particle.moveRangeX * 0.6, 
              particle.moveRangeX, 
              -particle.moveRangeX * 0.4, 
              -particle.moveRangeX
            ],
            y: [
              particle.moveRangeY, 
              -particle.moveRangeY * 0.7, 
              -particle.moveRangeY, 
              particle.moveRangeY * 0.3, 
              particle.moveRangeY
            ],
            scale: [0.8, 1.3, 1.0, 0.9, 0.8],
            opacity: [particle.opacity, particle.opacity * 1.6, particle.opacity * 0.8, particle.opacity * 1.2, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Subtle outer particles */}
      <div className="absolute -inset-6">
        {[...Array(subtleParticleCount)].map((_, i) => {
          const offsetI = i + randomOffsets.subtle;
          return (
            <div
              key={`outer-${i}`}
              className="absolute w-0.5 h-0.5 bg-purple-300/60 rounded-full animate-ping"
              style={{
                left: `${Math.cos(offsetI * 2.1) * 20 + 20}px`,
                top: `${Math.sin(offsetI * 2.1) * 20 + 20}px`,
                animationDelay: `${offsetI * 800}ms`,
                animationDuration: '3s',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export { OrganicCloudCursor }; 