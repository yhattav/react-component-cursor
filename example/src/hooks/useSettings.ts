import { useState, useEffect } from 'react';
import { PHYSICS_CONFIG, SETTINGS_METADATA } from '../constants/physics';

const STORAGE_KEYS = {
  SETTINGS: 'simulatorSettings',
  SHOW_DEV: 'showDevSettings',
} as const;

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return savedSettings ? JSON.parse(savedSettings) : PHYSICS_CONFIG;
  });

  const [showDevSettings, setShowDevSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOW_DEV);
    return saved ? JSON.parse(saved) : false;
  });

  const updateSettings = (newSettings: Partial<typeof PHYSICS_CONFIG>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(
      STORAGE_KEYS.SETTINGS,
      JSON.stringify(updatedSettings)
    );
  };

  const updateShowDevSettings = (show: boolean) => {
    setShowDevSettings(show);
    localStorage.setItem(STORAGE_KEYS.SHOW_DEV, JSON.stringify(show));
  };

  const resetSettings = () => {
    setSettings(PHYSICS_CONFIG);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(PHYSICS_CONFIG));
  };

  return {
    settings,
    showDevSettings,
    updateSettings,
    updateShowDevSettings,
    resetSettings,
    isDevelopment: process.env.NODE_ENV === 'development',
  };
};
