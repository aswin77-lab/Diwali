import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { rand } from '../lib/device';

const STAR = 'M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z';

/** Small radial burst of golden sparkles (one-shot). */
function SparkleBurst({ count = 14, radius = 80, colors = ['#fff1b8', '#ffd56a', '#ffb02e'] }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const a = (Math.PI * 2 * i) / count + rand(-0.25, 0.25);
        const d = rand(radius * 0.5, radius);
        return { x: Math.cos(a) * d, y: Math.sin(a) * d - 10, s: rand(0.6, 1.3), dur: rand(0.7, 1.1), c: colors[i % colors.length], r: rand(-90, 90) };
      }),
    [count, radius] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0" aria-hidden="true">
      {items.map((it, i) => (
        <motion.svg
          key={i}
          viewBox="-8 -8 16 16"
          width="16"
          height="16"
          className="absolute -left-2 -top-2"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: it.x, y: it.y, scale: [0, it.s, 0], opacity: [1, 1, 0], rotate: it.r }}
          transition={{ duration: it.dur, ease: 'easeOut' }}
        >
          <path d={STAR} fill={it.c} />
        </motion.svg>
      ))}
    </div>
  );
}

export default memo(SparkleBurst);
