import useUid from '../hooks/useUid';

/** Layered marigold (genda phool) – used in garlands, rangoli and falling petals. */
export default function Marigold({ size = 60, hue = 'orange', className = '', style }) {
  const id = useUid();
  const colors =
    hue === 'yellow'
      ? ['#ffe066', '#ffc21a', '#e59500']
      : hue === 'deep'
      ? ['#ffb347', '#ff7a00', '#c24a00']
      : ['#ffcf5a', '#ff9a1a', '#d96a00'];
  const rings = [
    { n: 14, r: 40, pw: 15, ph: 30, c: colors[2] },
    { n: 12, r: 32, pw: 14, ph: 26, c: colors[1] },
    { n: 10, r: 23, pw: 12, ph: 21, c: colors[0] },
    { n: 8, r: 14, pw: 10, ph: 16, c: colors[1] },
  ];
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id={`c${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8a3d00" />
          <stop offset="1" stopColor="#d96a00" />
        </radialGradient>
      </defs>
      {rings.map((ring, ri) =>
        Array.from({ length: ring.n }).map((_, i) => {
          const a = (360 / ring.n) * i + (ri % 2 ? 360 / ring.n / 2 : 0);
          return (
            <ellipse
              key={`${ri}-${i}`}
              cx="0"
              cy={-ring.r + ring.ph / 2}
              rx={ring.pw / 2}
              ry={ring.ph / 2}
              fill={ring.c}
              stroke="rgba(120,50,0,0.35)"
              strokeWidth="0.6"
              transform={`rotate(${a})`}
            />
          );
        })
      )}
      <circle r="7" fill={`url(#c${id})`} />
    </svg>
  );
}
