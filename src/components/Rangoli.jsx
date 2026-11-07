import { motion } from 'framer-motion';
import Marigold from './Marigold';

const C = {
  magenta: '#d6246e',
  rose: '#ff8fb3',
  orange: '#ff8a1f',
  yellow: '#ffc21a',
  blue: '#1b2a8a',
  teal: '#17b8b0',
  green: '#2fa84f',
  lime: '#9be37a',
  white: '#fff4dc',
  purple: '#7a2fb0',
  red: '#e0213a',
};

const petal = (w, h) => `M0 0 C ${w} ${-h * 0.3} ${w} ${-h * 0.8} 0 ${-h} C ${-w} ${-h * 0.8} ${-w} ${-h * 0.3} 0 0 Z`;

function PetalRing({ n, r0, len, w, fill, inner, dot, offset = 0, alt }) {
  return Array.from({ length: n }).map((_, i) => {
    const a = (360 / n) * i + offset;
    const f = alt && i % 2 ? alt : fill;
    return (
      <g key={i} transform={`rotate(${a}) translate(0 ${-r0})`}>
        <path d={petal(w, len)} fill={f} stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
        {inner && <path d={petal(w * 0.52, len * 0.62)} fill={inner} transform={`translate(0 ${-len * 0.06})`} />}
        {dot && <circle cy={-len * 1.08} r={Math.max(1.4, w * 0.15)} fill={dot} />}
      </g>
    );
  });
}

const starPath = (pts, outer, innerR) => {
  const d = [];
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? outer : innerR;
    const a = -Math.PI / 2 + (Math.PI * i) / pts;
    d.push(`${i === 0 ? 'M' : 'L'}${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return d.join(' ') + ' Z';
};

function Scallops({ n, r, size, a, b }) {
  return Array.from({ length: n }).map((_, i) => {
    const ang = (360 / n) * i;
    const half = Math.PI / n;
    const rad = (ang * Math.PI) / 180;
    const x1 = Math.sin(rad - half) * r;
    const y1 = -Math.cos(rad - half) * r;
    const x2 = Math.sin(rad + half) * r;
    const y2 = -Math.cos(rad + half) * r;
    const cx = Math.sin(rad) * (r + size);
    const cy = -Math.cos(rad) * (r + size);
    return (
      <g key={i}>
        <path d={`M${x1} ${y1} Q ${cx * 1.0} ${cy * 1.0} ${x2} ${y2} Z`} fill={i % 2 ? a : b} stroke="rgba(255,255,255,0.4)" strokeWidth="0.9" />
        <circle cx={Math.sin(rad) * (r + size * 0.42)} cy={-Math.cos(rad) * (r + size * 0.42)} r="2.4" fill={C.white} />
      </g>
    );
  });
}

function DotRing({ n, r, size, color }) {
  return Array.from({ length: n }).map((_, i) => {
    const a = (Math.PI * 2 * i) / n;
    return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={size} fill={color} />;
  });
}

/** One ring of the rangoli: blooms in from the centre with a small spin. */
function Layer({ delay, children, spin = -25 }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.15, rotate: spin }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.g>
  );
}

/** Large, procedurally drawn rangoli in vivid powder colours. */
export default function Rangoli({ size = 360 }) {
  const mari = Array.from({ length: 12 }).map((_, i) => {
    const a = (Math.PI * 2 * i) / 12;
    return { x: Math.sin(a) * 184, y: -Math.cos(a) * 184, hue: i % 3 === 0 ? 'yellow' : i % 3 === 1 ? 'orange' : 'deep', i };
  });

  return (
    <svg viewBox="-200 -200 400 400" width={size} height={size} role="img" aria-label="Colourful rangoli" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="rg-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5a1030" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3a0a1c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="200" fill="url(#rg-floor)" />

      <Layer delay={2.3} spin={20}>
        <Scallops n={24} r={158} size={24} a={C.orange} b={C.purple} />
      </Layer>

      <Layer delay={0.9} spin={-40}>
        <path d={starPath(8, 104, 70)} fill={C.blue} stroke={C.yellow} strokeWidth="2" />
        <path d={starPath(8, 82, 54)} fill={C.teal} stroke={C.white} strokeWidth="1" transform="rotate(22.5)" />
      </Layer>

      <Layer delay={1.5} spin={30}>
        <DotRing n={32} r={110} size={2.4} color={C.white} />
      </Layer>

      <Layer delay={1.7} spin={-30}>
        <PetalRing n={12} r0={104} len={32} w={11} fill={C.green} inner={C.lime} offset={15} />
      </Layer>

      <Layer delay={1.9} spin={25}>
        <PetalRing n={12} r0={102} len={52} w={20} fill={C.red} inner={C.yellow} dot={C.white} />
      </Layer>

      <Layer delay={1.2} spin={-35}>
        <PetalRing n={16} r0={58} len={30} w={9} fill={C.yellow} alt={C.orange} inner={C.white} />
      </Layer>

      <Layer delay={0.5} spin={45}>
        <PetalRing n={8} r0={8} len={58} w={19} fill={C.magenta} inner={C.rose} dot={C.white} offset={22.5} />
        <PetalRing n={8} r0={8} len={44} w={14} fill={C.purple} inner={C.rose} />
      </Layer>

      <Layer delay={0.2} spin={0}>
        <circle r="17" fill={C.yellow} stroke={C.white} strokeWidth="1.5" />
        <circle r="8" fill={C.orange} />
        <circle r="3" fill={C.white} />
      </Layer>

      {mari.map((m) => (
        <motion.g
          key={m.i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8 + m.i * 0.07, type: 'spring', stiffness: 220, damping: 14 }}
        >
          <g transform={`translate(${m.x - 16} ${m.y - 16})`}>
            <Marigold size={32} hue={m.hue} />
          </g>
        </motion.g>
      ))}
    </svg>
  );
}
