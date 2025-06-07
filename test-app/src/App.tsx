import React, { useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

// Minimal test scenarios for browser testing
const TestApp: React.FC = () => {
  const [cursorMode, setCursorMode] = useState<'simple' | 'custom'>('simple');
  const [showContainer, setShowContainer] = useState(false);

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 data-testid="app-title">React Cursor Library Test</h1>
      
      {/* Test Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          data-testid="toggle-cursor-mode"
          onClick={() => setCursorMode(prev => prev === 'simple' ? 'custom' : 'simple')}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Current: {cursorMode}
        </button>
        
        <button 
          data-testid="toggle-container"
          onClick={() => setShowContainer(prev => !prev)}
          style={{ padding: '8px 16px' }}
        >
          Container Mode: {showContainer ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Global Cursor Test */}
      {!showContainer && (
        <CustomCursor
          data-testid="custom-cursor-global"
          id="test-cursor"
          smoothness={1}
          showDevIndicator={false}
        >
          {cursorMode === 'simple' ? (
            <div 
              data-testid="cursor-simple"
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#ff0000',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ) : (
            <div 
              data-testid="cursor-custom"
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#0066ff',
                borderRadius: '4px',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '10px'
              }}
            >
              ✨
            </div>
          )}
        </CustomCursor>
      )}

      {/* Container Cursor Test */}
      {showContainer && (
        <div 
          data-testid="cursor-container"
          style={{
            width: '400px',
            height: '300px',
            border: '2px solid #ccc',
            padding: '20px',
            position: 'relative',
            backgroundColor: '#f0f0f0'
          }}
        >
          <p>Move mouse in this container</p>
          <CustomCursor
            data-testid="custom-cursor-container"
            id="container-cursor"
            containerRef={{ current: null } as React.RefObject<HTMLElement>}
            smoothness={2}
            showDevIndicator={false}
          >
            <div 
              data-testid="cursor-container-element"
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#00ff00',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </CustomCursor>
        </div>
      )}

      {/* Test Areas */}
      <div style={{ marginTop: '40px' }}>
        <div 
          data-testid="hover-area-1"
          style={{
            width: '200px',
            height: '100px',
            backgroundColor: '#e0e0e0',
            margin: '10px',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '100px'
          }}
        >
          Hover Area 1
        </div>
        
        <div 
          data-testid="hover-area-2"
          style={{
            width: '200px',
            height: '100px',
            backgroundColor: '#d0d0d0',
            margin: '10px',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '100px'
          }}
        >
          Hover Area 2
        </div>
      </div>

      {/* Status Information */}
      <div 
        data-testid="test-status"
        style={{ 
          position: 'fixed', 
          bottom: '10px', 
          left: '10px',
          backgroundColor: '#333',
          color: 'white',
          padding: '8px',
          fontSize: '12px',
          borderRadius: '4px'
        }}
      >
        Test App Ready | Mode: {cursorMode} | Container: {showContainer ? 'Yes' : 'No'}
      </div>
    </div>
  );
};

export default TestApp; 