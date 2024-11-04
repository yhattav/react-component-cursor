import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface MagneticPoint {
  x: number;
  y: number;
  label: string;
  strength: number;
}

export const MagneticFieldsSection: React.FC = () => {
  const magneticRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [activePoint, setActivePoint] = useState<MagneticPoint | null>(null);

  const magneticElements: MagneticPoint[] = [
    { x: 200, y: 150, label: 'Strong', strength: 0.3 },
    { x: 500, y: 150, label: 'Medium', strength: 0.2 },
    { x: 350, y: 250, label: 'Weak', strength: 0.1 },
  ];

  const calculateMagneticPull = useCallback((x: number, y: number) => {
    const magneticRange = 150;
    let closestPoint: MagneticPoint | null = magneticElements[1];
    let minDistance = Infinity;

    magneticElements.forEach((magnet) => {
      const distance = Math.sqrt(
        Math.pow(x - magnet.x, 2) + Math.pow(y - magnet.y, 2)
      );

      if (distance < magneticRange && distance < minDistance) {
        minDistance = distance;
        closestPoint = magnet;
      }
    });

    setActivePoint(closestPoint);

    if (
      closestPoint &&
      'x' in closestPoint &&
      'y' in closestPoint &&
      'strength' in closestPoint
    ) {
      const strength = closestPoint.strength || 0.2;
      const pull = ((magneticRange - minDistance) / magneticRange) * strength;

      const newX = x + (closestPoint.x - x) * pull;
      const newY = y + (closestPoint.y - y) * pull;

      return { x: newX, y: newY };
    }

    return { x, y };
  }, []);

  const handleCursorMove = useCallback(
    (x: number, y: number) => {
      const pulledPosition = calculateMagneticPull(x, y);
      setCursorPos(pulledPosition);
    },
    [calculateMagneticPull]
  );

  return (
    <Card
      ref={magneticRef}
      style={{
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(to right, #1a1a1a, #2a2a2a)',
        border: 'none',
      }}
    >
      <Title level={2} style={{ color: '#fff' }}>
        Magnetic Fields
      </Title>
      <Paragraph style={{ color: '#aaa' }}>
        Move your cursor near the magnetic points to feel the pull!
      </Paragraph>

      {/* Magnetic Points */}
      {magneticElements.map((point, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: point.x,
            top: point.y,
            width: '12px',
            height: '12px',
            backgroundColor: activePoint === point ? '#9333ea' : '#666',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease',
            boxShadow: activePoint
              ? '0 0 20px #9333ea'
              : '0 0 10px rgba(147, 51, 234, 0.3)',
          }}
        />
      ))}

      {/* Connection Line */}
      {activePoint && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <line
            x1={cursorPos.x}
            y1={cursorPos.y}
            x2={activePoint.x}
            y2={activePoint.y}
            stroke="#9333ea"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
          />
        </svg>
      )}

      <CustomCursor
        containerRef={magneticRef}
        smoothFactor={2}
        onMove={handleCursorMove}
      >
        <div
          style={{
            width: activePoint ? '40px' : '20px',
            height: activePoint ? '40px' : '20px',
            backgroundColor: 'transparent',
            border: '2px solid #9333ea',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.2s ease',
            boxShadow: activePoint
              ? '0 0 20px rgba(147, 51, 234, 0.5)'
              : 'none',
          }}
        />
      </CustomCursor>
    </Card>
  );
};
