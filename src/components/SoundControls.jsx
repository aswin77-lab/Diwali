import { Music, Music2, Volume2, VolumeX } from 'lucide-react';
import useAudio from '../hooks/useAudio';
import * as audio from '../lib/audio';

const btn =
  'flex h-11 items-center gap-1.5 rounded-full border border-diya/50 bg-night/70 px-3.5 text-[11px] font-medium uppercase tracking-wider text-cream backdrop-blur-md transition active:scale-95 hover:border-diya hover:bg-night/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-diya';

/** Always-visible music ON/OFF toggle and a global mute button. */
export default function SoundControls() {
  const { musicOn, muted, toggleMusic, toggleMute } = useAudio();

  return (
    <div className="fixed right-3 top-3 z-50 flex gap-2" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <button
        type="button"
        className={btn}
        onClick={() => {
          audio.unlock();
          toggleMusic();
        }}
        aria-pressed={musicOn}
        aria-label={musicOn ? 'Turn music off' : 'Turn music on'}
      >
        {musicOn ? <Music2 size={16} className="text-diya" /> : <Music size={16} className="opacity-70" />}
        <span>Music {musicOn ? 'On' : 'Off'}</span>
      </button>
      <button
        type="button"
        className={`${btn} !px-3`}
        onClick={() => {
          audio.unlock();
          toggleMute();
        }}
        aria-pressed={muted}
        aria-label={muted ? 'Unmute all sounds' : 'Mute all sounds'}
      >
        {muted ? <VolumeX size={17} className="text-ruby" /> : <Volume2 size={17} className="text-diya" />}
      </button>
    </div>
  );
}
