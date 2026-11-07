import { useId } from 'react';

/** SVG-safe unique id (React's useId contains colons). */
export default function useUid() {
  return useId().replace(/[^a-zA-Z0-9]/g, '');
}
