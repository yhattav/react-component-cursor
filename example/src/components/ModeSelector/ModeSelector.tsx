import React from 'react';
import { PARTICLE_MODES } from '../../constants/physics';

interface ModeSelectorProps {
  currentMode: keyof typeof PARTICLE_MODES;
  setCurrentMode: (mode: keyof typeof PARTICLE_MODES) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  setCurrentMode,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        gap: '10px',
        zIndex: 100,
      }}
    >
      {Object.entries(PARTICLE_MODES).map(([mode, props]) => (
        <button
          key={mode}
          onClick={() => setCurrentMode(mode as keyof typeof PARTICLE_MODES)}
          style={{
            background: currentMode === mode ? props.color : 'transparent',
            border: `2px solid ${props.color}`,
            borderRadius: '50%',
            width: props.size,
            height: props.size,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
};
