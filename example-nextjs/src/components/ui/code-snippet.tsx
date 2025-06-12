'use client';

import React from 'react';

interface CodeSnippetProps {
  /** The code string to display with syntax highlighting */
  code: string;
  /** Filename to display in the header */
  filename?: string;
  /** Language for syntax highlighting context */
  language?: 'tsx' | 'typescript' | 'javascript';
  /** Show the macOS-style window controls */
  showWindowControls?: boolean;
  /** Additional className for the container */
  className?: string;
}

/**
 * A reusable code snippet component with syntax highlighting
 * Uses dangerouslySetInnerHTML for pre-highlighted code strings
 */
function CodeSnippet({ 
  code, 
  filename = 'example.tsx',
  language = 'tsx',
  showWindowControls = true,
  className = '',
}: CodeSnippetProps) {
  return (
    <div className={`rounded-lg overflow-hidden border border-white/10 ${className}`}>
      {/* Window header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-b border-white/10">
        {showWindowControls && (
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
        )}
        <div className="text-gray-400 text-xs font-mono ml-1">
          {filename}
        </div>
      </div>
      
      {/* Code content */}
      <div className="p-4 bg-gray-950/50 overflow-x-auto">
        <pre className="text-sm font-mono text-gray-200 leading-relaxed">
          <code 
            dangerouslySetInnerHTML={{ __html: code }}
            className={`language-${language}`}
          />
        </pre>
      </div>
    </div>
  );
}

export { CodeSnippet };
export type { CodeSnippetProps }; 