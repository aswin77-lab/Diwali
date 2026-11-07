import { useMemo } from 'react';

const clean = (v) =>
  (v || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40);

/** Reads ?from=YourName&to=FriendName from the URL. */
export default function useGreeting() {
  return useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    return { from: clean(p.get('from')), to: clean(p.get('to')) };
  }, []);
}
