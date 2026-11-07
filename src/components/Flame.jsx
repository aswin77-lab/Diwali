import useUid from '../hooks/useUid';

/**
 * Realistic layered diya flame. Pure SVG + CSS keyframes (transform / opacity only,
 * so it stays smooth on phones). Parent controls position; `size` is the flame height.
 */
export default function Flame({ size = 60, intensity = 1 }) {
  const id = useUid();
  const w = size * 0.62;
  return (
    <div
      className="relative pointer-events-none"
      style={{ width: w, height: size }}
      aria-hidden="true"
    >
      {/* soft halo */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full animate-pulseGlow"
        style={{
          width: size * 2.6 * intensity,
          height: size * 2.6 * intensity,
          marginLeft: -(size * 1.3 * intensity),
          marginTop: -(size * 1.15 * intensity),
          background:
            'radial-gradient(circle, rgba(255,190,70,0.55) 0%, rgba(255,120,20,0.22) 38%, rgba(255,90,20,0) 70%)',
        }}
      />
      <svg
        viewBox="0 0 40 64"
        className="absolute inset-0 w-full h-full animate-flicker"
        style={{ transformOrigin: '50% 100%' }}
      >
        <defs>
          <linearGradient id={`o${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ff4d12" />
            <stop offset="0.45" stopColor="#ff8a1f" />
            <stop offset="1" stopColor="#ffd45a" />
          </linearGradient>
          <linearGradient id={`i${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffb02e" />
            <stop offset="0.6" stopColor="#ffe48a" />
            <stop offset="1" stopColor="#fffbe8" />
          </linearGradient>
          <radialGradient id={`b${id}`} cx="0.5" cy="0.85" r="0.5">
            <stop offset="0" stopColor="#6fa8ff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#6fa8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M20 1 C25 15 36 25 34 42 C33 54 27 62 20 62 C13 62 7 54 6 42 C4 25 15 15 20 1 Z"
          fill={`url(#o${id})`}
        />
        <path
          d="M20 16 C24 26 30 32 28.5 44 C27.5 52 24 58 20 58 C16 58 12.5 52 11.5 44 C10 32 16 26 20 16 Z"
          fill={`url(#i${id})`}
        />
        <ellipse cx="20" cy="56" rx="7" ry="8" fill={`url(#b${id})`} />
      </svg>
    </div>
  );
}
