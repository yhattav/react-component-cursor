import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography } from 'antd';
import { PanInfo } from 'framer-motion';
import {
  calculateTotalForce,
  calculateAcceleration,
  calculateNewVelocity,
  calculateNewPosition,
} from '../utils/physics/physicsUtils';
import { getContainerOffset } from '../utils/dom/domUtils';
import { Point2D, GravityPoint, Force } from '../utils/types/physics';
import { GravityPointComponent } from '../components/GravityPoint/GravityPoint';
import { ParticleRenderer } from '../components/ParticleRenderer/ParticleRenderer';
import { StarPalette } from '../components/StarPalette/StarPalette';
import { StarTemplate } from '../types/star';
import { ModeSelector } from '../components/ModeSelector/ModeSelector';
import {
  PHYSICS_CONFIG,
  PARTICLE_MODES,
  INITIAL_GRAVITY_POINTS,
} from '../constants/physics';

const { Title, Paragraph } = Typography;

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

// Add a utility function to generate random pastel colors
const generatePastelColor = () => {
  // Use higher base values for pastel effect (between 180-255)
  const r = Math.floor(Math.random() * 75 + 180);
  const g = Math.floor(Math.random() * 75 + 180);
  const b = Math.floor(Math.random() * 75 + 180);
  return `rgb(${r}, ${g}, ${b})`;
};

export const GravitySection: React.FC<GravitySectionProps> = ({
  onDebugData,
}) => {
  const gravityRef = useRef<HTMLDivElement>(null);
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pointerPos, setPointerPos] = useState<Point2D>({ x: 0, y: 0 });
  const [gravityPoints, setGravityPoints] = useState<GravityPoint[]>(
    INITIAL_GRAVITY_POINTS
  );
  const [isDragging, setIsDragging] = useState(false);
  const [currentMode, setCurrentMode] =
    useState<keyof typeof PARTICLE_MODES>('NORMAL');
  const [isDraggingNewStar, setIsDraggingNewStar] = useState(false);
  const [dragPosition, setDragPosition] = useState<Point2D | null>(null);
  const [newStarTemplate, setNewStarTemplate] = useState<StarTemplate | null>(
    null
  );

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

      // Update trails - keep 5 seconds of trails
      const now = Date.now();
      const newTrails = [
        { x: particle.position.x, y: particle.position.y, timestamp: now },
        ...particle.trails.filter((t) => now - t.timestamp < 5000), // Increased to 5 seconds
      ].slice(0, 100); // Increased to 100 points for smoother, longer trail

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
      color: generatePastelColor(),
      size: 10,
      showVectors: true,
      trails: [],
      ...options,
    }),
    []
  );

  // Update click handler to create particles
  const handleContainerClick = useCallback(() => {
    if (isDragging || isDraggingNewStar) return;

    if (!isSimulationStarted) {
      setIsSimulationStarted(true);
    }

    // Create new particle at pointer position
    setParticles((current) => [...current, createParticle(pointerPos)]);
  }, [
    pointerPos,
    isSimulationStarted,
    isDragging,
    isDraggingNewStar,
    createParticle,
  ]);

  // Use effect to send debug data
  useEffect(() => {
    onDebugData?.({
      particle: {
        position: particles.map((particle) => particle.position),
        velocity: particles.map((particle) => particle.velocity),
      },
      pointer: {
        position: pointerPos,
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

  // Update StarPalette component to use proper drag handling
  const handleStarDragStart = useCallback((template: StarTemplate) => {
    setIsDraggingNewStar(true);
    setNewStarTemplate(template); // Set template for preview
  }, []);

  const handleStarDragEnd = useCallback(
    (template: StarTemplate, e: MouseEvent | TouchEvent | PointerEvent) => {
      setIsDraggingNewStar(false);
      if (gravityRef.current) {
        const rect = gravityRef.current.getBoundingClientRect();
        const clientX =
          'clientX' in e ? e.clientX : (e as TouchEvent).touches[0].clientX;
        const clientY =
          'clientY' in e ? e.clientY : (e as TouchEvent).touches[0].clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Only add if dropped within the container bounds
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setGravityPoints((points) => [
            ...points,
            {
              x,
              y,
              label: template.label,
              mass: template.mass,
              color: template.color,
            },
          ]);
        }
      }

      setIsDraggingNewStar(false);
      setNewStarTemplate(null);
      setDragPosition(null);
    },
    [] // No dependencies needed since we're not using isDraggingNewStar anymore
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
          
          .star-label {
            opacity: 0;
          }
          
          div:hover .star-label {
            opacity: 1;
          }
        `}
      </style>
      <Card
        ref={gravityRef}
        onClick={handleContainerClick}
        onDragOver={(e) => e.preventDefault()}
        style={{
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
          border: 'none',
          overflow: 'hidden',
        }}
      >
        <StarPalette
          onStarDragStart={handleStarDragStart}
          onStarDragEnd={handleStarDragEnd}
          containerRef={gravityRef}
          isDraggingNewStar={isDraggingNewStar}
          dragPosition={dragPosition}
          newStarTemplate={newStarTemplate}
          setDragPosition={setDragPosition}
        />

        {/* Replace the old gravity points rendering with GravityPointComponent */}
        {gravityPoints.map((point, index) => (
          <GravityPointComponent
            key={index}
            point={point}
            index={index}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            containerRef={gravityRef}
          />
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

        {/* Update particle rendering to use ParticleRenderer component */}
        {isSimulationStarted &&
          particles.map((particle) => (
            <ParticleRenderer
              key={particle.id}
              position={particle.position}
              velocity={particle.velocity}
              force={particle.force}
              color={particle.color}
              size={particle.size}
              showVectors={particle.showVectors}
              trails={particle.trails}
            />
          ))}

        {/* Replace renderModeSelector() with ModeSelector component */}
        <ModeSelector
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
        />
      </Card>
    </>
  );
};
