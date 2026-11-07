/**
 * Procedural audio engine (Web Audio API).
 * Everything is synthesised in the browser – no audio files to download,
 * nothing autoplays: the AudioContext is only created after a user gesture.
 */

let ctx = null;
let master = null;
let musicBus = null;
let sfxBus = null;
let noiseBuf = null;
let timer = null;
let nextTime = 0;
let stepIndex = 0;
let degree = 4;
let activeVoices = 0;

const state = { ready: false, musicOn: false, muted: false };
const listeners = new Set();
const emit = () => listeners.forEach((l) => l({ ...state }));

export const subscribe = (fn) => {
  listeners.add(fn);
  fn({ ...state });
  return () => listeners.delete(fn);
};
export const getState = () => ({ ...state });

/* ---------- raga Bhoopali (Sa Re Ga Pa Dha) in D ---------- */
const SA = 146.83;
const RATIOS = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3];
const noteFreq = (deg) => {
  const oct = Math.floor(deg / 5);
  const idx = ((deg % 5) + 5) % 5;
  return SA * 2 * RATIOS[idx] * Math.pow(2, oct);
};

/* ---------- setup ---------- */
function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = state.muted ? 0 : 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;
  master.connect(comp).connect(ctx.destination);

  // gentle shared reverb (generated impulse)
  const convolver = ctx.createConvolver();
  convolver.buffer = makeImpulse(2.4, 2.6);
  const wet = ctx.createGain();
  wet.gain.value = 0.28;
  convolver.connect(wet).connect(master);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);
  musicBus.connect(convolver);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.9;
  sfxBus.connect(master);
  sfxBus.connect(convolver);

  const len = ctx.sampleRate * 2;
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (!state.muted) ctx.resume();
  });
  return ctx;
}

function makeImpulse(seconds, decay) {
  const rate = ctx.sampleRate;
  const len = rate * seconds;
  const buf = ctx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

/** Call from a click / touch handler. Safe to call many times. */
export function unlock() {
  const c = ensureContext();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  if (!state.ready) {
    state.ready = true;
    emit();
  }
}

/* ---------- voices ---------- */
function envGain(t, peak, attack, decay) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return g;
}

function pluck(freq, t, vol = 0.12, decay = 1.8, bright = 3200) {
  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  o1.type = 'sawtooth';
  o2.type = 'triangle';
  o1.frequency.value = freq;
  o2.frequency.value = freq * 2.003;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.Q.value = 2;
  f.frequency.setValueAtTime(bright, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(500, freq * 1.5), t + decay * 0.5);
  const g = envGain(t, vol, 0.006, decay);
  const g2 = ctx.createGain();
  g2.gain.value = 0.35;
  o1.connect(f);
  o2.connect(g2).connect(f);
  f.connect(g).connect(musicBus);
  o1.start(t);
  o2.start(t);
  o1.stop(t + decay + 0.1);
  o2.stop(t + decay + 0.1);
}

function tablaThump(t, vol = 0.09) {
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(62, t + 0.25);
  const g = envGain(t, vol, 0.004, 0.45);
  o.connect(g).connect(musicBus);
  o.start(t);
  o.stop(t + 0.55);
}

function softTick(t, vol = 0.03) {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 5200;
  const g = envGain(t, vol, 0.002, 0.07);
  s.connect(f).connect(g).connect(musicBus);
  s.start(t, Math.random() * 1.5, 0.12);
}

/* ---------- music scheduler ---------- */
const BEAT = 0.72; // seconds per beat (~83 bpm)

function scheduleStep(t, n) {
  // tanpura drone: Pa – Sa – Sa – Sa(low) across 4 beats
  const tan = [SA * 1.5, SA * 2, SA * 2, SA];
  pluck(tan[n % 4] / 2 * 1, t, 0.075, 3.4, 1400);

  // very soft pulse
  if (n % 4 === 0) tablaThump(t, 0.07);
  if (n % 2 === 1) softTick(t + BEAT * 0.5, 0.02);

  // melody phrases: random walk in the pentatonic scale
  const patterns = [
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    [2, 0, 1, 0],
    [1, 1, 1, 1],
  ];
  const pat = patterns[Math.floor(n / 4) % patterns.length];
  const sub = pat[n % 4];
  if (sub && Math.random() > 0.12) {
    const phraseEnd = n % 16 === 15;
    const move = [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)];
    degree = Math.min(9, Math.max(2, degree + move));
    if (phraseEnd) degree = [4, 5, 7][Math.floor(Math.random() * 3)];
    const f = noteFreq(degree);
    pluck(f, t + 0.01, 0.1, 1.9, 3600);
    if (Math.random() > 0.55) pluck(noteFreq(Math.max(0, degree - 1)), t + BEAT * 0.5, 0.07, 1.4, 3000);
  }
}

