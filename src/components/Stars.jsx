import { memo, useMemo } from 'react';
import { effectScale, rand } from '../lib/device';

/** Twinkling night-sky stars. */
function Stars({ count = 70, className = '' }) {
  const stars = useMemo(
    () =>
      Array.from({ length: Math.round(count * effectScale()) }).map((_, i) => ({
        key: i,
        left: rand(0, 100),
        top: rand(0, 70),
        size: rand(1, 2.8),
        delay: -rand(0, 4),
        dur: rand(2, 5),
      })),
    [count]
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.key}
          className="absolute rounded-full bg-cream animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: '0 0 6px 1px rgba(255,244,220,0.6)',
          }}
        />
      ))}
    </div>
  );
}

export default memo(Stars);
