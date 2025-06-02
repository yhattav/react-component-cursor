import React, { useEffect, useState, useCallback } from 'react';
import {
  DemoSection,
  GravitySection,
  PaintSection,
  ContentRevealSection,
  EntryAnimationSection,
  GallerySection,
} from './sections';
import { Section } from './types/Section';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';

// Define all sections
const sections: Section[] = [
  {
    id: 'demo',
    title: 'Basic Demo',
    component: DemoSection,
    height: '100vh',
  },
  {
    id: 'entry-animation',
    title: 'Entry Animation',
    component: EntryAnimationSection,
    height: '100vh',
  },
  {
    id: 'gravity',
    title: 'Gravity',
    component: GravitySection,
    height: '100vh',
  },
  {
    id: 'paint',
    title: 'Paint',
    component: PaintSection,
    height: '100vh',
  },
  {
    id: 'content-reveal',
    title: 'Content Reveal',
    component: ContentRevealSection,
    height: '100vh',
  },
  {
    id: 'gallery',
    title: 'Gallery',
    component: GallerySection,
    height: '100vh',
  },
];

// Add type for debug data
interface DebugData {
  [key: string]: unknown;
}

function App() {
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem('activeSection');
    return saved || 'gravity';
  });

  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  const CurrentSection = sections.find(
    (section) => section.id === activeSection
  )?.component;

  const handleDebugData = useCallback((data: DebugData) => {
    setDebugData(data);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    // Create a container for cursors if it doesn't exist
    if (!document.getElementById('cursor-container')) {
      const cursorContainer = document.createElement('div');
      cursorContainer.id = 'cursor-container';
      cursorContainer.style.position = 'fixed';
      cursorContainer.style.top = '0';
      cursorContainer.style.left = '0';
      cursorContainer.style.pointerEvents = 'none';
      cursorContainer.style.zIndex = '9999';
      document.body.appendChild(cursorContainer);
    }

    return () => {
      const container = document.getElementById('cursor-container');
      if (container) {
        document.body.removeChild(container);
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header with Navigation */}
      <header className="relative z-20">
        <Navigation
          sections={sections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden">
          <div className="h-full animate-fade-in">
            {CurrentSection && <CurrentSection onDebugData={handleDebugData} />}
          </div>
        </main>

        {/* Sidebar */}
        <Sidebar
          debugData={debugData}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
      </div>
    </div>
  );
}

export default App;
