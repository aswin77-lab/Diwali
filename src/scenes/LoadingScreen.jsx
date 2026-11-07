import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Flame from '../components/Flame';
import { BRAND } from '../config';

const FONTS = ['700 1em "Cinzel Decorative"', '900 1em "Cinzel Decorative"', '1em "Great Vibes"', '400 1em "Poppins"', '600 1em "Poppins"'];

/** Branded loading state – waits for fonts so the first scene never pops in. */
export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    let alive = true;
    const total = FONTS.length;
    let done = 0;
    const tick = () => {
      done++;
      if (alive) setProgress(Math.min(96, 8 + (done / total) * 88));
    };
    const withTimeout = (p) => Promise.race([p.catch(() => {}), new Promise((r) => setTimeout(r, 3000))]).then(tick);

    const jobs = [
      ...FONTS.map((f) => withTimeout(document.fonts?.load ? document.fonts.load(f) : Promise.resolve())),
    ];
    const minWait = new Promise((r) => setTimeout(r, 1900));

    Promise.all([...jobs, minWait]).then(() => {
      if (!alive) return;
      setProgress(100);
      setTimeout(() => alive && onDone(), 350);
    });
    return () => {
      alive = false;
    };
  }, [onDone]);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-6"
      style={{ background: 'radial-gradient(ellipse at 50% 55%, #3a0a1c 0%, #140622 55%, #0a0820 100%)' }}
      role="status"
      aria-live="polite"
    >
      <p className="font-display text-xl font-bold uppercase tracking-[0.3em] text-diya text-glow">{BRAND.name}</p>

      <div className="flex flex-col items-center">
        <Flame size={92} />
        <div
          className="-mt-1 h-3 w-24 rounded-full"
          style={{ background: 'linear-gradient(90deg, #7a3a1a, #f2b84a, #7a3a1a)', boxShadow: '0 0 24px rgba(255,170,50,0.7)' }}
        />
      </div>

      <div className="w-56">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #ff8a1f, #ffe08a)' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
          />
        </div>
        <p className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-diya/90">Lighting the lamps…</p>
      </div>
    </div>
  );
}
