import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography } from 'antd';
import { motion, PanInfo } from 'framer-motion';

const { Title, Paragraph } = Typography;

interface GravityPoint {
  x: number;
  y: number;
  label: string;
  mass: number;
  color: string;
}

const drawArrow = (
  x: number,
  y: number,
  vectorX: number,
  vectorY: number,
  color: string,
  scale: number = 1
) => {
  const length = Math.sqrt(vectorX * vectorX + vectorY * vectorY) * scale;
  const angle = Math.atan2(vectorY, vectorX);

  // Calculate end point using length
  const endX =
    x + (vectorX / Math.sqrt(vectorX * vectorX + vectorY * vectorY)) * length;
  const endY =
    y + (vectorY / Math.sqrt(vectorX * vectorX + vectorY * vectorY)) * length;

  // Arrow head size proportional to length
  const arrowSize = Math.min(length * 0.2, 10); // 20% of length, max 10px
  const arrowAngle = Math.PI / 6; // 30 degrees

  const arrowPoint1X = endX - arrowSize * Math.cos(angle - arrowAngle);
  const arrowPoint1Y = endY - arrowSize * Math.sin(angle - arrowAngle);
  const arrowPoint2X = endX - arrowSize * Math.cos(angle + arrowAngle);
  const arrowPoint2Y = endY - arrowSize * Math.sin(angle + arrowAngle);

  return (
    <>
      <line x1={x} y1={y} x2={endX} y2={endY} stroke={color} strokeWidth="2" />
      <line
        x1={endX}
        y1={endY}
        x2={arrowPoint1X}
        y2={arrowPoint1Y}
        stroke={color}
        strokeWidth="2"
      />
      <line
        x1={endX}
        y1={endY}
        x2={arrowPoint2X}
        y2={arrowPoint2Y}
        stroke={color}
        strokeWidth="2"
      />
    </>
  );
};

interface GravitySectionProps {
  onDebugData?: (data: any) => void;
}

export const GravitySection: React.FC<GravitySectionProps> = ({
  onDebugData,
}) => {
  const gravityRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [velocity, setVelocity] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [gravityPoints, setGravityPoints] = useState<GravityPoint[]>([
    { x: 700, y: 700, label: 'Heavy', mass: 50000, color: '#FF6B6B' },
    { x: 500, y: 150, label: 'Medium', mass: 30000, color: '#4ECDC4' },
    { x: 350, y: 250, label: 'Light', mass: 10000, color: '#45B7D1' },
  ]);

  const calculateGravitationalForce = useCallback(
    (x1: number, y1: number, x2: number, y2: number, mass: number) => {
      if (!isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2)) {
        return { fx: 0, fy: 0 };
      }

      const G = 0.1;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = 30;
      const maxForce = 2;

      if (distance === 0) {
        return { fx: 0, fy: 0 };
      }

      const force = Math.min(
        (G * (mass * 1)) /
          Math.max(distance * distance, minDistance * minDistance),
        maxForce
      );

      const falloffStart = minDistance * 2;
      const smoothingFactor =
        distance < falloffStart ? Math.pow(distance / falloffStart, 0.5) : 1;

      const dirX = dx / distance;
      const dirY = dy / distance;

      return {
        fx: Number.isFinite(dirX * force) ? dirX * force * smoothingFactor : 0,
        fy: Number.isFinite(dirY * force) ? dirY * force * smoothingFactor : 0,
      };
    },
    []
  );

  const handleDrag = (_: any, info: PanInfo, index: number) => {
    const containerRect = gravityRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setGravityPoints((points) =>
      points.map((point, i) => {
        if (i === index) {
          // Use the absolute position from the drag event
          return {
            ...point,
            x: info.point.x - containerRect.left,
            y: info.point.y - containerRect.top,
          };
        }
        return point;
      })
    );
  };

  // Add function to convert between coordinate systems
  const getContainerOffset = useCallback(() => {
    const containerRect = gravityRef.current?.getBoundingClientRect();
    return {
      x: containerRect?.left || 0,
      y: containerRect?.top || 0,
    };
  }, []);

  // Update force calculation to use screen coordinates
  const calculateTotalForce = useCallback(
    (cursorX: number, cursorY: number, pointerX: number, pointerY: number) => {
      let totalFx = 0;
      let totalFy = 0;

      const offset = getContainerOffset();

      // Add pointer gravitational pull
      const pointerForce = calculateGravitationalForce(
        cursorX,
        cursorY,
        pointerX,
        pointerY,
        50000
      );
      totalFx += pointerForce.fx;
      totalFy += pointerForce.fy;

      // Add gravity points force with proper coordinate conversion
      gravityPoints.forEach((point) => {
        const force = calculateGravitationalForce(
          cursorX,
          cursorY,
          point.x + offset.x, // Convert to screen coordinates
          point.y + offset.y, // Convert to screen coordinates
          point.mass
        );
        totalFx += force.fx;
        totalFy += force.fy;
      });

      return { fx: totalFx, fy: totalFy };
    },
    [calculateGravitationalForce, gravityPoints]
  );

  // Add cursor mass constant
  const CURSOR_MASS = 0.1; // Adjust this value to change cursor's "weight"

  // Use requestAnimationFrame for smooth cursor movement
  useEffect(() => {
    let animationFrameId: number;
    const friction = 0.999;
    const deltaTime = 1 / 60;

    const updateCursorPosition = () => {
      const force = calculateTotalForce(
        cursorPos.x,
        cursorPos.y,
        pointerPos.x,
        pointerPos.y
      );

      // Calculate acceleration using F = ma
      const ax = Number.isFinite(force.fx) ? force.fx / CURSOR_MASS : 0;
      const ay = Number.isFinite(force.fy) ? force.fy / CURSOR_MASS : 0;

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
  }, [cursorPos, pointerPos, calculateTotalForce, velocity]);

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
        cursorPos.x,
        cursorPos.y,
        pointerPos.x,
        pointerPos.y
      ),
    });
  }, [
    cursorPos,
    pointerPos,
    velocity,
    calculateGravitationalForce,
    calculateTotalForce,
    onDebugData,
  ]);

  // Add click handler
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);

  // Clean version of the click handler
  const handleContainerClick = useCallback(() => {
    setCursorPos(pointerPos);
    setVelocity({ x: 0, y: 0 }); // Reset velocity
    if (!isSimulationStarted) {
      setIsSimulationStarted(true);
    }
  }, [pointerPos, isSimulationStarted]);

  // Modify animation effect to only run when simulation is started
  useEffect(() => {
    if (!isSimulationStarted) return;

    let animationFrameId: number;
    const friction = 1;
    const deltaTime = 1 / 60;

    const updateCursorPosition = () => {
      const force = calculateTotalForce(
        cursorPos.x,
        cursorPos.y,
        pointerPos.x,
        pointerPos.y
      );

      // Calculate acceleration using F = ma
      const ax = Number.isFinite(force.fx) ? force.fx / CURSOR_MASS : 0;
      const ay = Number.isFinite(force.fy) ? force.fy / CURSOR_MASS : 0;

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
    calculateTotalForce,
    velocity,
    isSimulationStarted,
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
          initial={{ x: point.x, y: point.y }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: 'translate(-50%, -50%)',
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
                  calculateTotalForce(
                    cursorPos.x,
                    cursorPos.y,
                    pointerPos.x,
                    pointerPos.y
                  ).fx,
                  calculateTotalForce(
                    cursorPos.x,
                    cursorPos.y,
                    pointerPos.x,
                    pointerPos.y
                  ).fy,
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
