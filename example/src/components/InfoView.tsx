import React from 'react';
import { Card, Typography } from './ui';
import { DebugInfo } from './DebugInfo';

const { Title, Text } = Typography;

interface InfoViewProps {
  debugData?: Record<string, unknown>;
  className?: string;
}

export const InfoView: React.FC<InfoViewProps> = ({ 
  debugData = {}, 
  className = '' 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Live Debug Data */}
      <Card className="p-4">
        <Title level={4} className="mb-3">Live Debug Data</Title>
        <Text className="text-neutral-500 text-sm mb-3">
          Real-time information from the CustomCursor component
        </Text>
        <DebugInfo data={debugData} />
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
  );
}; 