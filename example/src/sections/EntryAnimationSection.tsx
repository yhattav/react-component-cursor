import React, { useRef, useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { Card, Typography } from '../components/ui';

const { Title, Paragraph } = Typography;

interface EntryAnimationSectionProps {
  onDebugData?: (data: Record<string, unknown>) => void;
}

const containerStyle = {
  height: '100%',
  padding: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
} as const;

const cardStyle = {
  width: '500px',
  height: '300px',
  cursor: 'none',
} as const;

export const EntryAnimationSection: React.FC<EntryAnimationSectionProps> =
  React.memo(({ onDebugData }) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const handleMouseEnter = () => {
      setIsVisible(true);
      onDebugData?.({ isVisible: true });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      onDebugData?.({ isVisible: false });
    };

    return (
      <div style={containerStyle}>
        <Card
          ref={containerRef}
          style={cardStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CustomCursor
            containerRef={containerRef}
            smoothFactor={2}
            hideNativeCursor={false}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
                boxShadow:
                  process.env.NODE_ENV === 'development'
                    ? '0 0 0 1px red, inset 0 0 0 1px red'
                    : 'none',
              }}
            />
          </CustomCursor>

          <Title level={2}>Entry Animation Debug</Title>
          <Paragraph>
            This container is used to debug cursor entry and exit animations.
            The cursor should smoothly appear when entering and disappear when
            leaving.
          </Paragraph>
          <Paragraph>
            Current status: {isVisible ? 'Cursor visible' : 'Cursor hidden'}
          </Paragraph>
        </Card>
      </div>
    );
  });
