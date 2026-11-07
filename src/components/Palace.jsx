import { memo, useMemo } from 'react';
import { arch, bezier, line, swag, toLights } from '../lib/lights';
import { effectScale } from '../lib/device';
import useUid from '../hooks/useUid';

const archPath = (cx, baseY, hw, h) => {
  const spring = baseY - h + hw;
  return `M${cx - hw} ${baseY} V${spring} C${cx - hw} ${spring - hw * 1.1} ${cx} ${spring - hw * 1.2} ${cx} ${spring - hw * 1.35} C${cx} ${spring - hw * 1.2} ${cx + hw} ${spring - hw * 1.1} ${cx + hw} ${spring} V${baseY} Z`;
};

const domeOutline = (cx, baseY, hw, h) =>
  bezier([cx - hw, baseY], [cx - hw, baseY - h * 0.55], [cx - hw * 0.35, baseY - h * 0.9], [cx, baseY - h], 12).concat(
    bezier([cx, baseY - h], [cx + hw * 0.35, baseY - h * 0.9], [cx + hw, baseY - h * 0.55], [cx + hw, baseY], 12)
  );

const domePath = (cx, baseY, hw, h) =>
  `M${cx - hw} ${baseY} C${cx - hw} ${baseY - h * 0.55} ${cx - hw * 0.35} ${baseY - h * 0.9} ${cx} ${baseY - h} C${cx + hw * 0.35} ${baseY - h * 0.9} ${cx + hw} ${baseY - h * 0.55} ${cx + hw} ${baseY} Z`;

/** Illuminated Rajput-style palace with hundreds of lights – grand finale scene. */
function Palace({ className = '' }) {
  const id = useUid();

  const { lights, windows } = useMemo(() => {
    const thin = Math.min(1, effectScale() + 0.25);
    const outlines = [];

    // roof lines
    outlines.push(line([110, 250], [890, 250], 58));
    outlines.push(line([205, 196], [795, 196], 44));
    outlines.push(line([405, 128], [595, 128], 14));
    // main dome + finial
    outlines.push(domeOutline(500, 128, 78, 112));
    // flanking domes
    [[262, 196], [338, 196], [662, 196], [738, 196]].forEach(([x, y]) => outlines.push(domeOutline(x, y, 24, 40)));
    [[142, 250], [858, 250]].forEach(([x, y]) => outlines.push(domeOutline(x, y, 34, 58)));
    // tower edges
    outlines.push(line([108, 250], [108, 398], 14));
    outlines.push(line([176, 250], [176, 398], 14));
    outlines.push(line([824, 250], [824, 398], 14));
    outlines.push(line([892, 250], [892, 398], 14));
    // central portal edges + great arch
    outlines.push(line([405, 128], [405, 250], 8));
    outlines.push(line([595, 128], [595, 250], 8));
    outlines.push(arch(500, 398, 44, 140, 14));
    // swags across the facade
    outlines.push(swag([176, 262], [405, 262], 14, 22));
    outlines.push(swag([595, 262], [824, 262], 14, 22));
    // arched window outlines
    const wins = [];
    [230, 290, 350, 650, 710, 770].forEach((x) => {
      outlines.push(arch(x, 376, 17, 62, 6));
      wins.push({ x, base: 376, hw: 17, h: 62 });
    });
    [235, 300, 700, 765].forEach((x) => {
      outlines.push(arch(x, 232, 12, 30, 5));
      wins.push({ x, base: 232, hw: 12, h: 30 });
    });
    [470, 500, 530].forEach((x) => wins.push({ x, base: 176, hw: 9, h: 34 }));
    return { lights: toLights(outlines, 23, thin), windows: wins };
  }, []);

  return (
    <svg
      viewBox="0 0 1000 430"
      preserveAspectRatio="xMidYMax meet"
      className={`w-full ${className}`}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`wall${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a1838" />
          <stop offset="1" stopColor="#1d0819" />
        </linearGradient>
        <linearGradient id={`win${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2b0" />
          <stop offset="0.6" stopColor="#ffbe3a" />
          <stop offset="1" stopColor="#ff8a1a" />
        </linearGradient>
        <linearGradient id={`dome${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a3a1a" />
          <stop offset="0.5" stopColor="#f2b84a" />
          <stop offset="1" stopColor="#7a3a1a" />
        </linearGradient>
        <radialGradient id={`halo${id}`} cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#ffa530" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#ff7a1a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="500" cy="270" rx="560" ry="230" fill={`url(#halo${id})`} />

      {/* base wall + platform */}
      <rect x="-100" y="396" width="1200" height="60" fill="#12051a" />
      <rect x="-100" y="395" width="1200" height="3" fill="#f5b83d" opacity="0.55" />
      <rect x="110" y="250" width="780" height="148" fill={`url(#wall${id})`} />
      <rect x="104" y="246" width="792" height="8" fill="#8a3238" />
      <rect x="205" y="196" width="590" height="56" fill={`url(#wall${id})`} />
      <rect x="200" y="192" width="600" height="8" fill="#8a3238" />
      <rect x="405" y="128" width="190" height="124" fill={`url(#wall${id})`} />
      <rect x="400" y="124" width="200" height="8" fill="#8a3238" />

      {/* corner towers */}
      {[[108, 68], [824, 68]].map(([x, w]) => (
        <g key={x}>
          <rect x={x} y="250" width={w} height="148" fill={`url(#wall${id})`} stroke="#8a3238" strokeWidth="2" />
          <path d={domePath(x + w / 2, 250, 34, 58)} fill={`url(#dome${id})`} />
          <rect x={x + w / 2 - 2} y="176" width="4" height="16" fill="#ffd56a" />
          <circle cx={x + w / 2} cy="173" r="4" fill="#fff3b0" />
        </g>
      ))}

      {/* flanking chhatri domes */}
      {[262, 338, 662, 738].map((x) => (
        <g key={x}>
          <rect x={x - 20} y="172" width="4" height="24" fill="#c98a2a" />
          <rect x={x + 16} y="172" width="4" height="24" fill="#c98a2a" />
          <path d={domePath(x, 172, 24, 40)} fill={`url(#dome${id})`} />
          <circle cx={x} cy="129" r="3" fill="#ffd56a" />
        </g>
      ))}

      {/* central dome */}
      <path d={domePath(500, 128, 78, 112)} fill={`url(#dome${id})`} />
      <rect x="497" y="2" width="6" height="26" fill="#ffd56a" />
      <ellipse cx="500" cy="4" rx="7" ry="10" fill="#ffd56a" />
      <circle cx="500" cy="-9" r="3.4" fill="#fff3b0" />

      {/* grand arch / entrance */}
      <path d={archPath(500, 398, 44, 140)} fill={`url(#win${id})`} stroke="#e8a33a" strokeWidth="3" />
      <path d="M500 258 V398 M456 340 H544" stroke="#7a3a14" strokeWidth="2.2" />
      <circle cx="500" cy="340" r="60" fill="#ffa530" opacity="0.14" />

      {/* arched windows */}
      {windows.map((w, i) => (
        <g key={i}>
          <circle cx={w.x} cy={w.base - w.h / 2} r={w.hw * 1.7} fill="#ffa530" opacity="0.13" />
          <path d={archPath(w.x, w.base, w.hw, w.h)} fill={`url(#win${id})`} stroke="#c98a2a" strokeWidth="1.8" />
          <path d={`M${w.x} ${w.base - w.h + 6} V${w.base}`} stroke="#7a3a14" strokeWidth="1.2" />
        </g>
      ))}

      {/* hundreds of lights */}
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

export default memo(Palace);
