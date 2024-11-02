import React from 'react';

interface CustomCursorButtonProps {
  text: string;
}

export const CustomCursorButton: React.FC<CustomCursorButtonProps> = ({
  text,
}) => {
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
        whiteSpace: 'nowrap',
      }}
    >
      {text} ✨
    </div>
  );
};
