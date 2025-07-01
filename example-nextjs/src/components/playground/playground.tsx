'use client';

import React, { useState, useRef, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export interface PlaygroundProps {
  enabledProps?: string[]; // Configure which props to show
}

interface CursorConfig {
  enabled: boolean;
  smoothness: number;
  offset: { x: number; y: number };
  centered: boolean;
  throttleMs: number;
  zIndex: number;
  showDevIndicator: boolean;
  cursorType: 'dot' | 'glow' | 'ring' | 'arrow' | 'emoji';
  size: number;
  color: string;
}

const defaultConfig: CursorConfig = {
  enabled: true,
  smoothness: 1,
  offset: { x: 0, y: 0 },
  centered: true,
  throttleMs: 0,
  zIndex: 9999,
  showDevIndicator: true,
  cursorType: 'dot',
  size: 20,
  color: '#3b82f6',
};

const cursorPresets = {
  dot: { type: 'dot' as const, emoji: '•', description: 'Simple dot cursor' },
  glow: { type: 'glow' as const, emoji: '✨', description: 'Glowing effect cursor' },
  ring: { type: 'ring' as const, emoji: '○', description: 'Ring outline cursor' },
  arrow: { type: 'arrow' as const, emoji: '→', description: 'Arrow pointer cursor' },
  emoji: { type: 'emoji' as const, emoji: '🎯', description: 'Emoji cursor' },
};

const renderCursorContent = (config: CursorConfig) => {
  const { cursorType, size, color } = config;
  
  switch (cursorType) {
    case 'dot':
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            transition: 'all 0.2s ease',
          }}
        />
      );
    
    case 'glow':
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, ${color}80 0%, ${color}40 50%, transparent 70%)`,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            transition: 'all 0.2s ease',
          }}
        />
      );
    
    case 'ring':
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            border: `3px solid ${color}`,
            borderRadius: '50%',
            transition: 'all 0.2s ease',
          }}
        />
      );
    
    case 'arrow':
      return (
        <div
          style={{
            width: '0',
            height: '0',
            borderLeft: `${size/2}px solid transparent`,
            borderRight: `${size/2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
            transform: 'rotate(-45deg)',
            transition: 'all 0.2s ease',
          }}
        />
      );
    
    case 'emoji':
      return (
        <div
          style={{
            fontSize: `${size}px`,
            lineHeight: 1,
            transition: 'all 0.2s ease',
          }}
        >
          🎯
        </div>
      );
  }
};

