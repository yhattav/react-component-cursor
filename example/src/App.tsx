import React, { useState, useCallback } from 'react';
import { Navigation, Sidebar } from './components';
import { DemoSection } from './sections/DemoSection';

function App() {
  const [activeSection, setActiveSection] = useState('demo');
  const [debugData, setDebugData] = useState<Record<string, unknown>>({});

  const handleDebugData = useCallback((data: Record<string, unknown>) => {
    setDebugData(data);
  }, []);

  // Simple sections for navigation only
  const navigationSections = [
    { id: 'demo', name: 'Demo', title: 'Demo' },
    { id: 'gravity', name: 'Gravity', title: 'Gravity' },
    { id: 'content-reveal', name: 'Content Reveal', title: 'Content Reveal' },
    { id: 'entry-animation', name: 'Entry Animation', title: 'Entry Animation' },
    { id: 'paint', name: 'Paint', title: 'Paint' },
    { id: 'gallery', name: 'Gallery', title: 'Gallery' },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'demo':
        return <DemoSection onDebugData={handleDebugData} />;
      case 'gravity':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Gravity Section</h2>
            <p className="text-neutral-600 mt-2">Coming soon...</p>
          </div>
        );
      case 'content-reveal':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Content Reveal Section</h2>
            <p className="text-neutral-600 mt-2">Coming soon...</p>
          </div>
        );
      case 'entry-animation':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Entry Animation Section</h2>
            <p className="text-neutral-600 mt-2">Coming soon...</p>
          </div>
        );
      case 'paint':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Paint Section</h2>
            <p className="text-neutral-600 mt-2">Coming soon...</p>
          </div>
        );
      case 'gallery':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900">Gallery Section</h2>
            <p className="text-neutral-600 mt-2">Coming soon...</p>
          </div>
        );
      default:
        return <div className="p-8">Section not found</div>;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-neutral-200 flex-shrink-0">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">React Component Cursor</h1>
          <Navigation
            sections={navigationSections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 bg-white overflow-auto">
          {renderActiveSection()}
        </main>

        {/* Right Sidebar */}
        <Sidebar debugData={debugData} />
      </div>
    </div>
  );
}

export default App;
