import { memo, useMemo } from 'react';
import { seeded } from '../lib/lights';

/** Dark temple / rooftop silhouette with a few warm windows – grounds the night sky. */
function Skyline({ className = '' }) {
  const dots = useMemo(() => {
    const rnd = seeded(5);
    return Array.from({ length: 34 }).map((_, i) => ({
      x: 30 + rnd() * 940,
      y: 112 + rnd() * 58,
      d: -rnd() * 3,
      k: i,
    }));
  }, []);
  return (
    <svg viewBox="0 0 1000 180" preserveAspectRatio="xMidYMax slice" className={`w-full ${className}`} aria-hidden="true">
      <path
        d="M0 180 V138 H40 V120 H70 V138 H120 V104 C120 90 134 82 140 70 C146 82 160 90 160 104 V138 H210 V118 H250 V138 H300 V96 H306 V84 H312 V96 H318 V138 H380 V110 H430 V138
           H470 V92 C470 66 492 50 500 34 C508 50 530 66 530 92 V138 H570 V110 H620 V138 H682 V96 H688 V84 H694 V96 H700 V138 H750 V118 H790 V138 H840 V104 C840 90 854 82 860 70 C866 82 880 90 880 104 V138 H930 V120 H960 V138 H1000 V180 Z"
        fill="#070412"
      />
      <rect x="0" y="150" width="1000" height="30" fill="#05030d" />
      {dots.map((d) => (
        <rect key={d.k} x={d.x} y={d.y} width="4" height="6" rx="1" fill="#ffc45a" className="light-blink" style={{ animationDelay: `${d.d}s` }} opacity="0.85" />
      ))}
    </svg>
  );
}

export default memo(Skyline);