export const Playground: React.FC<PlaygroundProps> = ({ 
  enabledProps = Object.keys(defaultConfig) 
}) => {
  const [config, setConfig] = useState<CursorConfig>(defaultConfig);
  const [previewArea, setPreviewArea] = useState<'main' | 'container'>('main');
  const containerRef = useRef<HTMLDivElement>(null);

  const updateConfig = useCallback((key: keyof CursorConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const shouldShowProp = useCallback((prop: string) => {
    return enabledProps.includes(prop);
  }, [enabledProps]);

  return (
    <div 
      className="relative w-full"
      style={{ cursor: config.enabled ? 'none' : 'auto' }}
    >
      {/* Custom Cursor */}
      <CustomCursor
        enabled={config.enabled && previewArea === 'main'}
        smoothness={config.smoothness}
        offset={config.offset}
        centered={config.centered}
        throttleMs={config.throttleMs}
        zIndex={config.zIndex}
        showDevIndicator={config.showDevIndicator}
      >
        {renderCursorContent(config)}
      </CustomCursor>

      {/* Container-specific cursor */}
      <CustomCursor
        enabled={config.enabled && previewArea === 'container'}
        containerRef={containerRef}
        smoothness={config.smoothness}
        offset={config.offset}
        centered={config.centered}
        throttleMs={config.throttleMs}
        zIndex={config.zIndex}
        showDevIndicator={config.showDevIndicator}
      >
        {renderCursorContent(config)}
      </CustomCursor>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Controls Panel */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            ⚙️ Controls
          </h2>
          
          <div className="space-y-6">
            
            {/* Cursor Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Cursor Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(cursorPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => updateConfig('cursorType', key as CursorConfig['cursorType'])}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      config.cursorType === key
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                    }`}
                    title={preset.description}
                  >
                    <div className="text-lg mb-1">{preset.emoji}</div>
                    <div className="text-xs capitalize">{key}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Area Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Preview Area
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreviewArea('main')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    previewArea === 'main'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  🌐 Global
                </button>
                <button
                  onClick={() => setPreviewArea('container')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    previewArea === 'container'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  📦 Container
                </button>
              </div>
            </div>

            {/* Basic Controls */}
            {shouldShowProp('enabled') && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => updateConfig('enabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Enabled</span>
                </label>
              </div>
            )}

            {shouldShowProp('centered') && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.centered}
                    onChange={(e) => updateConfig('centered', e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Centered</span>
                </label>
              </div>
            )}

            {shouldShowProp('showDevIndicator') && (
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showDevIndicator}
                    onChange={(e) => updateConfig('showDevIndicator', e.target.checked)}
                    className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Show Dev Indicator</span>
                </label>
              </div>
            )}

            {/* Appearance Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Size: {config.size}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={config.size}
                  onChange={(e) => updateConfig('size', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => updateConfig('color', e.target.value)}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Advanced Controls */}
            {shouldShowProp('smoothness') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Smoothness: {config.smoothness}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={config.smoothness}
                  onChange={(e) => updateConfig('smoothness', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Lower = smoother, Higher = more responsive
                </div>
              </div>
            )}

            {shouldShowProp('offset') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Offset X: {config.offset.x}px
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={config.offset.x}
                    onChange={(e) => updateConfig('offset', { ...config.offset, x: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Offset Y: {config.offset.y}px
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={config.offset.y}
                    onChange={(e) => updateConfig('offset', { ...config.offset, y: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            )}

            {shouldShowProp('throttleMs') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Throttle: {config.throttleMs}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={config.throttleMs}
                  onChange={(e) => updateConfig('throttleMs', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-xs text-gray-400 mt-1">
                  0 = no throttling, higher = less frequent updates
                </div>
              </div>
            )}

            {shouldShowProp('zIndex') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Z-Index: {config.zIndex}
                </label>
                <input
                  type="range"
                  min="1"
                  max="99999"
                  step="100"
                  value={config.zIndex}
                  onChange={(e) => updateConfig('zIndex', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

          </div>
        </div>

        {/* Preview Area */}
        <div className="space-y-6">
          
          {/* Main Preview */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 min-h-[400px]">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {previewArea === 'main' ? '🌐 Global Preview' : '📦 Container Preview'}
            </h3>
            
            {previewArea === 'main' ? (
              <div className="space-y-4 text-gray-300">
                <p>Move your mouse around this entire page to see the cursor in action.</p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="font-semibold text-blue-300 mb-2">Interactive Element</h4>
                    <p className="text-sm">Hover over buttons, sliders, and controls to see how the cursor behaves.</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 p-4 rounded-lg border border-green-500/30">
                    <h4 className="font-semibold text-green-300 mb-2">Text Content</h4>
                    <p className="text-sm">The cursor follows your mouse smoothly across all content areas.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                ref={containerRef}
                className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border-2 border-dashed border-purple-500/30 p-8 min-h-[300px]"
                style={{ cursor: config.enabled ? 'none' : 'auto' }}
              >
                <div className="text-center space-y-4">
                  <h4 className="text-lg font-semibold text-purple-300">Container-Scoped Cursor</h4>
                  <p className="text-gray-300">
                    The cursor only appears when your mouse is within this dashed border area.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-400">Hover target</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="w-8 h-8 bg-pink-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-400">Another target</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Move your mouse outside this area to see the cursor disappear
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Code Preview */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              💻 Generated Code
            </h3>
            <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-lg overflow-x-auto">
              <code>{`<CustomCursor
  enabled={${config.enabled}}
  smoothness={${config.smoothness}}
  offset={{ x: ${config.offset.x}, y: ${config.offset.y} }}
  centered={${config.centered}}
  throttleMs={${config.throttleMs}}
  zIndex={${config.zIndex}}
  showDevIndicator={${config.showDevIndicator}}${previewArea === 'container' ? `
  containerRef={containerRef}` : ''}
>
  {/* Your cursor content */}
</CustomCursor>`}</code>
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
};