import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography } from '../components/ui';

const { Title, Paragraph } = Typography;

export const ContentRevealSection: React.FC = () => {
  const revealRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const updateCursorPos = useCallback((position: { x: number; y: number }) => {
    const containerRect = revealRef.current?.getBoundingClientRect();
    const offsetX = containerRect?.left || 0;
    const offsetY = containerRect?.top || 0;

    const relativeX = position.x - offsetX;
    const relativeY = position.y - offsetY;

    setCursorPos({ x: relativeX, y: relativeY });
  }, []);

  return (
    <Card
      ref={revealRef}
      style={{ height: '400px', position: 'relative', overflow: 'hidden' }}
    >
      <Title level={2}>Content Reveal</Title>
      <Paragraph>Move the spotlight to reveal the hidden content!</Paragraph>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'black',
          maskImage: `radial-gradient(circle 50px at ${cursorPos.x}px ${cursorPos.y}px, transparent 0%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 50px at ${cursorPos.x}px ${cursorPos.y}px, transparent 0%, black 100%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          color: '#1890ff',
        }}
      >
        🎉 Hidden Content Revealed! 🎉
      </div>

      <CustomCursor
        containerRef={revealRef}
        smoothness={2}
        onMove={updateCursorPos}
      >
        <div
          style={{
            width: '100px',
            height: '100px',
            background:
              'radial-gradient(circle closest-side, rgba(255,255,255,0.3) 0%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      </CustomCursor>
    </Card>
  );
};
