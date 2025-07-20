'use client';

import React, { useState, useRef, useCallback } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';
import { CodeBlock } from '../ui';

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
  hideNativeCursor: boolean;
}

const defaultConfig: CursorConfig = {
  enabled: true,
  smoothness: 1,
  offset: { x: 0, y: 0 },
  centered: true,
  throttleMs: 0,
  zIndex: 9999,
  showDevIndicator: true,
  hideNativeCursor: true,
};

const renderCursorContent = () => {
  return (
    <div
      style={{
        width: '0',
        height: '0',
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderBottom: '20px solid #3b82f6',
        transform: 'rotate(-45deg)',
        transition: 'all 0.2s ease',
      }}
    />
  );
};

const renderFallbackCursor = () => {
  return (
    <div
      style={{
        width: '8px',
        height: '8px',
        backgroundColor: '#6b7280',
        borderRadius: '50%',
        border: '1px solid #374151',
        transition: 'all 0.2s ease',
      }}
    />
  );
};

export const Playground: React.FC<PlaygroundProps> = ({ 
  enabledProps = Object.keys(defaultConfig) 
}) => {
  const [config, setConfig] = useState<CursorConfig>(defaultConfig);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateConfig = useCallback((key: keyof CursorConfig, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const shouldShowProp = useCallback((prop: string) => {
    return enabledProps.includes(prop);
  }, [enabledProps]);

  const generateCodeString = useCallback(() => {
    return `${config.hideNativeCursor ? `/* CSS: Hide native cursor on all elements */
.hide-cursor, .hide-cursor * {
  cursor: none !important;
}

<div className="hide-cursor">` : '<div>'}
  <CustomCursor
    enabled={${config.enabled}}
    smoothness={${config.smoothness}}
    offset={{ x: ${config.offset.x}, y: ${config.offset.y} }}
    centered={${config.centered}}
    throttleMs={${config.throttleMs}}
    zIndex={${config.zIndex}}  
    showDevIndicator={${config.showDevIndicator}}
    containerRef={containerRef}
  >
    {/* Your cursor content */}
  </CustomCursor>
  
  {/* Your app content */}
</div>`;
  }, [config]);



  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4">
      {/* Fallback cursor - always visible at lower z-index */}
      <CustomCursor
        enabled={config.hideNativeCursor}
        containerRef={containerRef}
        smoothness={1}
        offset={{ x: 0, y: 0 }}
        centered={true}
        throttleMs={0}
        zIndex={config.zIndex - 1}
        showDevIndicator={false}
      >
        {renderFallbackCursor()}
      </CustomCursor>

      {/* Main interactive cursor */}
      <CustomCursor
        enabled={config.enabled}
        containerRef={containerRef}
        smoothness={config.smoothness}
        offset={config.offset}
        centered={config.centered}
        throttleMs={config.throttleMs}
        zIndex={config.zIndex}
        showDevIndicator={config.showDevIndicator}
      >
        {renderCursorContent()}
      </CustomCursor>

      {/* Single Settings Container */}
      <div 
        ref={containerRef}
        className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700 ${
          config.enabled && config.hideNativeCursor ? 'hide-cursor' : ''
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
          {/* Left Column - Controls */}
          <div className="space-y-3 sm:space-y-4 order-2 lg:order-1">
              {shouldShowProp('enabled') && (
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={(e) => updateConfig('enabled', e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Enabled</span>
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
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Centered</span>
                  </label>
                </div>
              )}

              {shouldShowProp('showDevIndicator') && process.env.NODE_ENV === 'development' && (
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showDevIndicator}
                      onChange={(e) => updateConfig('showDevIndicator', e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-300">Show Dev Indicator</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Development only feature</p>
                </div>
              )}

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hideNativeCursor}
                    onChange={(e) => updateConfig('hideNativeCursor', e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-300">Hide Native Cursor</span>
                </label>
              </div>


              {/* Advanced Controls */}
              {shouldShowProp('smoothness') && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Smoothness: {config.smoothness}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="100"
                    step="1"
                    value={config.smoothness}
                    onChange={(e) => updateConfig('smoothness', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}

              {shouldShowProp('offset') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
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
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
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
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Throttle: {config.throttleMs}ms
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={config.throttleMs}
                    onChange={(e) => updateConfig('throttleMs', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}

              {shouldShowProp('zIndex') && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
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
            
          {/* Right Column - Generated Code */}
          <div className="order-1 lg:order-2">
            <CodeBlock code={generateCodeString()} />
          </div>
        </div>
      </div>
    </div>
  );
};