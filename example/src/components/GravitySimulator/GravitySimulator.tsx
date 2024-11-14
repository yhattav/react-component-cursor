import React, { useState, useCallback, useEffect } from 'react';
import { Point2D, GravityPoint, Force } from '../../utils/types/physics';
import { GravityPointComponent } from '../GravityPoint/GravityPoint';
import { ParticleRenderer } from '../ParticleRenderer/ParticleRenderer';
import { StarPalette } from '../StarPalette/StarPalette';
import { StarTemplate } from '../../types/star';
import {
  calculateTotalForce,
  calculateAcceleration,
  calculateNewVelocity,
  calculateNewPosition,
} from '../../utils/physics/physicsUtils';
import { getContainerOffset } from '../../utils/dom/domUtils';
import { INITIAL_GRAVITY_POINTS } from '../../constants/physics';
import { SimulatorSettings } from '../SimulatorSettings/SimulatorSettings';
import { useSettings } from '../../hooks/useSettings';
import { throttle } from 'lodash';

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

interface TrailPoint extends Point2D {
  timestamp: number;
}

interface GravitySimulatorProps {
  gravityRef: React.RefObject<HTMLDivElement>;
  pointerPos: Point2D;
  onDebugData?: (data: any) => void;
  className?: string;
}

const generatePastelColor = () => {
  const r = Math.floor(Math.random() * 75 + 180);
  const g = Math.floor(Math.random() * 75 + 180);
  const b = Math.floor(Math.random() * 75 + 180);
  return `rgb(${r}, ${g}, ${b})`;
};

export const GravitySimulator: React.FC<GravitySimulatorProps> = ({
  gravityRef,
  pointerPos,
  onDebugData,
  className,
}) => {
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gravityPoints, setGravityPoints] = useState<GravityPoint[]>(
    INITIAL_GRAVITY_POINTS
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingNewStar, setIsDraggingNewStar] = useState(false);
  const { settings: physicsConfig, updateSettings } = useSettings();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [throttledPointerPos, setThrottledPointerPos] = useState(pointerPos);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      gravityRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, [gravityRef]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleDrag = throttle(() => {
    console.log('handleDrag');
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  });

  const handleReportNewPosition = useCallback(
    throttle((point: Point2D, index: number) => {
      console.log('handleReportNewPosition');
      const offset = getContainerOffset(gravityRef);
      if (!offset) return;

      setGravityPoints((points) =>
        points.map((point2, i) =>
          i === index
            ? { ...point2, x: point.x - offset.x, y: point.y - offset.y }
            : point2
        )
      );
    }, 16),
    [gravityRef]
  );

  const handleDragEnd = () => {
    console.log('handleDragEnd');
    setTimeout(() => {
      setIsDragging(false);
    }, 0);
  };

  const offset = getContainerOffset(gravityRef);

  useEffect(() => {
    const throttledUpdate = throttle((newPos: Point2D) => {
      console.log('Moving mouse');
      setThrottledPointerPos(newPos);
    }, physicsConfig.DELTA_TIME * 1000);

    throttledUpdate(pointerPos);
    return () => throttledUpdate.cancel();
  }, [pointerPos, physicsConfig.DELTA_TIME]);

  const updateParticleMechanics = useCallback(
    (
      particle: ParticleMechanics & { trails: TrailPoint[] }
    ): ParticleMechanics => {
      const force = calculateTotalForce(
        particle.position,
        throttledPointerPos,
        gravityPoints,
        offset,
        physicsConfig.POINTER_MASS
      );

      const acceleration = calculateAcceleration(force, particle.mass);
      const newVelocity = calculateNewVelocity(
        particle.velocity,
        acceleration,
        physicsConfig.DELTA_TIME,
        physicsConfig.FRICTION
      );
      const newPosition = calculateNewPosition(
        particle.position,
        newVelocity,
        physicsConfig.DELTA_TIME
      );

      const now = Date.now();
      const newTrails = [
        { x: particle.position.x, y: particle.position.y, timestamp: now },
        ...particle.trails.filter((t) => now - t.timestamp < 5000),
      ].slice(0, 100);

      return {
        position: newPosition,
        velocity: newVelocity,
        force,
        mass: particle.mass,
        trails: newTrails,
      };
    },
    [throttledPointerPos, gravityPoints, offset, physicsConfig]
  );

  useEffect(() => {
    if (!isSimulationStarted) return;

    let animationFrameId: number;
    //const lastTime = performance.now();
    // let accumulator = 0;

    const updateParticles = (currentTime: number) => {
      // const frameTime = (currentTime - lastTime) / 1000;
      // lastTime = currentTime;
      // accumulator += frameTime;

      // if (accumulator >= physicsConfig.DELTA_TIME) {
      //   accumulator = 0;

      setParticles((currentParticles) =>
        currentParticles.map((particle) => {
          const mechanics = updateParticleMechanics(particle);
          return { ...particle, ...mechanics };
        })
      );
      // }

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSimulationStarted, updateParticleMechanics, physicsConfig.DELTA_TIME]);

  const createParticle = useCallback(
    (
      position: Point2D,
      options: Partial<Omit<Particle, 'position' | 'id'>> = {}
    ): Particle => ({
      id: Math.random().toString(36).substr(2, 9),
      position,
      velocity: { x: 0, y: 0 },
      force: { fx: 0, fy: 0 },
      mass: physicsConfig.NEW_PARTICLE_MASS,
      color: generatePastelColor(),
      size: 10,
      showVectors: true,
      trails: [{ ...position, timestamp: Date.now() }],
      ...options,
    }),
    [physicsConfig]
  );

  const handleContainerClick = useCallback(() => {
    console.log('handleContainerClick');
    console.log(isDragging, isDraggingNewStar);
    if (isDragging || isDraggingNewStar) return;

    if (!isSimulationStarted) {
      setIsSimulationStarted(true);
    }

    setParticles((current) => [...current, createParticle(pointerPos)]);
  }, [
    pointerPos,
    isSimulationStarted,
    isDragging,
    isDraggingNewStar,
    createParticle,
  ]);

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

  const handleStarDragStart = useCallback(() => {
    setIsDraggingNewStar(true);
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

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setGravityPoints((points) => [
            ...points,
            {
              id: Math.random().toString(36).substr(2, 9),
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
    },
    []
  );

  const handlePointDelete = useCallback((index: number) => {
    setGravityPoints((points) => points.filter((_, i) => i !== index));
  }, []);

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
            transition: opacity 0.2s ease-in-out;
          }
          
          div:hover .star-label {
            opacity: 1;
          }
        `}
      </style>
      <div
        ref={gravityRef}
        onClick={handleContainerClick}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',

          zIndex: 1,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent particle creation
            toggleFullscreen();
          }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 2,
            padding: '0.5rem',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
          }}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>

        <StarPalette
          onStarDragStart={handleStarDragStart}
          onStarDragEnd={handleStarDragEnd}
          containerRef={gravityRef}
        />

        {gravityPoints.map((point, index) => (
          <GravityPointComponent
            key={point.id}
            point={point}
            index={index}
            onDrag={handleDrag}
            reportNewPosition={handleReportNewPosition}
            onDragEnd={handleDragEnd}
            onDelete={handlePointDelete}
            containerRef={gravityRef}
          />
        ))}

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
              onDelete={() => {
                setParticles(particles.filter((p) => p.id !== particle.id));
              }}
            />
          ))}

        <SimulatorSettings onSettingsChange={updateSettings} />
      </div>
    </>
  );
};
