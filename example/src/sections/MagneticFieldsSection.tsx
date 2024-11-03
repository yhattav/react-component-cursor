import React, { useRef, useState, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const MagneticFieldsSection: React.FC = () => {
  const magneticRef = useRef(null);
  const [isNearMagnet, setIsNearMagnet] = useState(false);

  const magneticElements = [
    { x: 100, y: 100, label: 'Magnet 1' },
    { x: 300, y: 100, label: 'Magnet 2' },
    { x: 200, y: 200, label: 'Magnet 3' },
  ];

  const checkMagneticDistance = useCallback((x: number, y: number) => {
    const magneticRange = 100;
    const isNear = magneticElements.some((magnet) => {
      const distance = Math.sqrt(
        Math.pow(x - magnet.x, 2) + Math.pow(y - magnet.y, 2)
      );
      return distance < magneticRange;
    });
    setIsNearMagnet(isNear);
  }, []);

  return (
    <Card ref={magneticRef} style={{ height: '400px', position: 'relative' }}>
      <Title level={2}>Magnetic Fields</Title>
      <Paragraph>Move your cursor near the magnetic points!</Paragraph>

      <CustomCursor
        containerRef={magneticRef}
        smoothFactor={2}
        onMove={checkMagneticDistance}
      >
        <div
          style={{
            width: isNearMagnet ? '40px' : '20px',
            height: isNearMagnet ? '40px' : '20px',
            backgroundColor: '#9333ea',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </CustomCursor>
    </Card>
  );
};
