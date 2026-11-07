import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Diya from '../components/Diya';
import Garland from '../components/Garland';
import Particles from '../components/Particles';
import PetalFall from '../components/PetalFall';
import Rangoli from '../components/Rangoli';
import useViewport from '../hooks/useViewport';
import * as audio from '../lib/audio';
import { RANGOLI_TEXT } from '../config';

const RING_DIYAS = 12;

export default function RangoliScene({ onNext }) {
  const vp = useViewport();
  const [litCount, setLitCount] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const timers = useRef([]);

  const size = Math.round(Math.max(220, Math.min(vp.w * 0.74, vp.h * 0.44, 470)));
  const diyaW = Math.round(size * 0.115);
  const R = size / 2 + diyaW * 0.32;
  const box = size + diyaW * 2.2;

  useEffect(() => {
    // light the ring of diyas one after another
    const start = setTimeout(() => {
      let n = 0;
      const iv = setInterval(() => {
        n++;
        setLitCount(n);
        if (n % 3 === 0) audio.bell(n % 5);
        if (n >= RING_DIYAS) clearInterval(iv);
      }, 170);
      timers.current.push(iv);
    }, 3400);
    timers.current.push(start);
    timers.current.push(setTimeout(() => setShowNext(true), 7000));
    timers.current.push(setTimeout(onNext, 13000));
    return () => timers.current.forEach((t) => (clearTimeout(t), clearInterval(t)));
  }, [onNext]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, #5a1230 0%, #2a0a1e 55%, #100618 100%)' }}
    >
      <Garland count={vp.w < 500 ? 8 : 13} />
      <Particles count={26} />
      <PetalFall count={14} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-6 pt-16 text-center">
        {/* zoom in, then gently breathe in and out */}
        <motion.div
          initial={{ scale: 0.55, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1, 0.97, 1] }}
            transition={{ delay: 3.4, duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
            style={{ width: box, height: box }}
          >
            <div
              className="absolute inset-0 rounded-full animate-pulseGlow"
              style={{ background: 'radial-gradient(circle, rgba(255,170,60,0.32) 0%, rgba(255,120,30,0.1) 50%, rgba(0,0,0,0) 72%)' }}
            />
            <div className="absolute" style={{ left: (box - size) / 2, top: (box - size) / 2 }}>
              <Rangoli size={size} />
            </div>

            {Array.from({ length: RING_DIYAS }).map((_, i) => {
              const a = (Math.PI * 2 * i) / RING_DIYAS;
              const cx = box / 2 + Math.sin(a) * R;
              const cy = box / 2 - Math.cos(a) * R;
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: cx - diyaW / 2, top: cy - diyaW * 0.62, width: diyaW }}
                >
                  <Diya variant="clay" lit={i < litCount} width={diyaW} flameScale={0.9} />
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.p
          className="gold-text mt-3 max-w-xl font-script text-[1.9rem] leading-tight sm:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.6, duration: 1.2 }}
        >
          {RANGOLI_TEXT}
        </motion.p>

        <div className="mt-4 h-12">
          {showNext && (
            <motion.button
              type="button"
              className="btn-ghost"
              onClick={() => {
                audio.unlock();
                onNext();
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Continue <ChevronRight size={18} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
