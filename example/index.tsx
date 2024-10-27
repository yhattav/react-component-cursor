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
  const [cursorMode, setCursorMode] = useState<'simple' | 'button'>('simple');
  const containerRef = useRef<HTMLDivElement>(null);
  const [useContainer, setUseContainer] = useState(false);

  return (
    <div style={{ 
      cursor: 'none',
      height: '100vh',
      background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
      padding: '2rem'
    }}>
      {/* Global cursor when not using container */}
      {!useContainer && (
        <CustomCursor smoothFactor={2}>
          {cursorMode === 'simple' ? (
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
          ) : (
            <CustomCursorButton text="Click me!" />
          )}
        </CustomCursor>
      )}

      <h1>Custom Cursor Component Demo</h1>
      <p>This demo shows how you can use any React component as a cursor!</p>
      
      {/* Cursor Toggle Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button 
          onClick={() => setCursorMode('simple')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: cursorMode === 'simple' ? '#3b82f6' : '#94a3b8',
            color: 'white',
            cursor: useContainer ? 'default' : 'none',
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
            cursor: useContainer ? 'default' : 'none',
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
            cursor: useContainer ? 'default' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {useContainer ? 'Global Cursor' : 'Container Only'}
        </button>
      </div>

      {/* Interactive Area with Container Reference */}
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative',
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: useContainer ? 'none' : 'default'
        }}
      >
        {/* Container-specific cursor */}
        {useContainer && (
          <CustomCursor 
            containerRef={containerRef} 
            smoothFactor={2}
          >
            {cursorMode === 'simple' ? (
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }} />
            ) : (
              <CustomCursorButton text="Container Only!" />
            )}
          </CustomCursor>
        )}

        <h2>Interactive Area {useContainer && '(Custom Cursor Zone)'}</h2>
        <p>Try moving your cursor here!</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                cursor: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>
                Card {item}
              </h3>
              <p style={{ color: '#64748b' }}>
                Try hovering over this card!
              </p>
            </div>
          ))}
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