import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './scenes/LoadingScreen';
import Opening from './scenes/Opening';
import DiyaScene from './scenes/DiyaScene';
import RangoliScene from './scenes/RangoliScene';
import FireworksScene from './scenes/FireworksScene';
import Finale from './scenes/Finale';
import SoundControls from './components/SoundControls';
import * as audio from './lib/audio';

const ORDER = ['loading', 'open', 'diyas', 'rangoli', 'fireworks', 'finale'];

const variants = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.45, ease: 'easeIn' } },
};

export default function App() {
  const [scene, setScene] = useState('loading');
  const [run, setRun] = useState(0);

  const goTo = useCallback((name, withSound = true) => {
    if (withSound) audio.whooshSoft();
    setScene(name);
  }, []);

  const next = useCallback(
    (from) => () => {
      const i = ORDER.indexOf(from);
      setScene((cur) => {
        // ignore stale timers firing after the scene has already changed
        if (cur !== from) return cur;
        if (i >= 0 && i < ORDER.length - 1) {
          audio.whooshSoft();
          return ORDER[i + 1];
        }
        return cur;
      });
    },
    []
  );

  const replay = useCallback(() => {
    setRun((r) => r + 1);
    goTo('open');
  }, [goTo]);

  // stop the audio context from leaking when the page is closed
  useEffect(() => () => audio.setMusic(false), []);

  const showBrand = scene !== 'loading';

  let view = null;
  if (scene === 'loading') view = <LoadingScreen onDone={() => setScene('open')} />;
  if (scene === 'open') view = <Opening onNext={next('open')} />;
  if (scene === 'diyas') view = <DiyaScene onNext={next('diyas')} />;
  if (scene === 'rangoli') view = <RangoliScene onNext={next('rangoli')} />;
  if (scene === 'fireworks') view = <FireworksScene onNext={next('fireworks')} />;
  if (scene === 'finale') view = <Finale onReplay={replay} />;

  return (
    <div className="app-root relative w-full overflow-hidden bg-night">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={`${scene}-${run}`} className="absolute inset-0" variants={variants} initial="initial" animate="animate" exit="exit">
          {view}
        </motion.div>
      </AnimatePresence>

      {/* golden light-burst that covers every scene change */}
      <AnimatePresence>
        <motion.div
          key={`flash-${scene}-${run}`}
          className="pointer-events-none absolute inset-0 z-40"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,226,140,0.95) 0%, rgba(255,150,40,0.6) 35%, rgba(255,100,20,0) 70%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.05, times: [0, 0.38, 1], ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {showBrand && <SoundControls />}
    </div>
  );
}
