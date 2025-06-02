import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CustomCursorButton } from '../components/CustomCursorButton';
import { Button, Typography, Card } from '../components/ui';
import {
  ExperimentOutlined,
  AimOutlined,
  GlobalOutlined,
} from '../components/ui/Icons';

const { Title, Paragraph } = Typography;

// Add props interface
interface DemoSectionProps {
  onDebugData?: (data: Record<string, unknown>) => void;
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
            <div className="w-15 h-15 border-2 border-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200" />
          );
        default:
          return (
            <div className="w-5 h-5 bg-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
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
      <div className="h-full p-8 relative box-border">
        <div className="mb-8">
          <Title level={1}>Custom Cursor Component Demo</Title>
          <Paragraph className="text-lg mt-4">
            Explore the possibilities of using any React component as a custom
            cursor! This demo showcases different cursor modes and
            container-specific behaviors.
          </Paragraph>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Button
            variant={globalCursorMode === 'simple' ? 'primary' : 'secondary'}
            icon={<AimOutlined size={16} />}
            onClick={() => handleCursorModeChange('simple')}
          >
            Simple Cursor
          </Button>

          <Button
            variant={globalCursorMode === 'button' ? 'primary' : 'secondary'}
            icon={<ExperimentOutlined size={16} />}
            onClick={() => handleCursorModeChange('button')}
          >
            Button Cursor
          </Button>

          <Button
            variant={useContainer ? 'primary' : 'secondary'}
            icon={<GlobalOutlined size={16} />}
            onClick={() => setUseContainer((prev) => !prev)}
          >
            {useContainer ? 'Container Only' : 'Global Cursor'}
          </Button>
        </div>

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
        <div className="space-y-8">
          {/* First Container */}
          <Card
            ref={mainContainerRef}
            title="First Container"
            subtitle="This container follows the global cursor mode!"
            hover
            className="cursor-default"
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

            <Card
              title="Interactive Area"
              shadow="sm"
              padding="md"
              className="cursor-default bg-neutral-50"
              onMouseEnter={() => handleContainerHover(true)}
              onMouseLeave={() => handleContainerHover(false)}
            >
              <Paragraph>Hover over me to see the cursor change!</Paragraph>
            </Card>
          </Card>

          {/* Second Container */}
          <Card
            ref={secondContainerRef}
            title="Second Container"
            subtitle="This container has its own independent cursor!"
            hover
            className="cursor-default"
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
                  className={`
                    ${hoveredSecond ? 'w-15 h-15' : 'w-5 h-5'}
                    ${hoveredSecond ? 'bg-transparent border-2 border-red-500' : 'bg-red-500'}
                    rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-200
                  `}
                />
              </CustomCursor>
            )}

            <Card
              title="Hover Effect"
              shadow="sm"
              padding="md"
              className="cursor-default bg-neutral-50"
              onMouseEnter={() => setHoveredSecond(true)}
              onMouseLeave={() => setHoveredSecond(false)}
            >
              <Paragraph>
                Watch the cursor scale up when hovering here!
              </Paragraph>
            </Card>
          </Card>
        </div>
      </div>
    );
  }
);
