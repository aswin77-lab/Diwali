import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hand, PartyPopper } from 'lucide-react';
import FireworksCanvas from '../components/FireworksCanvas';
import Lantern from '../components/Lantern';
import Skyline from '../components/Skyline';
import Stars from '../components/Stars';
import * as audio from '../lib/audio';
import { rand } from '../lib/device';
import { FIREWORKS } from '../config';

const SKY_LANTERNS = Array.from({ length: 7 }).map((_, i) => ({
  left: 6 + i * 14 + rand(-4, 4),
  size: rand(24, 40),
  dur: rand(22, 34),
  delay: -rand(0, 30),
  dx: rand(-50, 50),
  color: ['gold', 'orange', 'red'][i % 3],
}));

export default function FireworksScene({ onNext }) {
  const [tapped, setTapped] = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.push(setTimeout(() => setShowMsg(true), 6500));
    timers.current.push(setTimeout(() => setShowBtn(true), 9500));
    timers.current.push(setTimeout(onNext, 30000));
    return () => timers.current.forEach(clearTimeout);
  }, [onNext]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #03020f 0%, #0b0722 45%, #2a0a26 82%, #4a1226 100%)' }}
      onPointerDown={() => setTapped((t) => t + 1)}
    >
      <Stars count={90} />

      {/* floating sky lanterns */}
      {SKY_LANTERNS.map((l, i) => (
        <div
          key={i}
          className="pointer-events-none absolute bottom-[-80px] animate-floatUp will-change-transform"
          style={{ left: `${l.left}%`, '--dur': `${l.dur}s`, '--dx': `${l.dx}px`, animationDelay: `${l.delay}s` }}
        >
          <Lantern hanging={false} size={l.size} color={l.color} />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <Skyline />
      </div>

      {/* interactive fireworks layer */}
      <FireworksCanvas interactive sound auto rate={0.9} yRange={[0.12, 0.5]} />

      {/* overlays never block taps except the button itself */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between px-5 pb-[7vh] pt-[76px] text-center">
        <AnimatePresence>
          {tapped < 4 && (
            <motion.p
              key="hint"
              className="flex w-max max-w-[94vw] items-center gap-2 whitespace-nowrap rounded-full border border-diya/40 bg-night/55 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-cream backdrop-blur-md sm:text-xs sm:tracking-[0.22em]"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ delay: 0.8 }}
            >
              <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                <Hand size={16} className="text-diya" />
              </motion.span>
              {FIREWORKS.hint}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-5">
          <AnimatePresence>
            {showMsg && (
              <motion.p
                key="msg"
                className="gold-text max-w-2xl font-script text-[1.9rem] leading-tight sm:text-5xl"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.4 }}
              >
                {FIREWORKS.message}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="h-[52px]">
            {showBtn && (
              <motion.button
                type="button"
                className="btn-gold pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  audio.unlock();
                  onNext();
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <PartyPopper size={20} />
                {FIREWORKS.button}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
