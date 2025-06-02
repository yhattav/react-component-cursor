import React from 'react';
import { DebugInfo } from './DebugInfo';

interface SidebarProps {
  debugData: Record<string, unknown> | null;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  debugData, 
  isOpen = true,
  onToggle 
}) => {
  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 lg:hidden button-primary"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 right-0 z-40 w-80 min-w-[320px] max-w-md
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          glass-effect border-l border-neutral-200/50 
          overflow-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent
        `}
      >
        <div className="h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-neutral-200/50">
            <h2 className="text-lg font-semibold text-neutral-900">Debug Information</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Real-time cursor data and component state
            </p>
          </div>

          {/* Sidebar Content */}
          <div className="p-6">
            {debugData ? (
              <DebugInfo data={debugData} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-neutral-500 text-sm">
                  No debug data available
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
}; 