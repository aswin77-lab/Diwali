import { useEffect, useState } from 'react';

/** Tracks viewport size (handles mobile browser chrome via visualViewport). */
export default function useViewport() {
  const read = () => ({
    w: window.visualViewport?.width || window.innerWidth,
    h: window.visualViewport?.height || window.innerHeight,
  });
  const [v, setV] = useState(read);
  useEffect(() => {
    const on = () => setV(read());
    window.addEventListener('resize', on);
    window.visualViewport?.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => {
      window.removeEventListener('resize', on);
      window.visualViewport?.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
    };
  }, []);
  return v;
}
