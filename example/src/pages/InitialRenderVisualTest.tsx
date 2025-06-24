import { useRef, useState } from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

export function InitialRenderVisualTest() {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  
  const [section1Visible, setSection1Visible] = useState(false);
  const [section2Visible, setSection2Visible] = useState(false);

  return (
    <div className="w-full">
      {/* Back to main app button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/react-component-cursor/');
            window.location.reload(); // Simple way to go back to main app
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-lg"
        >
          ← Back to Main App
        </button>
      </div>
      {/* Section 1 - Initial Load Test */}
      <div
        ref={section1Ref}
        className="h-screen bg-gradient-to-br from-red-100 to-red-200 flex flex-col items-center justify-center relative"
      >
        <CustomCursor
          id="section1-cursor"
          containerRef={section1Ref}
          onVisibilityChange={setSection1Visible}
          showDevIndicator={true}
        >
          <div className="bg-red-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
            🔴 Section 1 Cursor
          </div>
        </CustomCursor>

        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-5xl font-bold text-red-900 mb-6">
            Section 1: Initial Load Bug Test
          </h1>
          
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-4">Expected Bug Behavior:</h2>
            <ul className="text-left text-red-700 space-y-2">
              <li><strong>✅ Page loads with mouse in this section</strong></li>
              <li><strong>🔧 FIXED:</strong> Both cursors now have unique IDs (no more conflicts!)</li>
              <li><strong>📝 Note:</strong> Library auto-generates UUIDs when no ID is provided</li>
              <li><strong>🧪 Test:</strong> Both sections should work independently now</li>
            </ul>
          </div>

          <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm mb-8">
            <div className="text-center">
              <span className="text-gray-400">Debug Info:</span>
              <br />
              <span className={`font-bold ${section1Visible ? 'text-green-400' : 'text-red-400'}`}>
                Section 1 Cursor Visible: {section1Visible.toString()}
              </span>
            </div>
          </div>

          <div className="text-lg text-red-600">
            <p className="mb-4">
              <strong>Instructions:</strong> If your mouse is in this section when the page loads,
              the cursor should be visible immediately but likely isn't due to the bug.
            </p>
            <p>
              Scroll down to Section 2, then scroll back up. The cursor should work properly after that.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Scroll to Section 2 ↓
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 - Comparison Test */}
      <div
        id="section2"
        ref={section2Ref}
        className="h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center relative"
      >
        <CustomCursor
          id="section2-cursor"
          containerRef={section2Ref}
          onVisibilityChange={setSection2Visible}
          showDevIndicator={true}
        >
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
            🔵 Section 2 Cursor
          </div>
        </CustomCursor>

        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">
            Section 2: Comparison Test
          </h1>
          
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Expected Normal Behavior:</h2>
            <ul className="text-left text-blue-700 space-y-2">
              <li><strong>✅ Mouse enters this section from Section 1</strong></li>
              <li><strong>✅ Cursor appears immediately (works correctly)</strong></li>
              <li><strong>🔄 Return to Section 1:</strong> Cursor will now work there too</li>
              <li><strong>📝 Observation:</strong> Initial load vs navigation difference</li>
            </ul>
          </div>

          <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm mb-8">
            <div className="text-center">
              <span className="text-gray-400">Debug Info:</span>
              <br />
              <span className={`font-bold ${section2Visible ? 'text-green-400' : 'text-red-400'}`}>
                Section 2 Cursor Visible: {section2Visible.toString()}
              </span>
            </div>
          </div>

          <div className="text-lg text-blue-600">
            <p className="mb-4">
              <strong>Test Result:</strong> When you scroll into this section from Section 1,
              the cursor should appear immediately because the mouse "enters" the container.
            </p>
            <p>
              This demonstrates that the mouseenter event works correctly during navigation,
              but not during initial page load.
            </p>
          </div>

          <div className="mt-8 space-x-4">
            <button
              onClick={() => {
                section1Ref.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              ↑ Back to Section 1
            </button>
            
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              🔄 Reload Page (Reset Test)
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Debug Panel */}
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg font-mono text-sm">
        <div className="text-center">
          <div className="text-gray-300 mb-2">Live Debug Info</div>
          <div className={`${section1Visible ? 'text-green-400' : 'text-red-400'}`}>
            Section 1: {section1Visible ? 'VISIBLE' : 'HIDDEN'}
          </div>
          <div className={`${section2Visible ? 'text-green-400' : 'text-red-400'}`}>
            Section 2: {section2Visible ? 'VISIBLE' : 'HIDDEN'}
          </div>
        </div>
      </div>
    </div>
  );
} 