import { memo, useMemo } from 'react';
import { bezier, line, swag, toLights } from '../lib/lights';
import { effectScale } from '../lib/device';
import useUid from '../hooks/useUid';

const archWin = (x, y, w, h) =>
  `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`;

/** Traditional Indian haveli decorated with festive lights – opening scene. */
function House({ className = '' }) {
  const id = useUid();
  const lights = useMemo(() => {
    const dome = bezier([330, 112], [330, 56], [382, 34], [400, 24], 10).concat(
      bezier([400, 24], [418, 34], [470, 56], [470, 112], 10)
    );
    const outlines = [
      line([190, 160], [610, 160], 34),
      line([262, 112], [538, 112], 22),
      dome,
      swag([190, 168], [400, 168], 16, 18),
      swag([400, 168], [610, 168], 16, 18),
      line([50, 212], [190, 212], 11),
      line([610, 212], [750, 212], 11),
      swag([50, 220], [190, 220], 10, 11),
      swag([610, 220], [750, 220], 10, 11),
    ];
    return toLights(outlines, 11, Math.min(1, effectScale() + 0.2));
  }, []);

  const windows = [];
  [235, 305, 475, 545].forEach((x) => windows.push({ x, y: 182, w: 30, h: 46 }));
  [235, 305, 475, 545].forEach((x) => windows.push({ x, y: 240, w: 30, h: 46 }));
  [278, 388, 498].forEach((x) => windows.push({ x, y: 120, w: 24, h: 30 }));
  [75, 125, 645, 695].forEach((x) => windows.push({ x, y: 236, w: 28, h: 46 }));

  return (
    <svg
      viewBox="0 0 800 330"
      preserveAspectRatio="xMidYMax meet"
      className={`w-full ${className}`}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`wall${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1230" />
          <stop offset="1" stopColor="#1c0818" />
        </linearGradient>
        <linearGradient id={`win${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0a8" />
          <stop offset="0.55" stopColor="#ffbe3a" />
          <stop offset="1" stopColor="#ff8a1a" />
        </linearGradient>
        <radialGradient id={`halo${id}`} cx="0.5" cy="0.6" r="0.55">
          <stop offset="0" stopColor="#ffa530" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffa530" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`dome${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a3a1a" />
          <stop offset="0.5" stopColor="#e8a33a" />
          <stop offset="1" stopColor="#7a3a1a" />
        </linearGradient>
      </defs>

      {/* big halo behind the house */}
      <ellipse cx="400" cy="230" rx="420" ry="170" fill={`url(#halo${id})`} />

      {/* ground */}
      <rect x="-200" y="298" width="1200" height="60" fill="#12051a" />
      <rect x="-200" y="296" width="1200" height="3" fill="#f5b83d" opacity="0.5" />

      {/* side wings */}
      <rect x="40" y="206" width="160" height="94" fill={`url(#wall${id})`} />
      <rect x="600" y="206" width="160" height="94" fill={`url(#wall${id})`} />
      <rect x="40" y="200" width="160" height="8" fill="#6a2a2a" />
      <rect x="600" y="200" width="160" height="8" fill="#6a2a2a" />

      {/* main building */}
      <rect x="196" y="154" width="408" height="146" fill={`url(#wall${id})`} />
      <rect x="190" y="152" width="420" height="10" fill="#7a2f34" />
      <rect x="262" y="108" width="276" height="48" fill={`url(#wall${id})`} />
      <rect x="258" y="104" width="284" height="8" fill="#7a2f34" />

      {/* chhatris on the corners */}
      {[214, 560].map((x) => (
        <g key={x}>
          <rect x={x} y="132" width="4" height="22" fill="#c98a2a" />
          <rect x={x + 22} y="132" width="4" height="22" fill="#c98a2a" />
          <path d={`M${x - 6} 132 C${x - 6} 112 ${x + 6} 106 ${x + 12} 98 C${x + 18} 106 ${x + 30} 112 ${x + 30} 132 Z`} fill={`url(#dome${id})`} />
          <circle cx={x + 12} cy="95" r="3" fill="#ffd56a" />
        </g>
      ))}

      {/* central dome + kalash */}
      <path d="M330 112 C330 56 382 34 400 24 C418 34 470 56 470 112 Z" fill={`url(#dome${id})`} />
      <rect x="397" y="8" width="6" height="18" fill="#ffd56a" />
      <ellipse cx="400" cy="8" rx="6" ry="9" fill="#ffd56a" />
      <circle cx="400" cy="-3" r="3" fill="#fff3b0" />

      {/* windows */}
      {windows.map((w, i) => (
        <g key={i}>
          <circle cx={w.x + w.w / 2} cy={w.y + w.h / 2} r={w.w * 1.2} fill="#ffa530" opacity="0.14" />
          <path d={archWin(w.x, w.y, w.w, w.h)} fill={`url(#win${id})`} stroke="#c98a2a" strokeWidth="2" />
          <path d={`M${w.x + w.w / 2} ${w.y + 4} V${w.y + w.h}`} stroke="#7a3a14" strokeWidth="1.4" />
          <path d={`M${w.x} ${w.y + w.h * 0.55} H${w.x + w.w}`} stroke="#7a3a14" strokeWidth="1.4" />
        </g>
      ))}

      {/* grand door */}
      <path d={archWin(370, 224, 60, 76)} fill={`url(#win${id})`} stroke="#e8a33a" strokeWidth="3" />
      <path d="M400 232 V300 M370 266 H430" stroke="#7a3a14" strokeWidth="2" />
      <circle cx="400" cy="262" r="26" fill="#ffa530" opacity="0.15" />

      {/* steps */}
      <rect x="352" y="296" width="96" height="4" fill="#c98a2a" opacity="0.8" />

      {/* hanging festive lights */}
      {lights.map((l) => (
        <circle
          key={l.k}
          cx={l.x}
          cy={l.y}
          r={l.r}
          fill={l.c}
          className={l.blink ? 'light-blink' : ''}
          style={l.blink ? { animationDelay: `${l.delay}s`, animationDuration: `${l.dur}s` } : undefined}
        />
      ))}
    </svg>
  );
}

export default memo(House);
