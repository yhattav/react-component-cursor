import React from 'react';

interface DebugInfoProps {
  data: any;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ data }) => (
  <div
    style={{
      padding: '1rem',
      fontSize: '12px',
    }}
  >
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);
