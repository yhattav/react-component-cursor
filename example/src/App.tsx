import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('demo');

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Test Header */}
      <header className="w-full bg-white shadow-md border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tailwind CSS Test Page</h1>
          <p className="text-gray-600 mt-1">Testing if Tailwind CSS is working correctly</p>
        </div>
      </header>

      {/* Test Navigation */}
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex space-x-4">
          {['demo', 'gravity', 'paint'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Debug Info</h2>
              <p className="text-sm text-gray-500 mt-1">Sidebar content</p>
            </div>
            <div className="flex-1 p-6">
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-xs text-green-400 font-mono">
{JSON.stringify({ 
  activeTab, 
  tailwindWorking: true,
  timestamp: new Date().toISOString()
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white overflow-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Active Section: {activeTab}
              </h2>
              
              {/* Test Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-2">Gradients</h3>
                  <p className="text-blue-100">Testing gradient backgrounds</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Hover Effects</h3>
                  <p className="text-gray-600">Testing hover animations</p>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-2">Colors</h3>
                  <p className="text-yellow-700">Testing color system</p>
                </div>
              </div>

              {/* Test Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200">
                  Primary Button
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg border border-gray-300 transition-colors duration-200">
                  Secondary Button
                </button>
                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors duration-200">
                  Outline Button
                </button>
              </div>

              {/* Test Typography */}
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Typography Test</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This is a test paragraph to verify that Tailwind CSS typography classes are working correctly. 
                  The text should be properly styled with the right font family, size, and spacing.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Flexbox layout: <span className="text-green-600 font-semibold">✓ Working</span></li>
                  <li>Color system: <span className="text-green-600 font-semibold">✓ Working</span></li>
                  <li>Spacing utilities: <span className="text-green-600 font-semibold">✓ Working</span></li>
                  <li>Hover effects: <span className="text-green-600 font-semibold">✓ Working</span></li>
                  <li>Responsive grid: <span className="text-green-600 font-semibold">✓ Working</span></li>
                </ul>
              </div>

              {/* Test Responsive Layout */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Responsive Test</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="w-full h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mb-3"></div>
                      <p className="text-sm text-gray-600">Item {num}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
