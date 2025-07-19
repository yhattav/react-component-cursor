'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  /** The code string to display */
  code: string;
  /** Additional className for the container */
  className?: string;
  /** Show copy button on hover */
  showCopyButton?: boolean;
}

/**
 * A reusable code block component with consistent styling
 * Matches the design from playground and quick start sections
 */
function CodeBlock({ 
  code,
  className = '',
  showCopyButton = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-gray-700 relative group ${className}`}>
      {showCopyButton && (
        <button
          onClick={copyToClipboard}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 sm:p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 z-10"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      )}
      <pre className="text-xs sm:text-sm text-gray-300 bg-black/30 p-2 sm:p-3 rounded-lg overflow-x-auto pr-8 sm:pr-12 scrollbar-hide">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export { CodeBlock };
export type { CodeBlockProps }; 