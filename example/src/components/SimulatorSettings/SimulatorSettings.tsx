import React from 'react';
import { SETTINGS_METADATA } from '../../constants/physics';
import { useSettings } from '../../hooks/useSettings';

interface SimulatorSettingsProps {
  onSettingsChange: (settings: typeof PHYSICS_CONFIG) => void;
}

const SLIDER_RANGES = {
  NEW_PARTICLE_MASS: { min: 0.001, max: 0.5, step: 0.001 },
  FRICTION: { min: 0.0, max: 1, step: 0.001 },
  DELTA_TIME: { min: 1 / 120, max: 1 / 30, step: 1 / 120 },
  POINTER_MASS: { min: 10000, max: 1000000, step: 10000 },
};

export const SimulatorSettings: React.FC<SimulatorSettingsProps> = ({
  onSettingsChange,
}) => {
  const {
    settings,
    showDevSettings,
    updateSettings,
    updateShowDevSettings,
    isDevelopment,
  } = useSettings();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSettingChange = (key: keyof typeof settings, value: number) => {
    const newSettings = { [key]: value };
    updateSettings(newSettings);
    onSettingsChange({ ...settings, ...newSettings });
  };

  const handleShowDevSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateShowDevSettings(e.target.checked);
  };

  const shouldShowSetting = (key: keyof typeof PHYSICS_CONFIG) => {
    const isDevSetting = SETTINGS_METADATA[key].isDev;
    return !isDevSetting || (isDevelopment && showDevSettings);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '8px',
        color: 'white',
        zIndex: 1000,
        minWidth: '250px',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0' }}>Simulator Settings</h3>

      {isDevelopment && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={showDevSettings}
              onChange={handleShowDevSettingsChange}
            />
            Show Dev Settings
          </label>
        </div>
      )}

      {Object.entries(settings).map(([key, value]) =>
        shouldShowSetting(key as keyof typeof PHYSICS_CONFIG) ? (
          <div key={key} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>
                {key.replace(/_/g, ' ')}
                {SETTINGS_METADATA[key as keyof typeof SETTINGS_METADATA]
                  .isDev && (
                  <span style={{ color: '#ff6b6b', marginLeft: '4px' }}>
                    (dev)
                  </span>
                )}
              </label>
              <span>{Number(value).toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={SLIDER_RANGES[key as keyof typeof SLIDER_RANGES].min}
              max={SLIDER_RANGES[key as keyof typeof SLIDER_RANGES].max}
              step={SLIDER_RANGES[key as keyof typeof SLIDER_RANGES].step}
              value={value}
              onChange={(e) =>
                handleSettingChange(
                  key as keyof typeof PHYSICS_CONFIG,
                  Number(e.target.value)
                )
              }
              style={{ width: '100%' }}
            />
          </div>
        ) : null
      )}
    </div>
  );
};
