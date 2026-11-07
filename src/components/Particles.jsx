import { memo, useMemo } from 'react';
import { effectScale, rand } from '../lib/device';

/** Floating golden embers – pure CSS animation, transform + opacity only. */
function Particles({ count = 40, colors = ['#ffd56a', '#ffb02e', '#ff8a1f', '#fff1b8'], className = '' }) {
  const items = useMemo(() => {
    const n = Math.round(count * effectScale());
    return Array.from({ length: n }).map((_, i) => ({
      key: i,
      left: rand(0, 100),
      size: rand(2, 6),
      dur: rand(9, 20),
      delay: -rand(0, 20),
      dx: rand(-60, 60),
      color: colors[i % colors.length],
    }));
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((p) => (
        <span
          key={p.key}
          className="absolute bottom-[-12px] rounded-full animate-floatUp will-change-transform"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.size}px ${p.color}66`,
            '--dur': `${p.dur}s`,
            '--dx': `${p.dx}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default memo(Particles);
