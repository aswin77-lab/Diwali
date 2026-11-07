import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Link2, MessageCircle, RotateCcw, UserPen } from 'lucide-react';
import Diya from '../components/Diya';
import FireworksCanvas from '../components/FireworksCanvas';
import Palace from '../components/Palace';
import Particles from '../components/Particles';
import PetalFall from '../components/PetalFall';
import Stars from '../components/Stars';
import useGreeting from '../hooks/useGreeting';
import useViewport from '../hooks/useViewport';
import * as audio from '../lib/audio';
import { buildLink, copyText, whatsappHref } from '../lib/share';
import { BRAND, FINALE } from '../config';

const fade = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1.1, ease: 'easeOut' },
});

function Word({ text, start }) {
  return (
    <span className="inline-flex">
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="gold-text-nf inline-block font-display font-black"
          initial={{ opacity: 0, y: 50, scale: 0.4, rotate: -10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{ delay: start + i * 0.08, type: 'spring', stiffness: 160, damping: 11 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Finale({ onReplay }) {
  const { from, to } = useGreeting();
  const vp = useViewport();
  const fw = useRef(null);
  const [showShare, setShowShare] = useState(false);
  const [panel, setPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fromName, setFromName] = useState(from);
  const [toName, setToName] = useState(to);
  const timers = useRef([]);

  const link = useMemo(() => buildLink(fromName, toName), [fromName, toName]);

  useEffect(() => {
    const t = timers.current;
    t.push(setTimeout(() => audio.finaleFanfare(), 500));
    t.push(setTimeout(() => fw.current?.volley(7), 700));
    t.push(setTimeout(() => fw.current?.volley(9), 3000));
    t.push(setTimeout(() => setShowShare(true), 6200));
    return () => t.forEach(clearTimeout);
  }, []);

  const small = vp.w < 640;
  const stripH = small ? 128 : 88;
  const palaceH = Math.min(Math.min(vp.w, 1100) * 0.43, vp.h * 0.26);
  const diyaW = Math.round(Math.max(34, Math.min(58, vp.w / 11)));
  const titleSize = `clamp(2.5rem, min(14vw, 10.5vh), 6.5rem)`;
  const bodySize = `clamp(0.82rem, min(3.6vw, 2.1vh), 1.12rem)`;

  const doCopy = async () => {
    audio.unlock();
    audio.tap();
    const ok = await copyText(link);
    setCopied(ok);
    if (ok) timers.current.push(setTimeout(() => setCopied(false), 2200));
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #03020e 0%, #0d0724 40%, #2a0a24 75%, #4a1026 100%)' }}
    >
      <Stars count={80} />
      <FireworksCanvas ref={fw} interactive sound volume={0.45} auto rate={1.5} yRange={[0.05, 0.36]} />
      <Particles count={30} />
      <PetalFall count={24} />

      {/* palace */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 mx-auto max-w-[1100px]"
        style={{ bottom: stripH, maxHeight: '26vh' }}
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        <Palace />
      </motion.div>

      {/* glowing diyas */}
      <div className="pointer-events-none absolute inset-x-0 flex items-end justify-evenly px-2" style={{ bottom: stripH + 2 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.3, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.12, type: 'spring', damping: 12 }}
          >
            <Diya variant="clay" lit width={diyaW} flameScale={0.9} />
          </motion.div>
        ))}
      </div>

      {/* ground strip behind the share buttons */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ height: stripH, background: 'linear-gradient(180deg, rgba(8,4,18,0.15) 0%, #080412 38%)' }}
      />

      {/* message */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center justify-center px-5 text-center"
        style={{ top: 52, bottom: stripH + palaceH * 0.88 }}
      >
        {to && (
          <motion.p {...fade(0.3)} className="mb-2 font-display text-xs uppercase tracking-[0.3em] text-cream text-glow sm:text-sm">
            Specially for {to}
          </motion.p>
        )}

        <h1
          className="flex flex-col items-center leading-[1.02] md:flex-row md:gap-6"
          style={{ fontSize: titleSize, filter: 'drop-shadow(0 4px 18px rgba(255,140,30,0.55))' }}
          aria-label={FINALE.title}
        >
          <Word text="HAPPY" start={0.8} />
          <Word text="DIWALI!" start={1.5} />
        </h1>

        <motion.p {...fade(2.7)} className="mt-4 max-w-xl text-cream/95 text-glow" style={{ fontSize: bodySize, lineHeight: 1.55 }}>
          {FINALE.line1}
        </motion.p>
        <motion.p {...fade(4.2)} className="mt-2 max-w-xl text-cream/85 text-glow" style={{ fontSize: bodySize, lineHeight: 1.55 }}>
          {FINALE.line2}
        </motion.p>

        <motion.div {...fade(5.7)} className="mt-3">
          <p className="font-script whitespace-nowrap" style={{ fontSize: 'clamp(1.6rem, min(6.4vw, 5vh), 3rem)' }}>
            <span className="gold-text">{FINALE.warm.replace('❤️', '').trim()}</span>{' '}
            <span aria-hidden="true" className="inline-block animate-pulseGlow !opacity-100 text-[0.8em]">❤️</span>
          </p>
          <p className="mt-0.5 font-display text-xs uppercase tracking-[0.25em] text-diya text-glow sm:text-sm">
            {from ? `With love, ${from}` : FINALE.generalFrom}
          </p>
        </motion.div>
      </div>

      {/* personalise panel */}
      <AnimatePresence>
        {panel && (
          <motion.div
            key="panel"
            className="absolute inset-x-0 z-30 mx-auto w-[min(92vw,420px)] rounded-3xl border border-diya/50 bg-night/95 p-4 text-left shadow-[0_0_50px_rgba(0,0,0,0.7)] backdrop-blur-md"
            style={{ bottom: stripH + 10 }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-diya">Make it personal</p>
            <label className="mb-1 block text-xs text-cream/70" htmlFor="from-name">Your name</label>
            <input id="from-name" className="input-gold mb-3" maxLength={30} value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="e.g. Aswin" autoComplete="given-name" />
            <label className="mb-1 block text-xs text-cream/70" htmlFor="to-name">Friend&apos;s name</label>
            <input id="to-name" className="input-gold" maxLength={30} value={toName} onChange={(e) => setToName(e.target.value)} placeholder="e.g. Priya" autoComplete="off" />
            <p className="mt-3 break-all text-[11px] leading-snug text-cream/50">{link}</p>
            <button type="button" className="btn-ghost mt-3 w-full" onClick={() => setPanel(false)}>
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* share actions */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            key="share"
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-3"
            style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', damping: 16 }}
          >
            <a
              className="btn-gold !min-h-[48px] w-full max-w-sm sm:w-auto"
              href={whatsappHref(link)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audio.unlock()}
            >
              <MessageCircle size={20} />
              Share on WhatsApp
            </a>
            <div className="flex w-full max-w-sm items-center justify-center gap-2">
              <button type="button" className="btn-ghost flex-1 !px-3" onClick={doCopy} aria-live="polite">
                {copied ? <Check size={18} className="text-lime" /> : <Link2 size={18} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                type="button"
                className="btn-ghost flex-1 !px-3"
                onClick={() => {
                  audio.unlock();
                  audio.whooshSoft();
                  onReplay();
                }}
              >
                <RotateCcw size={18} />
                Replay
              </button>
              <button
                type="button"
                className="btn-ghost !px-3"
                onClick={() => setPanel((p) => !p)}
                aria-label="Add names to your greeting link"
                aria-expanded={panel}
              >
                <UserPen size={18} />
              </button>
            </div>
            {!small && <p className="text-[11px] tracking-wider text-cream/40">© {new Date().getFullYear()} {BRAND.name}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
