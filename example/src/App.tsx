import React, { useState, useRef, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CustomCursorButton } from './components/CustomCursorButton';
import { DebugInfo } from './components/DebugInfo';
import { Button, Typography, Card, Space, Layout } from 'antd';
import {
  ExperimentOutlined,
  AimOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

function App() {
  // State definitions
  const [globalCursorMode, setGlobalCursorMode] = useState<
    'simple' | 'button' | 'hover'
  >('simple');
  const [containerCursorMode, setContainerCursorMode] = useState<
    'simple' | 'button' | 'hover'
  >('simple');
  const [useContainer, setUseContainer] = useState(false);
  const [hoveredSecond, setHoveredSecond] = useState(false);
  const [isMouseInContainer1, setIsMouseInContainer1] = useState(false);
  const [cursor1Position, setCursor1Position] = useState({ x: 0, y: 0 });
  const [lastGlobalPosition, setLastGlobalPosition] = useState({ x: 0, y: 0 });

  // Refs
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const secondContainerRef = useRef<HTMLDivElement>(null);

  // Callbacks
  const updateDebugPosition = useCallback((x: number, y: number) => {
    setCursor1Position((prev) => {
      if (Math.abs(prev.x - x) < 1 && Math.abs(prev.y - y) < 1) return prev;
      return { x: Math.round(x), y: Math.round(y) };
    });
  }, []);

  const updateGlobalPosition = useCallback((x: number, y: number) => {
    setLastGlobalPosition((prev) => {
      if (Math.abs(prev.x - x) < 1 && Math.abs(prev.y - y) < 1) return prev;
      return { x: Math.round(x), y: Math.round(y) };
    });
  }, []);

  // Cursor renderer
  const renderCursor = (type: 'simple' | 'button' | 'hover', text?: string) => {
    switch (type) {
      case 'button':
        return <CustomCursorButton text={text || 'Click me!'} />;
      case 'hover':
        return (
          <div
            style={{
              width: '60px',
              height: '60px',
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
    <Layout
      style={{
        cursor: useContainer ? 'default' : 'none',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #f0f2f5, #e6f7ff)',
        padding: '2rem',
      }}
    >
      <Content>
        {/* Global cursor */}
        {!useContainer && !isMouseInContainer1 && (
          <CustomCursor smoothFactor={2} onMove={updateGlobalPosition}>
            {renderCursor(globalCursorMode)}
          </CustomCursor>
        )}

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
            {useContainer ? 'Global Cursor' : 'Container Only'}
          </Button>
        </Space>

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
            {(useContainer || isMouseInContainer1) && (
              <CustomCursor
                containerRef={mainContainerRef}
                smoothFactor={2}
                onMove={updateDebugPosition}
              >
                {renderCursor(containerCursorMode, 'Container 1!')}
              </CustomCursor>
            )}

            <Title level={2}>First Container</Title>
            <Paragraph>
              This container follows the global cursor mode!
            </Paragraph>

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
            <CustomCursor containerRef={secondContainerRef} smoothFactor={3}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '2px solid #ef4444',
                  borderRadius: '50%',
                  transform: `translate(-50%, -50%) scale(${
                    hoveredSecond ? 1.5 : 1
                  })`,
                  transition: 'all 0.2s ease',
                }}
              />
            </CustomCursor>

            <Title level={2}>Second Container</Title>
            <Paragraph>
              This container has its own independent cursor!
            </Paragraph>

            <Card
              type="inner"
              style={{ cursor: 'none' }}
              onMouseEnter={() => setHoveredSecond(true)}
              onMouseLeave={() => setHoveredSecond(false)}
            >
              <Title level={3}>Hover Effect</Title>
              <Paragraph>
                Watch the cursor scale up when hovering here!
              </Paragraph>
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
      </Content>
    </Layout>
  );
}

export default App;
