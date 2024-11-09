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

export const GravitySection: React.FC<GravitySectionProps> = ({
  onDebugData,
}) => {
  const gravityRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState<Point2D>({ x: 0, y: 0 });
  const [pointerPos, setPointerPos] = useState<Point2D>({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState<Point2D>({ x: 0, y: 0 });

  const [gravityPoints, setGravityPoints] = useState<GravityPoint[]>([
    { x: 700, y: 700, label: 'Heavy', mass: 50000, color: '#FF6B6B' },
    { x: 500, y: 150, label: 'Medium', mass: 30000, color: '#4ECDC4' },
    { x: 350, y: 250, label: 'Light', mass: 10000, color: '#45B7D1' },
  ]);

  const [isDragging, setIsDragging] = useState(false);

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

  // Update force calculation to use screen coordinates
  const force = calculateTotalForce(
    cursorPos,
    pointerPos,
    gravityPoints,
    offset
  );

  // Use requestAnimationFrame for smooth cursor movement
  useEffect(() => {
    let animationFrameId: number;
    const friction = 0.999;
    const deltaTime = 1 / 60;

    const updateCursorPosition = () => {
      const force = calculateTotalForce(
        cursorPos,
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
      setVelocity((currentVelocity) => {
        const newVx = Number.isFinite(currentVelocity.x + ax * deltaTime)
          ? (currentVelocity.x + ax * deltaTime) * friction
          : 0;
        const newVy = Number.isFinite(currentVelocity.y + ay * deltaTime)
          ? (currentVelocity.y + ay * deltaTime) * friction
          : 0;

        return { x: newVx, y: newVy };
      });

      // Update position using the current velocity state
      setCursorPos((prev) => ({
        x: Number.isFinite(prev.x + velocity.x * deltaTime)
          ? prev.x + velocity.x * deltaTime
          : prev.x,
        y: Number.isFinite(prev.y + velocity.y * deltaTime)
          ? prev.y + velocity.y * deltaTime
          : prev.y,
      }));

      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    animationFrameId = requestAnimationFrame(updateCursorPosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorPos, pointerPos, gravityPoints, offset, velocity]);

  const handleCursorMove = useCallback((x: number, y: number) => {
    if (isFinite(x) && isFinite(y)) {
      setPointerPos({ x, y });
    }
  }, []);

  // Use effect to send debug data
  useEffect(() => {
    onDebugData?.({
      cursor: {
        position: cursorPos,
        velocity: velocity,
      },
      pointer: {
        position: pointerPos,
        force: calculateGravitationalForce(
          cursorPos.x,
          cursorPos.y,
          pointerPos.x,
          pointerPos.y,
          500
        ),
      },
      velocity: velocity,
      totalForce: calculateTotalForce(
        cursorPos,
        pointerPos,
        gravityPoints,
        offset
      ),
    });
  }, [cursorPos, pointerPos, velocity, gravityPoints, offset, onDebugData]);

  // Add click handler
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);

  // Modify click handler to check for drag state
  const handleContainerClick = useCallback(() => {
    if (isDragging) return; // Ignore clicks during drag

    setCursorPos(pointerPos);
    setVelocity({ x: 0, y: 0 });
    if (!isSimulationStarted) {
      setIsSimulationStarted(true);
    }
  }, [pointerPos, isSimulationStarted, isDragging]);

  // Modify animation effect to only run when simulation is started
  useEffect(() => {
    if (!isSimulationStarted) return;

    let animationFrameId: number;
    const friction = 1;
    const deltaTime = 1 / 60;

    const updateCursorPosition = () => {
      const force = calculateTotalForce(
        cursorPos,
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
      setVelocity((currentVelocity) => {
        const newVx = Number.isFinite(currentVelocity.x + ax * deltaTime)
          ? (currentVelocity.x + ax * deltaTime) * friction
          : 0;
        const newVy = Number.isFinite(currentVelocity.y + ay * deltaTime)
          ? (currentVelocity.y + ay * deltaTime) * friction
          : 0;

        return { x: newVx, y: newVy };
      });

      // Update position using the current velocity state
      setCursorPos((prev) => ({
        x: Number.isFinite(prev.x + velocity.x * deltaTime)
          ? prev.x + velocity.x * deltaTime
          : prev.x,
        y: Number.isFinite(prev.y + velocity.y * deltaTime)
          ? prev.y + velocity.y * deltaTime
          : prev.y,
      }));

      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    animationFrameId = requestAnimationFrame(updateCursorPosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    cursorPos,
    pointerPos,
    gravityPoints,
    offset,
    velocity,
    isSimulationStarted,
  ]);

  const updatePhysicsState = useCallback(
    (
      currentPos: Point2D,
      currentVelocity: Point2D,
      force: Force
    ): { newPosition: Point2D; newVelocity: Point2D } => {
      const acceleration = calculateAcceleration(
        force,
        PHYSICS_CONFIG.CURSOR_MASS
      );

      const newVelocity = calculateNewVelocity(
        currentVelocity,
        acceleration,
        PHYSICS_CONFIG.DELTA_TIME,
        PHYSICS_CONFIG.FRICTION
      );

      const newPosition = calculateNewPosition(
        currentPos,
        newVelocity,
        PHYSICS_CONFIG.DELTA_TIME
      );

      return { newPosition, newVelocity };
    },
    []
  );

  // Animation frame effect
  useEffect(() => {
    if (!isSimulationStarted) return;

    let animationFrameId: number;

    const updateCursorPosition = () => {
      const offset = getContainerOffset(gravityRef);
      const force = calculateTotalForce(
        cursorPos,
        pointerPos,
        gravityPoints,
        offset,
        PHYSICS_CONFIG.POINTER_MASS
      );

      const { newPosition, newVelocity } = updatePhysicsState(
        cursorPos,
        velocity,
        force
      );

      setVelocity(newVelocity);
      setCursorPos(newPosition);

      // Debug data
      if (onDebugData) {
        const pointerForce = calculateGravitationalForce(
          cursorPos.x,
          cursorPos.y,
          pointerPos.x,
          pointerPos.y,
          PHYSICS_CONFIG.POINTER_MASS
        );

        onDebugData({
          cursor: { position: newPosition, velocity: newVelocity },
          pointer: { position: pointerPos, force: pointerForce },
          totalForce: force,
        });
      }

      animationFrameId = requestAnimationFrame(updateCursorPosition);
    };

    animationFrameId = requestAnimationFrame(updateCursorPosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isSimulationStarted,
    cursorPos,
    pointerPos,
    gravityPoints,
    velocity,
    updatePhysicsState,
    onDebugData,
  ]);

  return (
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
      <Title level={2} style={{ color: '#fff' }}>
        Gravity
      </Title>
      <Paragraph style={{ color: '#aaa' }}>
        Move your cursor near the gravity points to feel the pull!
      </Paragraph>

      {/* Add click to start message */}
      {!isSimulationStarted && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '20px 40px',
            borderRadius: '8px',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
          }}
        >
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            Click Anywhere to Start
          </Title>
        </div>
      )}

      {/* Gravity Points */}
      {gravityPoints.map((point, index) => (
        <motion.div
          key={index}
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

      {/* Only render cursor and vectors when simulation has started */}
      <CustomCursor
        containerRef={gravityRef}
        smoothFactor={1}
        onMove={handleCursorMove}
        hideNativeCursor={false}
      >
        <div
          style={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
          }}
        >
          {/* Only show vectors and cursor when simulation has started */}
          {isSimulationStarted && (
            <>
              <svg
                style={{
                  position: 'absolute',
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
                  cursorPos.x - pointerPos.x,
                  cursorPos.y - pointerPos.y,
                  velocity.x,
                  velocity.y,
                  '#4CAF50', // Green
                  40 // Scale factor to make the arrow visible
                )}

                {/* Force/Acceleration vector */}
                {drawArrow(
                  cursorPos.x - pointerPos.x,
                  cursorPos.y - pointerPos.y,
                  force.fx,
                  force.fy,
                  '#FF4081', // Pink
                  200 // Different scale for force
                )}
              </svg>
              <motion.div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'transparent',
                  border: '2px solid #666',
                  borderRadius: '50%',
                  position: 'absolute',
                  left: cursorPos.x - pointerPos.x,
                  top: cursorPos.y - pointerPos.y,
                  transform: 'translate(-50%, -50%)',
                  transition: 'border-color 0.2s ease',
                  boxShadow: '0 0 20px rgba(255,255,255,0.2)',
                }}
              />
            </>
          )}
        </div>
      </CustomCursor>
    </Card>
  );
};