function tick() {
  if (!ctx || !state.musicOn) return;
  while (nextTime < ctx.currentTime + 0.6) {
    scheduleStep(Math.max(nextTime, ctx.currentTime + 0.02), stepIndex);
    nextTime += BEAT;
    stepIndex++;
  }
}

export function setMusic(on) {
  if (on) unlock();
  const c = ensureContext();
  if (!c) return;
  state.musicOn = on;
  const now = c.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(musicBus.gain.value, now);
  musicBus.gain.linearRampToValueAtTime(on ? 0.9 : 0, now + (on ? 2.5 : 0.5));
  if (on) {
    nextTime = now + 0.1;
    if (!timer) timer = setInterval(tick, 150);
  } else if (timer) {
    clearInterval(timer);
    timer = null;
  }
  emit();
}

export function setMuted(m) {
  state.muted = m;
  if (ctx) {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(m ? 0 : 0.9, now + 0.15);
    if (!m && ctx.state === 'suspended') ctx.resume();
  }
  emit();
}

/* ---------- sound effects ---------- */
const ready = () => ctx && state.ready && !state.muted && ctx.state !== 'closed';

/** Temple-bell chime. `i` (0-4) picks a pitch from the scale. */
export function bell(i = 0) {
  if (!ready()) return;
  const t = ctx.currentTime;
  const base = noteFreq(5 + i * 1) * 1.0;
  const partials = [
    [1, 0.5, 3.2],
    [2.76, 0.25, 2.2],
    [5.4, 0.12, 1.4],
    [8.93, 0.06, 0.8],
  ];
  partials.forEach(([m, v, d]) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = base * m;
    const g = envGain(t, v * 0.45, 0.003, d);
    o.connect(g).connect(sfxBus);
    o.start(t);
    o.stop(t + d + 0.1);
  });
}

/** Soft magical swell used for scene transitions. */
export function whooshSoft() {
  if (!ready()) return;
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(400, t);
  f.frequency.exponentialRampToValueAtTime(3200, t + 0.9);
  const g = envGain(t, 0.12, 0.5, 0.6);
  s.connect(f).connect(g).connect(sfxBus);
  s.start(t, 0, 1.4);
  // sparkle arpeggio
  [0, 2, 4, 7].forEach((d, k) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = noteFreq(5 + d);
    const gg = envGain(t + k * 0.09, 0.05, 0.004, 0.9);
    o.connect(gg).connect(sfxBus);
    o.start(t + k * 0.09);
    o.stop(t + k * 0.09 + 1);
  });
}

export function tap() {
  if (!ready()) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(880, t);
  o.frequency.exponentialRampToValueAtTime(1320, t + 0.08);
  const g = envGain(t, 0.08, 0.004, 0.18);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + 0.3);
}

export function rocket() {
  if (!ready() || activeVoices > 10) return;
  activeVoices++;
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 0.8;
  f.frequency.setValueAtTime(500, t);
  f.frequency.exponentialRampToValueAtTime(2600, t + 0.8);
  const g = envGain(t, 0.07, 0.08, 0.75);
  s.connect(f).connect(g).connect(sfxBus);
  s.start(t, Math.random(), 1);
  s.onended = () => (activeVoices = Math.max(0, activeVoices - 1));
}

export function boom(size = 1) {
  if (!ready() || activeVoices > 12) return;
  activeVoices++;
  const t = ctx.currentTime;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(1800, t);
  f.frequency.exponentialRampToValueAtTime(120, t + 0.7);
  const g = envGain(t, 0.28 * size, 0.005, 0.9);
  s.connect(f).connect(g).connect(sfxBus);
  s.start(t, Math.random(), 1.2);
  s.onended = () => (activeVoices = Math.max(0, activeVoices - 1));

  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.4);
  const og = envGain(t, 0.3 * size, 0.004, 0.5);
  o.connect(og).connect(sfxBus);
  o.start(t);
  o.stop(t + 0.7);

  // crackle tail
  for (let k = 0; k < 6; k++) {
    const ct = t + 0.15 + Math.random() * 0.9;
    const cs = ctx.createBufferSource();
    cs.buffer = noiseBuf;
    const cf = ctx.createBiquadFilter();
    cf.type = 'highpass';
    cf.frequency.value = 3000 + Math.random() * 3000;
    const cg = envGain(ct, 0.05, 0.001, 0.04);
    cs.connect(cf).connect(cg).connect(sfxBus);
    cs.start(ct, Math.random() * 1.5, 0.06);
  }
}

export function finaleFanfare() {
  if (!ready()) return;
  const t = ctx.currentTime;
  [0, 2, 4, 5, 7, 9].forEach((d, k) => {
    [1, 2].forEach((m) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = noteFreq(3 + d) * m * 0.5;
      const g = envGain(t + k * 0.16, 0.08 / m, 0.01, 2.6);
      o.connect(g).connect(sfxBus);
      o.start(t + k * 0.16);
      o.stop(t + k * 0.16 + 2.8);
    });
  });
  bell(2);
  setTimeout(() => bell(4), 300);
}
