import { useEffect, useState } from 'react';
import * as audio from '../lib/audio';

/** React binding for the procedural audio engine. */
export default function useAudio() {
  const [s, setS] = useState(audio.getState());
  useEffect(() => audio.subscribe(setS), []);
  return {
    ...s,
    toggleMusic: () => audio.setMusic(!s.musicOn),
    toggleMute: () => audio.setMuted(!s.muted),
  };
}
