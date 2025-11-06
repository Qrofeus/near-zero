/**
 * useViewportWidth hook
 * Tracks viewport width with window resize listener
 */

import { useState, useEffect } from 'react';

/**
 * Hook to track viewport width
 * @returns {number} Current viewport width in pixels
 */
export function useViewportWidth() {
  const [width, setWidth] = useState(() => {
    // Initialize with current window width
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024; // Default fallback for SSR
  });

  useEffect(() => {
    // Handler to update width
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}
