import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Diya from '../components/Diya';
import House from '../components/House';
import Lantern from '../components/Lantern';
import Particles from '../components/Particles';
import Stars from '../components/Stars';
import useViewport from '../hooks/useViewport';
import useGreeting from '../hooks/useGreeting';
import * as audio from '../lib/audio';
import { OPENING, START_MUSIC_AFTER_FIRST_TAP } from '../config';

const LANTERNS = [
  { left: '3%', len: 70, size: 40, color: 'red', delay: 0 },
  { left: '15%', len: 120, size: 34, color: 'gold', delay: 0.4 },
  { left: '80%', len: 110, size: 34, color: 'orange', delay: 0.2 },
  { left: '91%', len: 64, size: 40, color: 'red', delay: 0.6 },
];

export default function Opening({ onNext }) {
  const { to } = useGreeting();
  const vp = useViewport();
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLit(true), 700);
    return () => clearTimeout(t);
  }, []);

  const diyaW = Math.round(Math.max(170, Math.min(300, vp.w * 0.52, vp.h * 0.3)));

  const open = () => {
    audio.unlock();
    audio.bell(2);
    if (START_MUSIC_AFTER_FIRST_TAP) audio.setMusic(true);
    onNext();
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080618 0%, #1a0824 45%, #4a0f26 100%)' }}
    >
      <Stars count={60} />
      <div
        className="absolute left-1/2 top-[38%] h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulseGlow"
        style={{ background: 'radial-gradient(circle, rgba(255,150,40,0.38) 0%, rgba(255,90,30,0.12) 40%, rgba(0,0,0,0) 68%)' }}
      />

      {/* hanging lanterns */}
      {LANTERNS.map((l, i) => (
        <motion.div
          key={i}
          className="absolute top-0"
          style={{ left: l.left }}
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + l.delay, duration: 1.2, type: 'spring', damping: 14 }}
        >
          <Lantern size={l.size} color={l.color} stringLength={l.len} />
        </motion.div>
      ))}

      <Particles count={46} />

      {/* the haveli */}
      <motion.div
        className="absolute inset-x-0 bottom-0 mx-auto max-w-[980px]"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <House />
      </motion.div>

      {/* centre stage */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[16vh] pt-14 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.1, type: 'spring', damping: 12 }}
          className="mb-1"
        >
          <Diya variant="brass" lit={lit} width={diyaW} flameScale={1.15} />
        </motion.div>

        <motion.h1
          className="gold-text font-script text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          {OPENING.headline}
        </motion.h1>

        {to && (
          <motion.p
            className="mt-3 font-display text-sm uppercase tracking-[0.28em] text-cream text-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
          >
            Specially for {to}
          </motion.p>
        )}

        <motion.button
          type="button"
          className="btn-gold mt-7"
          onClick={open}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.8, type: 'spring', damping: 12 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={20} />
          {OPENING.button}
        </motion.button>
      </div>
    </div>
  );
}
