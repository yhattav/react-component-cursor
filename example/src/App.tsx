import React, { useState, useCallback, useEffect } from 'react';
import { Navigation, Sidebar } from './components';
import { getNavigationSections, getSectionComponent } from './sections/registry';
import { InitialRenderVisualTest } from './pages/InitialRenderVisualTest';

function App() {
  const [activeSection, setActiveSection] = useState('demo');
  const [debugData, setDebugData] = useState<Record<string, unknown>>({});
  const [currentPage, setCurrentPage] = useState<string>('sections');

  const handleDebugData = useCallback((data: Record<string, unknown>) => {
    setDebugData(data);
  }, []);

  // Handle URL-based routing
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname + window.location.hash;
      if (path.includes('/initial-render-visual-test')) {
        setCurrentPage('initial-render-visual-test');
      } else {
        setCurrentPage('sections');
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  // Get navigation sections from registry
  const navigationSections = getNavigationSections();

  const renderActiveSection = () => {
    const SectionComponent = getSectionComponent(activeSection);
    
    if (!SectionComponent) {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-neutral-900">Section Not Found</h2>
          <p className="text-neutral-600 mt-2">
            The section "{activeSection}" could not be found.
          </p>
        </div>
      );
    }

    return <SectionComponent onDebugData={handleDebugData} />;
  };

  const renderCurrentPage = () => {
    if (currentPage === 'initial-render-visual-test') {
      return <InitialRenderVisualTest />;
    }
    
    return (
      <div className="h-screen w-screen flex flex-col bg-neutral-50">
        {/* Header */}
        <header className="w-full bg-white shadow-sm border-b border-neutral-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-neutral-900">React Component Cursor</h1>
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/react-component-cursor/initial-render-visual-test');
                  setCurrentPage('initial-render-visual-test');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                🐛 Visual Bug Test
              </button>
            </div>
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
  };

  return renderCurrentPage();
}

export default App;
