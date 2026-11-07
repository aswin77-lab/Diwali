import useUid from '../hooks/useUid';

/**
 * Paper / brass lantern. `hanging` swings from a string,
 * otherwise it is a free-floating sky lantern.
 */
export default function Lantern({ size = 54, color = 'red', hanging = true, stringLength = 60, className = '', style }) {
  const id = useUid();
  const pal =
    color === 'gold'
      ? ['#ffe08a', '#f5a623', '#a8650a']
      : color === 'orange'
      ? ['#ffb066', '#ff6a1a', '#a8300a']
      : ['#ff6a6a', '#c4162f', '#6e0a1c'];
  return (
    <div
      className={`flex flex-col items-center ${hanging ? 'origin-top animate-sway' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {hanging && <div className="w-px bg-gradient-to-b from-diya/80 to-diya/20" style={{ height: stringLength }} />}
      <svg viewBox="0 0 60 84" width={size} height={size * 1.4} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id={`l${id}`} cx="0.5" cy="0.55" r="0.55">
            <stop offset="0" stopColor="#fff2b8" />
            <stop offset="0.35" stopColor={pal[0]} />
            <stop offset="0.8" stopColor={pal[1]} />
            <stop offset="1" stopColor={pal[2]} />
          </radialGradient>
          <radialGradient id={`h${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffb347" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="30" cy="44" r="46" fill={`url(#h${id})`} className="animate-pulseGlow" />
        {/* caps */}
        <rect x="19" y="4" width="22" height="7" rx="2.5" fill="#d9a03a" />
        <rect x="23" y="0" width="14" height="5" rx="2" fill="#f2c566" />
        {/* body */}
        <path d="M18 11 C2 22 2 62 18 73 L42 73 C58 62 58 22 42 11 Z" fill={`url(#l${id})`} />
        {/* ribs */}
        <path d="M30 11 L30 73 M22 12 C10 28 10 56 22 73 M38 12 C50 28 50 56 38 73" stroke="rgba(110,10,28,0.55)" strokeWidth="1.2" fill="none" />
        <path d="M6 30 C20 35 40 35 54 30 M5 46 C20 52 40 52 55 46" stroke="rgba(255,225,140,0.7)" strokeWidth="1" fill="none" />
        {/* bottom */}
        <rect x="19" y="73" width="22" height="6" rx="2.5" fill="#d9a03a" />
        <path d="M30 79 L30 84 M26 79 L25 84 M34 79 L35 84" stroke="#f2c566" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
