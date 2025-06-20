import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card } from '../components/ui';
import { Point2D } from '../utils/types/physics';
import { GravitySimulator } from '../components/GravitySimulator/GravitySimulator';

interface GravitySectionProps {
  onDebugData?: (data: Record<string, unknown>) => void;
}

export const GravitySection: React.FC<GravitySectionProps> = ({
  onDebugData,
}) => {
  const gravityRef = useRef<HTMLDivElement>(null);
  const [pointerPos, setPointerPos] = useState<Point2D>({ x: 0, y: 0 });

  const handleCursorMove = useCallback((position: { x: number; y: number }) => {
    if (isFinite(position.x) && isFinite(position.y)) {
      setPointerPos({ x: position.x, y: position.y });
    }
  }, []);

  return (
    <>
      <Card
        onDragOver={(e) => e.preventDefault()}
        style={{
          height: '100%',
          position: 'relative',
          border: 'none',
          overflow: 'hidden',
        }}
      >
        <CustomCursor
          containerRef={gravityRef}
          smoothness={1}
          onMove={handleCursorMove}
        >
          <div style={{ width: '100vw', height: '100vh' }} />
        </CustomCursor>

        <GravitySimulator
          gravityRef={gravityRef}
          pointerPos={pointerPos}
          onDebugData={onDebugData}
        />
      </Card>
    </>
  );
};
