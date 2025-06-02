import React from 'react';
import { Typography } from './ui';
import { InfoView } from './InfoView';

const { Title, Text } = Typography;

interface SidebarProps {
  debugData?: Record<string, unknown>;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  debugData = {}, 
  className = '' 
}) => {
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
          <InfoView debugData={debugData} />
        </div>
      </div>
    </aside>
  );
}; 