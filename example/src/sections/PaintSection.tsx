import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography, Button } from '../components/ui';

const { Title, Paragraph } = Typography;

export const PaintSection: React.FC = () => {
  const paintRef = useRef(null);
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);

  const addToTrail = useCallback((x: number, y: number) => {
    setTrail((prev) => [...prev, { x, y }].slice(-50));
  }, []);

  const clearTrail = useCallback(() => {
    setTrail([]);
  }, []);

  return (
    <Card
      ref={paintRef}
      style={{ height: '400px', background: '#f0f0f0', position: 'relative' }}
    >
      <Title level={2}>Paint Trail</Title>
      <Paragraph>Move your cursor to paint!</Paragraph>
      <Button onClick={clearTrail} style={{ marginBottom: '1rem' }}>
        Clear Canvas
      </Button>

      <CustomCursor
        containerRef={paintRef}
        smoothFactor={1}
        onMove={addToTrail}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#ff6b6b',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(255,107,107,0.5)',
          }}
        />
      </CustomCursor>

      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {trail.length > 1 && (
          <path
            d={`M ${trail.map((point) => `${point.x} ${point.y}`).join(' L ')}`}
            stroke="#ff6b6b"
            strokeWidth="3"
            fill="none"
          />
        )}
      </svg>
    </Card>
  );
};
