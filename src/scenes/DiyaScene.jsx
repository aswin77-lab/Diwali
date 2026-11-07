import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand } from 'lucide-react';
import Diya from '../components/Diya';
import Particles from '../components/Particles';
import SparkleBurst from '../components/SparkleBurst';
import Stars from '../components/Stars';
import useViewport from '../hooks/useViewport';
import * as audio from '../lib/audio';
import { DIYA_SCENE, WISHES } from '../config';

// on wide screens the five diyas sit on a gentle arc
const LIFT = [0, 22, 38, 22, 0];

export default function DiyaScene({ onNext }) {
  const vp = useViewport();
  const [lit, setLit] = useState(() => WISHES.map(() => false));
  const [bursts, setBursts] = useState([]);
  const [wish, setWish] = useState(null);
  const timers = useRef([]);
  const doneRef = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const count = lit.filter(Boolean).length;
  const allLit = count === WISHES.length;

  // phones: 3 + 2 layout with big tap targets; wider screens: one row
  const narrow = vp.w < 600;
  const rows = narrow ? [[0, 1, 2], [3, 4]] : [[0, 1, 2, 3, 4]];
  const byWidth = narrow ? (vp.w - 36) / 3.3 : (vp.w - 80) / 5.6;
  const byHeight = narrow ? (vp.h - 400) / 2 / 0.97 - 36 : 190;
  const diyaW = Math.round(Math.max(56, Math.min(narrow ? 120 : 150, byWidth, byHeight)));

  const light = (i) => {
    if (lit[i] || doneRef.current) return;
    audio.unlock();
    audio.bell(i);
    const next = lit.map((v, k) => (k === i ? true : v));
    setLit(next);
    setWish(i);
    const id = Date.now() + i;
    setBursts((b) => [...b, { id, i }]);
    timers.current.push(setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1300));

    if (next.every(Boolean)) {
      doneRef.current = true;
      timers.current.push(setTimeout(() => audio.finaleFanfare(), 500));
      timers.current.push(setTimeout(onNext, 3200));
    }
  };

  const renderDiya = (i, ri) => {
    const w = WISHES[i];
    const lift = narrow ? 0 : LIFT[i] * (diyaW / 100) * 1.2;
    return (
      <div key={w.title} className="flex flex-col items-center" style={{ transform: `translateY(${-lift}px)` }}>
        <motion.button
          type="button"
          onClick={() => light(i)}
          aria-label={`Light the diya for ${w.title}`}
          aria-pressed={lit[i]}
          className="relative cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-diya"
          style={{ padding: `${diyaW * 0.1}px ${diyaW * 0.04}px` }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + (i + ri) * 0.12, duration: 0.7, type: 'spring', damping: 12 }}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: lit[i] ? 1 : 1.06 }}
        >
          {/* invite pulse on unlit diyas */}
          {!lit[i] && (
            <span
              className="absolute left-1/2 top-[36%] block -translate-x-1/2 rounded-full animate-pulseGlow"
              style={{ width: diyaW * 0.95, height: diyaW * 0.95, background: 'radial-gradient(circle, rgba(255,200,90,0.35), rgba(255,200,90,0) 70%)' }}
            />
          )}
          <Diya variant="clay" lit={lit[i]} width={diyaW} />
          {bursts
            .filter((b) => b.i === i)
            .map((b) => (
              <div key={b.id} className="absolute" style={{ left: `calc(${diyaW * 0.143}px + ${diyaW * 0.04}px)`, top: '38%' }}>
                <SparkleBurst radius={diyaW * 0.95} />
              </div>
            ))}
        </motion.button>
        <motion.span
          className="mt-1 flex h-9 items-start justify-center text-center text-[10px] font-medium uppercase leading-tight tracking-wider text-diya sm:text-xs"
          style={{ maxWidth: Math.max(diyaW * 1.1, 90) }}
          initial={false}
          animate={{ opacity: lit[i] ? 1 : 0, y: lit[i] ? 0 : -6 }}
        >
          {w.title}
        </motion.span>
      </div>
    );
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070517 0%, #14061f 55%, #2c0a1c 100%)' }}
    >
      <Stars count={50} />

      {/* the room brightens as diyas are lit */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 62%, rgba(255,160,50,0.55) 0%, rgba(255,100,30,0.2) 45%, rgba(0,0,0,0) 75%)' }}
        animate={{ opacity: count / WISHES.length }}
        transition={{ duration: 1 }}
      />
      <Particles count={allLit ? 50 : 18} />

      <div className="relative z-10 flex h-full flex-col items-center px-4 pb-[4vh] pt-[76px] text-center">
        <motion.h2
          className="gold-text font-script text-[2.3rem] leading-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          {DIYA_SCENE.instruction}
        </motion.h2>

        {/* wish display */}
        <div className="mt-4 flex min-h-[112px] w-full max-w-md items-start justify-center sm:min-h-[120px]">
          <AnimatePresence mode="wait">
            {wish !== null && (
              <motion.div
                key={wish}
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl border border-diya/40 bg-night/55 px-6 py-3.5 shadow-[0_0_40px_rgba(255,160,40,0.25)] backdrop-blur-md"
              >
                <p className="font-display text-base font-bold uppercase tracking-[0.16em] text-diya text-glow sm:text-xl">{WISHES[wish].title}</p>
                <p className="mt-1.5 text-sm text-cream/90 sm:text-base">{WISHES[wish].text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* diyas */}
        <div className="flex w-full flex-1 flex-col items-center justify-center" style={{ gap: narrow ? 4 : 0 }}>
          {rows.map((row, ri) => (
            <div key={ri} className="flex items-end justify-center" style={{ gap: Math.max(6, diyaW * 0.1) }}>
              {row.map((i) => renderDiya(i, ri))}
            </div>
          ))}
        </div>

        {/* progress */}
        <div className="flex h-10 items-center gap-2" aria-live="polite">
          {allLit ? (
            <motion.p className="gold-text font-script text-3xl" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              {DIYA_SCENE.done}
            </motion.p>
          ) : count === 0 ? (
            <motion.p
              className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-cream/80"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Hand size={16} className="text-diya" /> Tap a diya
            </motion.p>
          ) : (
            WISHES.map((_, i) => (
              <span
                key={i}
                className="block h-2.5 w-2.5 rounded-full transition-all duration-500"
                style={{ background: lit[i] ? '#ffb02e' : 'rgba(255,255,255,0.2)', boxShadow: lit[i] ? '0 0 10px 2px rgba(255,170,50,0.8)' : 'none' }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
