import React from 'react';

interface DebugInfoProps {
  data: Record<string, unknown>;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ data }) => (
  <div className="space-y-4">
    <div className="bg-neutral-900 rounded-lg p-4 overflow-auto">
      <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  </div>
);
