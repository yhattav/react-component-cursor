import React, { useState, useRef, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CustomCursorButton } from './components/CustomCursorButton';
import { DebugInfo } from './components/DebugInfo';

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
    <div
      style={{
        cursor: useContainer ? 'default' : 'none',
        height: '100vh',
        background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
        padding: '2rem',
      }}
    >
      {/* Using DebugInfo component */}
      <DebugInfo
        data={{
          mode: useContainer ? 'Container' : 'Global',
          isMouseInContainer1,
          cursor1Position,
          lastGlobalPosition,
          globalCursorMode,
          containerCursorMode,
        }}
      />

      {/* Global cursor */}
      {!useContainer && !isMouseInContainer1 && (
        <CustomCursor smoothFactor={2} onMove={updateGlobalPosition}>
          {renderCursor(globalCursorMode)}
        </CustomCursor>
      )}

      <h1>Custom Cursor Component Demo</h1>
      <p>This demo shows how you can use any React component as a cursor!</p>

      {/* Control Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => {
            setGlobalCursorMode('simple');
            setContainerCursorMode('simple');
          }}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor:
              globalCursorMode === 'simple' ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Simple Cursor
        </button>

        <button
          onClick={() => {
            setGlobalCursorMode('button');
            setContainerCursorMode('button');
          }}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor:
              globalCursorMode === 'button' ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Button Cursor
        </button>

        <button
          onClick={() => setUseContainer((prev) => !prev)}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: useContainer ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {useContainer ? 'Global Cursor' : 'Container Only'}
        </button>
      </div>

      {/* Container Demo Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* First Container */}
        <div
          ref={mainContainerRef}
          onMouseEnter={() => setIsMouseInContainer1(true)}
          onMouseLeave={() => setIsMouseInContainer1(false)}
          style={{
            position: 'relative',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: useContainer || !isMouseInContainer1 ? 'none' : 'default',
            marginTop: '2rem',
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

          <h2>First Container</h2>
          <p>This container follows the global cursor mode!</p>

          <div
            style={{
              marginTop: '1rem',
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              cursor: 'none',
            }}
            onMouseEnter={() => setContainerCursorMode('hover')}
            onMouseLeave={() => setContainerCursorMode('simple')}
          >
            <h3>Interactive Area</h3>
            <p>Hover over me to see the cursor change!</p>
          </div>
        </div>

        {/* Second Container */}
        <div
          ref={secondContainerRef}
          style={{
            position: 'relative',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: useContainer ? 'none' : 'default',
            marginTop: '2rem',
          }}
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

          <h2>Second Container</h2>
          <p>This container has its own independent cursor!</p>

          <div
            style={{
              marginTop: '1rem',
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              cursor: 'none',
            }}
            onMouseEnter={() => setHoveredSecond(true)}
            onMouseLeave={() => setHoveredSecond(false)}
          >
            <h3>Hover Effect</h3>
            <p>Watch the cursor scale up when hovering here!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
