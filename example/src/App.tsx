import React, { useState } from 'react';
import { Navigation, Sidebar } from './components';
import { DemoSection } from './sections/DemoSection';

function App() {
  const [activeSection, setActiveSection] = useState('demo');

  const sections = [
    { id: 'demo', name: 'Demo', title: 'Demo Section', height: 'auto', component: DemoSection },
    { id: 'gravity', name: 'Gravity', title: 'Gravity Section', height: 'auto', component: () => <div className="p-8"><h2 className="text-2xl font-bold text-neutral-900">Gravity Section</h2><p className="text-neutral-600 mt-2">Coming soon...</p></div> },
    { id: 'content-reveal', name: 'Content Reveal', title: 'Content Reveal Section', height: 'auto', component: () => <div className="p-8"><h2 className="text-2xl font-bold text-neutral-900">Content Reveal Section</h2><p className="text-neutral-600 mt-2">Coming soon...</p></div> },
    { id: 'entry-animation', name: 'Entry Animation', title: 'Entry Animation Section', height: 'auto', component: () => <div className="p-8"><h2 className="text-2xl font-bold text-neutral-900">Entry Animation Section</h2><p className="text-neutral-600 mt-2">Coming soon...</p></div> },
    { id: 'paint', name: 'Paint', title: 'Paint Section', height: 'auto', component: () => <div className="p-8"><h2 className="text-2xl font-bold text-neutral-900">Paint Section</h2><p className="text-neutral-600 mt-2">Coming soon...</p></div> },
    { id: 'gallery', name: 'Gallery', title: 'Gallery Section', height: 'auto', component: () => <div className="p-8"><h2 className="text-2xl font-bold text-neutral-900">Gallery Section</h2><p className="text-neutral-600 mt-2">Coming soon...</p></div> },
  ];

  const activeComponent = sections.find(section => section.id === activeSection)?.component;
  const ActiveComponent = activeComponent || (() => <div>Section not found</div>);

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-neutral-200 flex-shrink-0">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">React Component Cursor</h1>
          <Navigation
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 bg-white overflow-auto">
          <ActiveComponent />
        </main>

        {/* Right Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
