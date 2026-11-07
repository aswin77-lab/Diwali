import { motion } from 'framer-motion';
import Flame from './Flame';
import useUid from '../hooks/useUid';

const PALETTES = {
  clay: {
    top: '#e0763a',
    mid: '#b5481f',
    bottom: '#7a2a10',
    rim: '#f0a060',
    trim: '#f7c948',
  },
  brass: {
    top: '#ffe8a3',
    mid: '#e8a722',
    bottom: '#8a5a08',
    rim: '#fff3c4',
    trim: '#fff6d6',
  },
};

/**
 * Traditional oil lamp. `variant="clay"` is the hand-painted terracotta diya,
 * `variant="brass"` is the ornate hero diya on the opening screen.
 */
export default function Diya({ lit = false, variant = 'clay', width = 140, className = '', flameScale = 1 }) {
  const id = useUid();
  const p = PALETTES[variant];
  const h = width * 0.62;
  const flameH = width * 0.5 * flameScale;

  return (
    <div className={`relative ${className}`} style={{ width, height: h + flameH * 0.7 }}>
      {/* warm light pool under a lit diya */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: '50%',
          bottom: -width * 0.1,
          width: width * 2.2,
          height: width * 0.9,
          marginLeft: -width * 1.1,
          background: 'radial-gradient(ellipse, rgba(255,170,50,0.55) 0%, rgba(255,120,20,0.18) 45%, rgba(255,100,20,0) 70%)',
        }}
        initial={false}
        animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : 0.3 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* flame */}
      <motion.div
        className="absolute"
        style={{ left: width * 0.143 - flameH * 0.31, bottom: h * 0.84, transformOrigin: '50% 100%' }}
        initial={false}
        animate={{ scale: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        <Flame size={flameH} />
      </motion.div>

      <svg
        viewBox="0 0 140 87"
        width={width}
        height={h}
        className="absolute bottom-0 left-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.top} />
            <stop offset="0.45" stopColor={p.mid} />
            <stop offset="1" stopColor={p.bottom} />
          </linearGradient>
          <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.28" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.14" />
            <stop offset="1" stopColor="#000" stopOpacity="0.32" />
          </linearGradient>
          <radialGradient id={`o${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={lit ? '#ffcf63' : '#5a2a10'} />
            <stop offset="1" stopColor={lit ? '#e08a1d' : '#2a1006'} />
          </radialGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx="74" cy="84" rx="48" ry="4" fill="#000" opacity="0.35" />

        {/* bowl */}
        <path
          d="M6 14 C16 16 22 22 26 30 C30 56 46 82 74 82 C102 82 118 56 122 30 C124 22 108 18 74 18 C54 18 40 20 28 22 C22 17 14 14 6 14 Z"
          fill={`url(#g${id})`}
        />
        <path
          d="M6 14 C16 16 22 22 26 30 C30 56 46 82 74 82 C102 82 118 56 122 30 C124 22 108 18 74 18 C54 18 40 20 28 22 C22 17 14 14 6 14 Z"
          fill={`url(#s${id})`}
        />

        {/* decorative band */}
        <path d="M30 40 C50 50 98 50 118 40" fill="none" stroke={p.trim} strokeWidth="2.2" strokeLinecap="round" opacity="0.95" />
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 38 + i * 9;
          const y = 45 + Math.sin((i / 8) * Math.PI) * 3.4;
          return <circle key={i} cx={x} cy={y} r="1.7" fill={p.trim} />;
        })}
        <path d="M44 56 C60 66 88 66 104 56" fill="none" stroke={p.trim} strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${54 + i * 11} 66 q 2 -6 5 0 q -2.5 3 -5 0 Z`}
            fill={p.trim}
            opacity="0.85"
          />
        ))}

        {/* oil pool + rim */}
        <ellipse cx="72" cy="20" rx="50" ry="7" fill={`url(#o${id})`} />
        <path d="M24 21 C40 14 106 14 122 21" fill="none" stroke={p.rim} strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />

        {/* wick */}
        <path d="M17 14 C19 9 22 9 23 14" fill="none" stroke={lit ? '#2a1405' : '#3a2412'} strokeWidth="3" strokeLinecap="round" />
        {lit && <circle cx="20" cy="12" r="2.4" fill="#ffd45a" />}
      </svg>
    </div>
  );
}
