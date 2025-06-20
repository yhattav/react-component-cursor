import { useState, useEffect } from 'react';

interface WindowDimensions {
  width: number;
  height: number;
}

function useWindowDimensions(): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: 1920,
    height: 1080,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowDimensions;
}

export { useWindowDimensions };
export type { WindowDimensions }; 