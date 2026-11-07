/** Geometry helpers for placing string-lights along SVG outlines. */

export const bezier = (p0, p1, p2, p3, n) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    pts.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return pts;
};

export const line = (a, b, n) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return pts;
};

/** Hanging sagging string between two points. */
export const swag = (a, b, sag, n) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * sag]);
  }
  return pts;
};

/** Semicircular / pointed arch outline from (cx, baseY). */
export const arch = (cx, baseY, halfW, height, n = 10) => {
  const spring = baseY - height + halfW;
  const left = line([cx - halfW, baseY], [cx - halfW, spring], 3);
  const top = bezier([cx - halfW, spring], [cx - halfW, spring - halfW * 1.1], [cx, spring - halfW * 1.2], [cx, spring - halfW * 1.35], n);
  const top2 = bezier([cx, spring - halfW * 1.35], [cx, spring - halfW * 1.2], [cx + halfW, spring - halfW * 1.1], [cx + halfW, spring], n);
  const right = line([cx + halfW, spring], [cx + halfW, baseY], 3);
  return [...left, ...top, ...top2, ...right];
};

export const LIGHT_COLORS = ['#ffe08a', '#ffb02e', '#ff7a1a', '#fff6d6', '#ff6b4a'];

/** Deterministic pseudo-random so SSR / re-renders stay stable. */
export const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** Converts a list of outlines into light descriptors with colour + blink data. */
export const toLights = (outlines, seed = 7, thin = 1) => {
  const rnd = seeded(seed);
  const out = [];
  outlines.forEach((pts) => {
    pts.forEach((p, i) => {
      if (thin < 1 && rnd() > thin) return;
      out.push({
        x: p[0],
        y: p[1],
        c: LIGHT_COLORS[Math.floor(rnd() * LIGHT_COLORS.length)],
        blink: rnd() > 0.55,
        delay: -rnd() * 3,
        dur: 1.4 + rnd() * 2,
        r: 1.9 + rnd() * 0.9,
        k: `${p[0].toFixed(1)}-${p[1].toFixed(1)}-${i}`,
      });
    });
  });
  return out;
};
