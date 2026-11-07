const nav = typeof navigator !== 'undefined' ? navigator : {};
const win = typeof window !== 'undefined' ? window : { innerWidth: 1024 };

/** Rough "is this a phone / low-power device" check used to scale effects. */
export const isSmallScreen = () => win.innerWidth < 700;
export const isLowPower = () =>
  (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) || (nav.deviceMemory && nav.deviceMemory <= 4);

/** 1 = full effects, <1 = reduced particle counts */
export const effectScale = () => {
  let s = 1;
  if (isSmallScreen()) s *= 0.75;
  if (isLowPower()) s *= 0.75;
  return Math.max(0.45, s);
};

export const rand = (min, max) => Math.random() * (max - min) + min;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
