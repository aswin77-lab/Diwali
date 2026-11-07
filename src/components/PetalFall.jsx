import { memo, useMemo } from 'react';
import { effectScale, rand, pick } from '../lib/device';

const COLORS = ['#ff9a1a', '#ffc21a', '#ff6a1a', '#ffb347', '#e63a5a', '#ffd86a'];

/** Gently falling marigold / rose petals. */
function PetalFall({ count = 26, className = '' }) {
  const petals = useMemo(
    () =>
      Array.from({ length: Math.round(count * effectScale()) }).map((_, i) => ({
        key: i,
        left: rand(-5, 105),
        w: rand(8, 16),
        dur: rand(9, 17),
        delay: -rand(0, 16),
        dx: rand(-120, 120),
        rot: rand(300, 900),
        color: pick(COLORS),
      })),
    [count]
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.key}
          className="absolute top-0 animate-petalFall will-change-transform"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.w * 1.5,
            background: `radial-gradient(ellipse at 40% 30%, #fff3 0%, ${p.color} 55%, ${p.color}cc 100%)`,
            borderRadius: '60% 40% 60% 40% / 70% 60% 40% 30%',
            '--dur': `${p.dur}s`,
            '--dx': `${p.dx}px`,
            '--rot': `${p.rot}deg`,
            animationDelay: `${p.delay}s`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}

export default memo(PetalFall);
