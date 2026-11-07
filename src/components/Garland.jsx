import Marigold from './Marigold';

/** Hanging marigold toran (door garland) that spans the top of a scene. */
export default function Garland({ count = 9, className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-[58px] flex justify-between px-1 ${className}`} aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-diya/70 to-transparent" />
      {Array.from({ length: count }).map((_, i) => {
        const drop = 8 + Math.sin((i / (count - 1)) * Math.PI) * 26;
        const hue = i % 3 === 0 ? 'yellow' : i % 3 === 1 ? 'orange' : 'deep';
        return (
          <div key={i} className="flex flex-col items-center origin-top animate-sway" style={{ animationDelay: `${i * 0.25}s`, animationDuration: `${4 + (i % 3)}s` }}>
            <div className="w-px bg-gradient-to-b from-diya/70 to-diya/10" style={{ height: drop }} />
            <Marigold size={34} hue={hue} />
            <Marigold size={26} hue={hue === 'deep' ? 'orange' : 'deep'} className="-mt-3" />
            <Marigold size={18} hue="yellow" className="-mt-2" />
          </div>
        );
      })}
    </div>
  );
}
