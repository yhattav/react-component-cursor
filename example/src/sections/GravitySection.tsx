import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography } from 'antd';
import { motion, PanInfo } from 'framer-motion';
import { drawArrow } from '../utils/physics/vectorUtils';
import {
  calculateGravitationalForce,
  calculateTotalForce,
  calculateAcceleration,
  calculateNewVelocity,
  calculateNewPosition,
} from '../utils/physics/physicsUtils';
import { getContainerOffset } from '../utils/dom/domUtils';
import { Point2D, GravityPoint, Force } from '../utils/types/physics';

const { Title, Paragraph } = Typography;

// Move physics constants to a config
const PHYSICS_CONFIG = {
  CURSOR_MASS: 0.1,
  FRICTION: 0.999,
  DELTA_TIME: 1 / 60,
  POINTER_MASS: 50000,
} as const;

interface GravitySectionProps {
  onDebugData?: (data: any) => void;
}

// Add new interfaces for particle state management
interface ParticleMechanics {
  position: Point2D;
  velocity: Point2D;
  force: Force;
  mass: number;
}

interface Particle extends ParticleMechanics {
  id: string;
  color: string;
  size: number;
  showVectors: boolean;
  trails: TrailPoint[];
}

// Add new interface for trail points
interface TrailPoint extends Point2D {
  timestamp: number;
}

// Add particle creation modes
const PARTICLE_MODES = {
  NORMAL: { mass: 0.1, size: 20, color: '#666' },
  HEAVY: { mass: 1.0, size: 30, color: '#FF5252' },
  LIGHT: { mass: 0.05, size: 15, color: '#4CAF50' },
} as const;

// Separate particle rendering function that's more flexible
const renderParticle = ({
  position,
  velocity,
  force,
  color = '#BADA55',
  size = 20,
  showVectors = true,
  trails = [],
}: ParticleRenderParams) => {
  return (
    <>
      {showVectors && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {/* Velocity vector */}
          {drawArrow(
            position.x,
            position.y,
            velocity.x,
            velocity.y,
            '#4CAF50',
            40
          )}

          {/* Force/Acceleration vector */}
          {drawArrow(
            position.x,
            position.y,
            force.fx,
            force.fy,
            '#FF4081',
            200
          )}
        </svg>
      )}
      <motion.div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: 'transparent',
          border: `2px solid ${color}`,
          borderRadius: '50%',
          position: 'fixed',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.2s ease',
          boxShadow: `0 0 20px rgba(255,255,255,0.2)`,
        }}
      />

      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {trails.length > 1 &&
          trails.slice(0, -1).map((point, i) => {
            const nextPoint = trails[i + 1];
            const progress = 1 - i / (trails.length - 1);
            return (
              <line
                key={i}
                x1={point.x}
                y1={point.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                stroke={color}
                strokeWidth={size * progress}
                strokeOpacity={progress * 0.8}
                strokeLinecap="round"
              />
            );
          })}
      </svg>
    </>
  );
};

