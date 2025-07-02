'use client';

import React, { useState, useEffect } from 'react';

export default function TestTransitions() {
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    if (isClient && typeof document !== 'undefined' && document.startViewTransition) {
      console.log('Starting transition...');
      document.startViewTransition(() => {
        console.log('Transition callback');
        setShowModal(!showModal);
      });
    } else {
      setShowModal(!showModal);
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        ::view-transition-group(moving-box) {
          animation-duration: 2s;
          animation-timing-function: ease-in-out;
        }
      `}</style>
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-8">
          <h1 className="text-2xl mb-4">View Transitions Test - Moving Box</h1>
          
          <div className="relative min-h-[600px]">
            
            {/* Single Element - changes position AND size */}
            <div
              className={`${
                showModal 
                  ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-3xl rounded-2xl' 
                  : 'absolute top-8 left-8 w-24 h-24 text-sm rounded'
              } bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl`}
              style={{ viewTransitionName: 'moving-box' }}
              onClick={handleClick}
            >
              {showModal ? 'Click to Return' : 'Click Me!'}
            </div>
            
            {/* Visual guides to show the two positions */}
            <div className="absolute top-8 left-8 w-24 h-24 border-2 border-dashed border-gray-600 rounded opacity-30 pointer-events-none">
              <span className="absolute -bottom-6 left-0 text-xs text-gray-500">Start Position</span>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-dashed border-gray-600 rounded-2xl opacity-30 pointer-events-none">
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">End Position</span>
            </div>
          </div>

          {/* Debug Info */}
          <div className="fixed bottom-4 right-4 bg-white/10 text-white p-3 rounded text-sm">
            <div>View Transitions: {(typeof document !== 'undefined' && 'startViewTransition' in document) ? '✅' : '❌'}</div>
            <div>State: {showModal ? 'Large (Center)' : 'Small (Top-Left)'}</div>
            <div>Client: {isClient ? '✅' : '❌'}</div>
            <div className="text-green-300 mt-2">
              Should see box move from corner to center!
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 