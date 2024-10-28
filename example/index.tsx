import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { CustomCursor } from '../src';

const CustomCursorButton: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div 
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(59, 130, 246, 0.9)',
        color: 'white',
        borderRadius: '1rem',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap'
      }}
    >
      {text} ✨
    </div>
  );
};

const App = () => {
  const [cursorMode, setCursorMode] = useState<'simple' | 'button' | 'hover'>('simple');
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const secondContainerRef = useRef<HTMLDivElement>(null);
  const [useContainer, setUseContainer] = useState(false);
  const [hoveredSecond, setHoveredSecond] = useState(false);

  const renderCursor = (type: 'simple' | 'button' | 'hover', text?: string) => {
    switch(type) {
      case 'button':
        return <CustomCursorButton text={text || "Click me!"} />;
      case 'hover':
        return (
          <div style={{
            width: '60px',
            height: '60px',
            border: '2px solid #3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.2s ease'
          }} />
        );
      default:
        return (
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }} />
        );
    }
  };

  return (
    <div style={{ 
      cursor: useContainer ? 'default' : 'none',
      height: '100vh',
      background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
      padding: '2rem'
    }}>
      {/* Global cursor only when not using containers */}
      {!useContainer && (
        <CustomCursor smoothFactor={2}>
          {renderCursor(cursorMode)}
        </CustomCursor>
      )}

      <h1>Custom Cursor Component Demo</h1>
      <p>This demo shows how you can use any React component as a cursor!</p>
      
      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button 
          onClick={() => setCursorMode('simple')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: cursorMode === 'simple' ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Simple Cursor
        </button>
        
        <button 
          onClick={() => setCursorMode('button')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: cursorMode === 'button' ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Button Cursor
        </button>

        <button 
          onClick={() => setUseContainer(prev => !prev)}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: useContainer ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {useContainer ? 'Global Cursor' : 'Container Only'}
        </button>
      </div>

      {/* Container Demo Section */}
      <div 
        style={{ 
          display: 'flex',
          gap: '2rem',
          marginTop: '2rem'
        }}
      >
        {/* First Container */}
        <div 
          ref={mainContainerRef}
          style={{ 
            flex: 1,
            position: 'relative',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: useContainer ? 'none' : 'default'
          }}
        >
          {useContainer && (
            <CustomCursor 
              containerRef={mainContainerRef} 
              smoothFactor={2}
            >
              {renderCursor(cursorMode, "Container 1!")}
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
              cursor: 'none'
            }}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('simple')}
          >
            <h3>Interactive Area</h3>
            <p>Hover over me to see the cursor change!</p>
          </div>
        </div>

        {/* Second Container */}
        <div 
          ref={secondContainerRef}
          style={{ 
            flex: 1,
            position: 'relative',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'none'
          }}
        >
          <CustomCursor 
            containerRef={secondContainerRef} 
            smoothFactor={3}
          >
            <div style={{
              width: '40px',
              height: '40px',
              border: '2px solid #ef4444',
              borderRadius: '50%',
              // Combine transform properties to maintain centering while scaling
              transform: `translate(-50%, -50%) scale(${hoveredSecond ? 1.5 : 1})`,
              transition: 'all 0.2s ease',
            }} />
          </CustomCursor>

          <h2>Second Container</h2>
          <p>This container has its own independent cursor!</p>
          
          <div 
            style={{ 
              marginTop: '1rem',
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              cursor: 'none'
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
};

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
