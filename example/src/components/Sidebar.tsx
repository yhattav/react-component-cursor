import React from 'react';
import { Card, Typography } from './ui';

const { Title, Text } = Typography;

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  return (
    <aside className={`w-80 bg-white border-l border-neutral-200 flex-shrink-0 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <Title level={3}>Debug Info</Title>
          <Text className="text-neutral-500">Component settings and state</Text>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Current State */}
            <Card className="p-4">
              <Title level={4} className="mb-3">Current State</Title>
              <div className="bg-neutral-900 rounded-lg p-4">
                <pre className="text-xs text-green-400 font-mono">
{JSON.stringify({ 
  status: 'active',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}, null, 2)}
                </pre>
              </div>
            </Card>

            {/* Component Info */}
            <Card className="p-4">
              <Title level={4} className="mb-3">Component Info</Title>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-neutral-600">Library:</Text>
                  <Text className="font-medium">React Component Cursor</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-neutral-600">Framework:</Text>
                  <Text className="font-medium">React + TypeScript</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-neutral-600">Styling:</Text>
                  <Text className="font-medium">Tailwind CSS</Text>
                </div>
              </div>
            </Card>

            {/* Performance */}
            <Card className="p-4">
              <Title level={4} className="mb-3">Performance</Title>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Text className="text-neutral-600">Bundle Size:</Text>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    &lt;10KB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-neutral-600">Dependencies:</Text>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    Minimal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-neutral-600">React Version:</Text>
                  <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full font-medium">
                    18+
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </aside>
  );
}; 