export const GravitySection: React.FC<GravitySectionProps> = ({
  onDebugData,
}) => {
  const gravityRef = useRef<HTMLDivElement>(null);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pointerPos, setPointerPos] = useState<Point2D>({ x: 0, y: 0 });
  const [gravityPoints, setGravityPoints] = useState<GravityPoint[]>([
    { x: 700, y: 700, label: 'Heavy', mass: 50000, color: '#FF6B6B' },
    { x: 500, y: 150, label: 'Medium', mass: 30000, color: '#4ECDC4' },
    { x: 350, y: 250, label: 'Light', mass: 10000, color: '#45B7D1' },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentMode, setCurrentMode] =
    useState<keyof typeof PARTICLE_MODES>('NORMAL');

  const handleDrag = useCallback((e: any, info: PanInfo, index: number) => {
    setIsDragging(true);
    const offset = getContainerOffset(gravityRef);
    if (!offset) return;

    setGravityPoints((points) =>
      points.map((point, i) =>
        i === index
          ? { ...point, x: info.point.x - offset.x, y: info.point.y - offset.y }
          : point
      )
    );
  }, []);

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 0);
  };

  // Add function to convert between coordinate systems
  const offset = getContainerOffset(gravityRef);

  // Extract physics update logic
  const updateParticleMechanics = useCallback(
    (
      particle: ParticleMechanics & { trails: TrailPoint[] }
    ): ParticleMechanics => {
      const force = calculateTotalForce(
        particle.position,
        pointerPos,
        gravityPoints,
        offset,
        PHYSICS_CONFIG.POINTER_MASS
      );

      const acceleration = calculateAcceleration(force, particle.mass);
      const newVelocity = calculateNewVelocity(
        particle.velocity,
        acceleration,
        PHYSICS_CONFIG.DELTA_TIME,
        PHYSICS_CONFIG.FRICTION
      );
      const newPosition = calculateNewPosition(
        particle.position,
        newVelocity,
        PHYSICS_CONFIG.DELTA_TIME
      );

      // Update trails - keep 3 seconds of trails
      const now = Date.now();
      const newTrails = [
        { x: particle.position.x, y: particle.position.y, timestamp: now },
        ...particle.trails.filter((t) => now - t.timestamp < 3000), // Keep 3 seconds of trails
      ].slice(0, 75); // Increase to 75 points for smoother trail

      return {
        position: newPosition,
        velocity: newVelocity,
        force,
        mass: particle.mass,
        trails: newTrails,
      };
    },
    [pointerPos]
  );

  // Update animation frame effect to handle multiple particles
  useEffect(() => {
    if (!isSimulationStarted) return;

    let animationFrameId: number;

    const updateParticles = () => {
      const offset = getContainerOffset(gravityRef);

      setParticles((currentParticles) =>
        currentParticles.map((particle) => {
          const mechanics = updateParticleMechanics(particle);
          return { ...particle, ...mechanics };
        })
      );

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSimulationStarted, gravityPoints, updateParticleMechanics]);

  // Add particle creation helper
  const createParticle = useCallback(
    (
      position: Point2D,
      options: Partial<Omit<Particle, 'position' | 'id'>> = {}
    ): Particle => ({
      id: Math.random().toString(36).substr(2, 9),
      position,
      velocity: { x: 0, y: 0 },
      force: { fx: 0, fy: 0 },
      mass: PHYSICS_CONFIG.CURSOR_MASS,
      color: '#666',
      size: 20,
      showVectors: true,
      trails: [],
      ...options,
    }),
    []
  );

  // Update click handler to create particles
  const handleContainerClick = useCallback(() => {
    if (isDragging) return;

    if (!isSimulationStarted) {
      setIsSimulationStarted(true);
    }

    // Create new particle at pointer position
    setParticles((current) => [...current, createParticle(pointerPos)]);
  }, [pointerPos, isSimulationStarted, isDragging, createParticle]);

  // Use effect to send debug data
  useEffect(() => {
    onDebugData?.({
      particle: {
        position: particles.map((particle) => particle.position),
        velocity: particles.map((particle) => particle.velocity),
      },
      pointer: {
        position: pointerPos,
        force: calculateGravitationalForce(
          pointerPos.x,
          pointerPos.y,
          PHYSICS_CONFIG.POINTER_MASS
        ),
      },
      velocity: particles.map((particle) => particle.velocity),
      totalForce: particles.map((particle) => particle.force),
    });
  }, [particles, pointerPos, onDebugData]);

  // Modify animation effect to only run when simulation is started
  useEffect(() => {
    if (!isSimulationStarted) return;

    let animationFrameId: number;
    const friction = 1;
    const deltaTime = 1 / 60;

    const updateCursorPosition = () => {
      const force = calculateTotalForce(
        particles.map((particle) => particle.position),
        pointerPos,
        gravityPoints,
        offset
      );

      // Calculate acceleration using F = ma
      const ax = Number.isFinite(force.fx)
        ? force.fx / PHYSICS_CONFIG.CURSOR_MASS
        : 0;
      const ay = Number.isFinite(force.fy)
        ? force.fy / PHYSICS_CONFIG.CURSOR_MASS
        : 0;

      // Update velocity using the existing velocity state
      setParticles((currentParticles) =>
        currentParticles.map((particle) => ({
          ...particle,
          velocity: {
            x: Number.isFinite(particle.velocity.x + ax * deltaTime)
              ? (particle.velocity.x + ax * deltaTime) * friction
              : 0,
            y: Number.isFinite(particle.velocity.y + ay * deltaTime)
              ? (particle.velocity.y + ay * deltaTime) * friction
              : 0,
          },
        }))
      );

      // Update position using the current velocity state
      setParticles((currentParticles) =>
        currentParticles.map((particle) => ({
          ...particle,
          position: {
            x: Number.isFinite(
              particle.position.x + particle.velocity.x * deltaTime
            )
              ? particle.position.x + particle.velocity.x * deltaTime
              : particle.position.x,
            y: Number.isFinite(
              particle.position.y + particle.velocity.y * deltaTime
            )
              ? particle.position.y + particle.velocity.y * deltaTime
              : particle.position.y,
          },
        }))
      );

      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    animationFrameId = requestAnimationFrame(updateCursorPosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, pointerPos, gravityPoints, offset, isSimulationStarted]);

  const handleCursorMove = useCallback((x: number, y: number) => {
    if (isFinite(x) && isFinite(y)) {
      setPointerPos({ x, y });
    }
  }, []);

  // Keep the styles as a constant
  const GRAVITY_STYLES = {
    field: (point: GravityPoint) => ({
      position: 'absolute' as const,
      left: point.x,
      top: point.y,
      width: `${point.mass / 100}px`,
      height: `${point.mass / 100}px`,
      background: `radial-gradient(circle at center, 
        ${point.color}20 0%, 
        ${point.color}10 30%, 
        ${point.color}05 60%, 
        transparent 70%
      )`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none' as const,
      transition: 'all 0.3s ease',
      animation: 'pulse 2s infinite ease-in-out',
      zIndex: 1,
    }),
  };

  // Keep the render function
  const renderGravityField = (point: GravityPoint, index: number) => (
    <div key={`field-${index}`} style={GRAVITY_STYLES.field(point)} />
  );

  // Add mode selector UI
  const renderModeSelector = () => (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        gap: '10px',
        zIndex: 100,
      }}
    >
      {Object.entries(PARTICLE_MODES).map(([mode, props]) => (
        <button
          key={mode}
          onClick={() => setCurrentMode(mode as keyof typeof PARTICLE_MODES)}
          style={{
            background: currentMode === mode ? props.color : 'transparent',
            border: `2px solid ${props.color}`,
            borderRadius: '50%',
            width: props.size,
            height: props.size,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>
      <Card
        ref={gravityRef}
        onClick={handleContainerClick}
        style={{
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
          border: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Add gravity field visualization before the gravity points */}
        {gravityPoints.map((point, index) => renderGravityField(point, index))}

        {/* Existing gravity points rendering */}
        {gravityPoints.map((point, index) => (
          <motion.div
            key={`point-${index}`}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDrag={(e, info) => handleDrag(e, info, index)}
            onDragEnd={handleDragEnd}
            initial={{ x: point.x, y: point.y }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              cursor: 'grab',
              zIndex: 2, // Ensure points are above the fields
            }}
            dragConstraints={gravityRef}
            whileDrag={{ cursor: 'grabbing' }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: point.color,
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 10px ${point.color}`,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: point.color,
                fontSize: '12px',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(0,0,0,0.5)',
                pointerEvents: 'none', // Prevent text from interfering with drag
              }}
            >
              {point.label}
              <div
                style={{
                  width: '50px',
                  height: '4px',
                  background: `linear-gradient(90deg, ${point.color} ${
                    point.mass / 1000
                  }%, transparent ${point.mass / 1000}%)`,
                  borderRadius: '2px',
                  marginTop: '4px',
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Simplified CustomCursor only for tracking pointer position */}
        <CustomCursor
          containerRef={gravityRef}
          smoothFactor={1}
          onMove={handleCursorMove}
          hideNativeCursor={false}
        >
          <div style={{ width: '100vw', height: '100vh' }} />
        </CustomCursor>

        {/* Render all particles */}
        {isSimulationStarted &&
          particles.map((particle) => (
            <React.Fragment key={particle.id}>
              {renderParticle({
                position: particle.position,
                velocity: particle.velocity,
                force: particle.force,
                color: particle.color,
                size: particle.size,
                showVectors: particle.showVectors,
                trails: particle.trails,
              })}
            </React.Fragment>
          ))}

        {/* Render mode selector */}
        {renderModeSelector()}
      </Card>
    </>
  );
};
