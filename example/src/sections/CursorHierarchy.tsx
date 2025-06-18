import React from 'react';
import { CustomCursor } from '@yhattav/react-component-cursor';

const CursorHierarchy: React.FC = () => {
  const pageRef = React.useRef<HTMLDivElement>(null);
  const container1Ref = React.useRef<HTMLDivElement>(null);
  const innerContainer1Ref = React.useRef<HTMLDivElement>(null);
  const container2Ref = React.useRef<HTMLDivElement>(null);
  const innerContainer2Ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className="p-8" ref={pageRef}>
      <h1 className="text-2xl font-bold mb-6">Cursor Hierarchy Example</h1>
      <p className="mb-4">
        This example demonstrates how cursor styles are applied based on container hierarchy.
        Each container is color-coded to show its showNativeCursor setting:
      </p>
      <ul className="list-disc ml-6 mb-6">
        <li><span className="text-red-500">Red</span> = showNativeCursor: false</li>
        <li><span className="text-green-500">Green</span> = showNativeCursor: true</li>
      </ul>

      {/* Page level cursor (false) */}
      <CustomCursor showNativeCursor={false} containerRef={pageRef}>
        <div className="w-6 h-6 bg-red-500 rounded-full" />
      </CustomCursor>

      {/* Container 1 (true) */}
      <div 
        ref={container1Ref}
        className="p-8 mb-8 border-2 border-green-500 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Container 1 (showNativeCursor: true)</h2>
        <CustomCursor showNativeCursor={true} containerRef={container1Ref}>
          <div className="w-6 h-6 bg-green-500 rounded-full" />
        </CustomCursor>

        {/* Inner Container 1 (false) */}
        <div 
          ref={innerContainer1Ref}
          className="p-8 mt-4 border-2 border-red-500 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Inner Container 1 (showNativeCursor: false)</h3>
          <CustomCursor showNativeCursor={false} containerRef={innerContainer1Ref}>
            <div className="w-6 h-6 bg-red-500 rounded-full" />
          </CustomCursor>
        </div>
      </div>

      {/* Container 2 (false) */}
      <div 
        ref={container2Ref}
        className="p-8 mb-8 border-2 border-red-500 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Container 2 (showNativeCursor: false)</h2>
        <CustomCursor showNativeCursor={false} containerRef={container2Ref}>
          <div className="w-6 h-6 bg-red-500 rounded-full" />
        </CustomCursor>

        {/* Inner Container 2 (true) */}
        <div 
          ref={innerContainer2Ref}
          className="p-8 mt-4 border-2 border-green-500 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Inner Container 2 (showNativeCursor: true)</h3>
          <CustomCursor showNativeCursor={true} containerRef={innerContainer2Ref}>
            <div className="w-6 h-6 bg-green-500 rounded-full" />
          </CustomCursor>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">How to Test</h2>
        <ol className="list-decimal ml-6">
          <li>Move your cursor over the page (outside containers) - should see red cursor (no native cursor)</li>
          <li>Move into Container 1 - should see green cursor (native cursor visible)</li>
          <li>Move into Inner Container 1 - should see red cursor (no native cursor)</li>
          <li>Move into Container 2 - should see red cursor (no native cursor)</li>
          <li>Move into Inner Container 2 - should see green cursor (native cursor visible)</li>
        </ol>
      </div>
    </div>
  );
};

export default CursorHierarchy; 