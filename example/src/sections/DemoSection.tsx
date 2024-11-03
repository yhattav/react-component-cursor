import React, { useState, useRef } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CustomCursorButton } from '../components/CustomCursorButton';
import { DebugInfo } from '../components/DebugInfo';
import { Button, Typography, Card, Space } from 'antd';
import {
  ExperimentOutlined,
  AimOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const DemoSection: React.FC = () => {
  // State management
  const [useContainer, setUseContainer] = useState(false);
  const [isMouseInContainer1, setIsMouseInContainer1] = useState(false);
  const [globalCursorMode, setGlobalCursorMode] = useState('simple');
  const [containerCursorMode, setContainerCursorMode] = useState('simple');
  const [cursor1Position, setCursor1Position] = useState({ x: 0, y: 0 });
  const [lastGlobalPosition, setLastGlobalPosition] = useState({ x: 0, y: 0 });
  const [hoveredSecond, setHoveredSecond] = useState(false);

  // Refs
  const mainContainerRef = useRef(null);
  const secondContainerRef = useRef(null);

  // Cursor rendering helper
  const renderCursor = (mode: string) => {
    switch (mode) {
      case 'button':
        return <CustomCursorButton text="Click me!" />;
      case 'hover':
        return (
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'transparent',
              border: '2px solid #3b82f6',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.2s ease',
            }}
          />
        );
      default:
        return (
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
    }
  };

  return (
    <section style={{ padding: '2rem' }}>
      <Typography>
        <Title>Custom Cursor Component Demo</Title>
        <Paragraph>
          Explore the possibilities of using any React component as a custom
          cursor! This demo showcases different cursor modes and
          container-specific behaviors.
        </Paragraph>
      </Typography>

      {/* Control Buttons */}
      <Space size="middle" style={{ marginBottom: '2rem' }}>
        <Button
          type={globalCursorMode === 'simple' ? 'primary' : 'default'}
          icon={<AimOutlined />}
          onClick={() => {
            setGlobalCursorMode('simple');
            setContainerCursorMode('simple');
          }}
        >
          Simple Cursor
        </Button>

        <Button
          type={globalCursorMode === 'button' ? 'primary' : 'default'}
          icon={<ExperimentOutlined />}
          onClick={() => {
            setGlobalCursorMode('button');
            setContainerCursorMode('button');
          }}
        >
          Button Cursor
        </Button>

        <Button
          type={useContainer ? 'primary' : 'default'}
          icon={<GlobalOutlined />}
          onClick={() => setUseContainer((prev) => !prev)}
        >
          {useContainer ? 'Container Only' : 'Global Cursor'}
        </Button>
      </Space>

      {/* Global Cursor */}
      {!useContainer && !isMouseInContainer1 && (
        <CustomCursor
          smoothFactor={2}
          onMove={(x, y) => setLastGlobalPosition({ x, y })}
        >
          {renderCursor(globalCursorMode)}
        </CustomCursor>
      )}

      {/* Container Demo Section */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* First Container */}
        <Card
          ref={mainContainerRef}
          onMouseEnter={() => setIsMouseInContainer1(true)}
          onMouseLeave={() => setIsMouseInContainer1(false)}
          style={{
            cursor: useContainer || !isMouseInContainer1 ? 'none' : 'default',
          }}
        >
          {isMouseInContainer1 && (
            <CustomCursor
              containerRef={mainContainerRef}
              smoothFactor={2}
              onMove={(x, y) => setCursor1Position({ x, y })}
            >
              {renderCursor(containerCursorMode)}
            </CustomCursor>
          )}

          <Title level={2}>First Container</Title>
          <Paragraph>This container follows the global cursor mode!</Paragraph>

          <Card
            type="inner"
            style={{ cursor: 'none' }}
            onMouseEnter={() => setContainerCursorMode('hover')}
            onMouseLeave={() => setContainerCursorMode('simple')}
          >
            <Title level={3}>Interactive Area</Title>
            <Paragraph>Hover over me to see the cursor change!</Paragraph>
          </Card>
        </Card>

        {/* Second Container */}
        <Card
          ref={secondContainerRef}
          style={{ cursor: useContainer ? 'none' : 'default' }}
        >
          <CustomCursor containerRef={secondContainerRef} smoothFactor={2}>
            <div
              style={{
                width: hoveredSecond ? '60px' : '20px',
                height: hoveredSecond ? '60px' : '20px',
                backgroundColor: hoveredSecond ? 'transparent' : '#ff4d4f',
                border: hoveredSecond ? '2px solid #ff4d4f' : 'none',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.2s ease',
              }}
            />
          </CustomCursor>

          <Title level={2}>Second Container</Title>
          <Paragraph>This container has its own independent cursor!</Paragraph>

          <Card
            type="inner"
            style={{ cursor: 'none' }}
            onMouseEnter={() => setHoveredSecond(true)}
            onMouseLeave={() => setHoveredSecond(false)}
          >
            <Title level={3}>Hover Effect</Title>
            <Paragraph>Watch the cursor scale up when hovering here!</Paragraph>
          </Card>
        </Card>
      </Space>
      <DebugInfo
        data={{
          mode: useContainer ? 'container' : 'global',
          isMouseInContainer1,
          cursor1Position,
          lastGlobalPosition,
          globalCursorMode,
          containerCursorMode,
        }}
      />
    </section>
  );
};
