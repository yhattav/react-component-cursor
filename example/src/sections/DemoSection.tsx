import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CustomCursorButton } from '../components/CustomCursorButton';
import { Button, Typography, Card, Space } from 'antd';
import {
  ExperimentOutlined,
  AimOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Move static styles outside component
const containerStyle = {
  height: '100%',
  padding: '2rem',
  position: 'relative',
  boxSizing: 'border-box',
} as const;

const buttonSpaceStyle = {
  marginBottom: '2rem',
} as const;

// Add props interface
interface DemoSectionProps {
  onDebugData?: (data: any) => void;
}

export const DemoSection: React.FC<DemoSectionProps> = React.memo(
  ({ onDebugData }) => {
    // State management
    const [useContainer, setUseContainer] = useState(false);
    const [isMouseInContainer1, setIsMouseInContainer1] = useState(false);
    const [isMouseInContainer2, setIsMouseInContainer2] = useState(false);
    const [globalCursorMode, setGlobalCursorMode] = useState('simple');
    const [container1CursorMode, setContainer1CursorMode] = useState('simple');
    const [cursor1Position, setCursor1Position] = useState({ x: 0, y: 0 });
    const [lastGlobalPosition, setLastGlobalPosition] = useState({
      x: 0,
      y: 0,
    });
    const [hoveredSecond, setHoveredSecond] = useState(false);

    // Refs
    const mainContainerRef = useRef(null);
    const secondContainerRef = useRef(null);

    // Memoized handlers
    const handleGlobalCursorMove = useCallback((x: number, y: number) => {
      setLastGlobalPosition({ x, y });
    }, []);

    const handleContainer1CursorMove = useCallback((x: number, y: number) => {
      setCursor1Position({ x, y });
    }, []);

    const handleContainer1Enter = useCallback(() => {
      setIsMouseInContainer1(true);
      requestAnimationFrame(() => {
        setContainer1CursorMode(globalCursorMode);
      });
    }, [globalCursorMode]);

    const handleContainer1Leave = useCallback(() => {
      setContainer1CursorMode('simple');
      requestAnimationFrame(() => {
        setIsMouseInContainer1(false);
      });
    }, []);

    const handleContainer2Enter = useCallback(() => {
      setIsMouseInContainer2(true);
    }, []);

    const handleContainer2Leave = useCallback(() => {
      setIsMouseInContainer2(false);
    }, []);

    const handleCursorModeChange = useCallback((mode: string) => {
      setGlobalCursorMode(mode);
      setContainer1CursorMode(mode);
    }, []);

    const handleContainerHover = useCallback((isHovered: boolean) => {
      setContainer1CursorMode(isHovered ? 'hover' : 'simple');
    }, []);

    // Memoize cursor rendering
    const renderCursor = useCallback((mode: string) => {
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
    }, []);

    // Use effect to send debug data
    useEffect(() => {
      console.log('Container 1 state:', {
        isMouseInContainer1,
        container1CursorMode,
        useContainer,
      });
    }, [isMouseInContainer1, container1CursorMode, useContainer]);

    // Update debug data
    useEffect(() => {
      onDebugData?.({
        mode: useContainer ? 'container' : 'global',
        isMouseInContainer1,
        isMouseInContainer2,
        cursor1Position,
        lastGlobalPosition,
        globalCursorMode,
        container1CursorMode,
        isVisible: isMouseInContainer1 || isMouseInContainer2 || !useContainer,
      });
    }, [
      useContainer,
      isMouseInContainer1,
      isMouseInContainer2,
      cursor1Position,
      lastGlobalPosition,
      globalCursorMode,
      container1CursorMode,
      onDebugData,
    ]);

    return (
      <div style={containerStyle}>
        <Typography>
          <Title>Custom Cursor Component Demo</Title>
          <Paragraph>
            Explore the possibilities of using any React component as a custom
            cursor! This demo showcases different cursor modes and
            container-specific behaviors.
          </Paragraph>
        </Typography>

        {/* Control Buttons */}
        <Space size="middle" style={buttonSpaceStyle}>
          <Button
            type={globalCursorMode === 'simple' ? 'primary' : 'default'}
            icon={<AimOutlined />}
            onClick={() => handleCursorModeChange('simple')}
          >
            Simple Cursor
          </Button>

          <Button
            type={globalCursorMode === 'button' ? 'primary' : 'default'}
            icon={<ExperimentOutlined />}
            onClick={() => handleCursorModeChange('button')}
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
        {!useContainer && (
          <CustomCursor
            id="global-cursor"
            smoothFactor={2}
            onMove={handleGlobalCursorMove}
            hideNativeCursor={true}
          >
            {renderCursor(globalCursorMode)}
          </CustomCursor>
        )}
        {/* Container Demo Section */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* First Container */}
          <Card
            ref={mainContainerRef}
            onMouseEnter={handleContainer1Enter}
            onMouseLeave={handleContainer1Leave}
          >
            {useContainer && isMouseInContainer1 && (
              <CustomCursor
                id="container-1-cursor"
                containerRef={mainContainerRef}
                smoothFactor={2}
                onMove={handleContainer1CursorMove}
                hideNativeCursor={true}
              >
                {renderCursor(container1CursorMode)}
              </CustomCursor>
            )}

            <Title level={2}>First Container</Title>
            <Paragraph>
              This container follows the global cursor mode!
            </Paragraph>

            <Card
              type="inner"
              style={{ cursor: 'default' }}
              onMouseEnter={() => handleContainerHover(true)}
              onMouseLeave={() => handleContainerHover(false)}
            >
              <Title level={3}>Interactive Area</Title>
              <Paragraph>Hover over me to see the cursor change!</Paragraph>
            </Card>
          </Card>

          {/* Second Container */}
          <Card
            ref={secondContainerRef}
            onMouseEnter={handleContainer2Enter}
            onMouseLeave={handleContainer2Leave}
          >
            {useContainer && isMouseInContainer2 && (
              <CustomCursor
                id="container-2-cursor"
                containerRef={secondContainerRef}
                smoothFactor={2}
                hideNativeCursor={true}
              >
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
            )}

            <Title level={2}>Second Container</Title>
            <Paragraph>
              This container has its own independent cursor!
            </Paragraph>

            <Card
              type="inner"
              style={{ cursor: 'default' }}
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
      </div>
    );
  }
);
