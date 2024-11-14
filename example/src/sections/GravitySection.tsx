import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card } from 'antd';
import { Point2D } from '../utils/types/physics';
import { GravitySimulator } from '../components/GravitySimulator/GravitySimulator';

interface GravitySectionProps {
  onDebugData?: (data: any) => void;
}

export const GravitySection: React.FC<GravitySectionProps> = ({
  onDebugData,
}) => {
  const gravityRef = useRef<HTMLDivElement>(null);
  const [pointerPos, setPointerPos] = useState<Point2D>({ x: 0, y: 0 });

  const handleCursorMove = useCallback((x: number, y: number) => {
    if (isFinite(x) && isFinite(y)) {
      setPointerPos({ x, y });
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
          smoothFactor={1}
          onMove={handleCursorMove}
          hideNativeCursor={false}
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
