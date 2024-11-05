import React from 'react';

interface DebugInfoProps {
  data: {
    mode: string;
    isMouseInContainer1: boolean;
    cursor1Position: { x: number; y: number };
    lastGlobalPosition: { x: number; y: number };
    globalCursorMode: string;
    containerCursorMode: string;
  };
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ data }) => (
  <div
    style={{
      position: 'fixed',
      top: 10,
      right: 10,
      width: '300px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontSize: '12px',
      zIndex: 10000,
    }}
  >
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
