import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { effectScale, rand, pick } from '../lib/device';
import * as audio from '../lib/audio';

const PALETTES = [
  ['#ffd56a', '#ffb02e', '#fff1b8'], // gold
  ['#ff5a3c', '#ff9a3c', '#ffd56a'], // fire / saffron
  ['#ff3d7f', '#ff7ab0', '#ffe0ec'], // magenta
  ['#3dd6ff', '#7af0ff', '#e0fbff'], // cyan
  ['#7dff6a', '#d6ff7a', '#f4ffd8'], // green
  ['#b86bff', '#e0a8ff', '#f6e8ff'], // violet
  ['#ff3b3b', '#ff8a5a', '#ffd0b0'], // ruby
  ['#ffffff', '#ffe9a0', '#cfe8ff'], // white-gold
];
const GOLD = ['#ffd56a', '#ffb02e', '#fff1b8'];
const HEART = ['#ff3d7f', '#ff7ab0', '#ffe0ec'];
const TYPES = ['sphere', 'sphere', 'chrys', 'chrys', 'ring', 'willow', 'willow', 'heart', 'star', 'double'];

/**
 * Canvas fireworks engine: rockets, multiple shell types, glitter, trails, flashes.
 * Imperative API (via ref): launch(x, y), volley(n).
 */
const FireworksCanvas = forwardRef(function FireworksCanvas(
  { auto = true, rate = 1, interactive = true, sound = true, volume = 1, yRange = [0.12, 0.5], className = '', onLaunch },
  ref
) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const api = useRef({});
  const props = useRef({});
  props.current = { auto, rate, interactive, sound, volume, yRange, onLaunch };

  useImperativeHandle(
    ref,
    () => ({
      launch: (x, y) => api.current.launch?.(x, y),
      volley: (n) => api.current.volley?.(n),
    }),
    []
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scale = effectScale();
    const dprCap = scale < 0.7 ? 1.5 : 2;
    const maxParticles = Math.round(1400 * scale);

    let W = 0;
    let H = 0;
    let S = 1;
    let raf = 0;
    let last = performance.now();
    let autoTimer = 0.4;
    let idleClear = 0;
    const timeouts = new Set();
    const particles = [];
    const rockets = [];
    const flashes = [];
    const rings = [];

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      S = Math.min(W, H) / 560;
      S = Math.max(0.6, Math.min(S, 1.9));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const spawn = (x, y, vx, vy, color, o) => {
      if (particles.length >= maxParticles) return;
      particles.push({
        x,
        y,
        px: x,
        py: y,
        vx,
        vy,
        color,
        life: 1,
        decay: o.decay,
        g: o.g,
        f: o.f,
        size: o.size,
        glitter: !!o.glitter,
        trail: !!o.trail,
        crackle: !!o.crackle,
      });
    };

    const n = (count) => Math.max(8, Math.round(count * scale));

    const explode = (x, y, forced) => {
      const p = props.current;
      const pal = pick(PALETTES);
      const type = forced || pick(TYPES);
      const base = rand(270, 380) * S;
      flashes.push({ x, y, life: 1, r: 190 * S, color: type === 'heart' ? HEART[0] : pal[0] });
      if (p.sound) audio.boom(0.55 * p.volume + Math.random() * 0.25);

      const shell = (count, speed, colors, o) => {
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const sp = speed * (Math.random() < 0.18 ? rand(0.3, 0.7) : rand(0.86, 1));
          spawn(x, y, Math.cos(a) * sp, Math.sin(a) * sp, colors[i % colors.length], {
            decay: rand(0.55, 0.8),
            g: 60,
            f: 0.965,
            size: 2,
            ...o,
          });
        }
      };

      const shape = (pts, k, colors, o) => {
        pts.forEach(([px, py], i) =>
          spawn(x, y, px * k, py * k, colors[i % colors.length], { decay: rand(0.5, 0.65), g: 28, f: 0.965, size: 2.3, glitter: true, ...o })
        );
      };

      switch (type) {
        case 'sphere':
          shell(n(95), base, pal, { glitter: Math.random() < 0.5, crackle: Math.random() < 0.2 });
          break;
        case 'chrys':
          shell(n(70), base * 0.95, pal, { trail: true, decay: rand(0.42, 0.55), g: 85, size: 2.2 });
          break;
        case 'ring': {
          const tilt = rand(0.25, 0.9);
          const rot = rand(0, Math.PI);
          const N = n(64);
          for (let i = 0; i < N; i++) {
            const a = (Math.PI * 2 * i) / N;
            const vx = Math.cos(a) * base;
            const vy = Math.sin(a) * base * tilt;
            spawn(x, y, vx * Math.cos(rot) - vy * Math.sin(rot), vx * Math.sin(rot) + vy * Math.cos(rot), pal[i % 2], {
              decay: rand(0.55, 0.7),
              g: 35,
              f: 0.965,
              size: 2.3,
              glitter: true,
            });
          }
          shell(n(28), base * 0.45, [pal[2]], { decay: 0.9, size: 1.8 });
          break;
        }
        case 'willow':
          for (let i = 0; i < n(80); i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = rand(120, 280) * S;
            spawn(x, y, Math.cos(a) * sp, Math.sin(a) * sp, GOLD[i % 3], {
              decay: rand(0.26, 0.38),
              g: 95,
              f: 0.975,
              size: 1.9,
              trail: true,
              glitter: true,
            });
          }
          break;
        case 'heart': {
          const pts = [];
          const N = n(76);
          for (let i = 0; i < N; i++) {
            const t = (Math.PI * 2 * i) / N;
            pts.push([16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) + 2]);
          }
          shape(pts, (base / 16) * 1.15, HEART, { g: 22 });
          break;
        }
        case 'star': {
          const verts = [];
          for (let k = 0; k < 10; k++) {
            const r = k % 2 === 0 ? 1 : 0.42;
            const a = -Math.PI / 2 + (Math.PI * 2 * k) / 10;
            verts.push([Math.cos(a) * r, Math.sin(a) * r]);
          }
          const pts = [];
          const per = Math.max(3, Math.round(n(70) / 10));
          for (let k = 0; k < 10; k++) {
            const a = verts[k];
            const b = verts[(k + 1) % 10];
            for (let m = 0; m < per; m++) pts.push([a[0] + ((b[0] - a[0]) * m) / per, a[1] + ((b[1] - a[1]) * m) / per]);
          }
          shape(pts, base * 1.05, GOLD, { g: 30 });
          break;
        }
        default:
          shell(n(80), base, pal, { glitter: true });
          shell(n(46), base * 0.5, [pal[2], '#ffffff'], { decay: rand(0.7, 0.95), size: 1.9 });
      }
    };

    const launch = (tx, ty, opts = {}) => {
      const p = props.current;
      const x0 = opts.x0 ?? Math.min(W - 16, Math.max(16, tx + rand(-70, 70) * S));
      rockets.push({ x0, y0: H + 8, x: x0, y: H + 8, tx, ty, t: 0, dur: rand(0.7, 1.0) * (0.75 + (0.35 * (H - ty)) / H), px: x0, py: H + 8 });
      if (p.sound) audio.rocket();
      p.onLaunch?.();
    };

    const volley = (count) => {
      for (let i = 0; i < count; i++) {
        const id = setTimeout(() => {
          timeouts.delete(id);
          launch(rand(0.12, 0.88) * W, rand(0.1, 0.45) * H);
        }, i * rand(160, 300));
        timeouts.add(id);
      }
    };

    // instant visual feedback where the visitor tapped
    const tap = (x, y) => {
      rings.push({ x, y, life: 1 });
      for (let i = 0; i < n(14); i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(40, 110) * S;
        spawn(x, y, Math.cos(a) * sp, Math.sin(a) * sp, pick(GOLD), { decay: 2.2, g: 40, f: 0.92, size: 1.8, glitter: true });
      }
      if (props.current.sound) audio.tap();
    };

    api.current = { launch, volley, tap };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const p = props.current;

      // auto launches
      if (p.auto) {
        autoTimer -= dt;
        if (autoTimer <= 0) {
          const [y0, y1] = p.yRange;
          launch(rand(0.1, 0.9) * W, rand(y0, y1) * H);
          if (Math.random() < 0.3) {
            const id = setTimeout(() => {
              timeouts.delete(id);
              launch(rand(0.1, 0.9) * W, rand(y0, y1) * H);
            }, rand(150, 400));
            timeouts.add(id);
          }
          autoTimer = rand(0.8, 1.7) / p.rate;
        }
      }

      // fade previous frame (keeps canvas transparent)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.24)';
      ctx.fillRect(0, 0, W, H);
      if (!particles.length && !rockets.length && !flashes.length && !rings.length) {
        idleClear += dt;
        if (idleClear > 0.6) {
          ctx.clearRect(0, 0, W, H);
          idleClear = 0;
        }
      } else idleClear = 0;

      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      // flashes
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= dt * 4.5;
        if (f.life <= 0) {
          flashes.splice(i, 1);
          continue;
        }
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * (1.3 - f.life * 0.5));
        g.addColorStop(0, f.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 0.38 * f.life;
        ctx.fillStyle = g;
        ctx.fillRect(f.x - f.r * 1.3, f.y - f.r * 1.3, f.r * 2.6, f.r * 2.6);
      }

      // tap ripples
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.life -= dt * 2.4;
        if (r.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = r.life * 0.8;
        ctx.strokeStyle = '#ffd56a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, (1 - r.life) * 46 * S + 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.t += dt / r.dur;
        const t = Math.min(r.t, 1);
        const ey = 1 - (1 - t) * (1 - t);
        r.px = r.x;
        r.py = r.y;
        r.x = r.x0 + (r.tx - r.x0) * t + Math.sin(t * 20) * 2 * S;
        r.y = r.y0 + (r.ty - r.y0) * ey;
        spawn(r.x, r.y, rand(-14, 14), rand(25, 70), '#ffcf5a', { decay: 2.4, g: 80, f: 0.95, size: 1.6 });
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#fff4c8';
        ctx.lineWidth = 2.4 * Math.min(S, 1.4);
        ctx.beginPath();
        ctx.moveTo(r.px, r.py);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        if (r.t >= 1) {
          explode(r.tx, r.ty);
          rockets.splice(i, 1);
        }
      }

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const q = particles[i];
        q.px = q.x;
        q.py = q.y;
        const fr = Math.pow(q.f, dt * 60);
        q.vx *= fr;
        q.vy *= fr;
        q.vy += q.g * dt * S;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        q.life -= q.decay * dt;
        if (q.life <= 0) {
          if (q.crackle) {
            for (let k = 0; k < 3; k++) spawn(q.x, q.y, rand(-40, 40) * S, rand(-40, 40) * S, '#fff4c8', { decay: 2.6, g: 40, f: 0.93, size: 1.6, glitter: true });
          }
          particles[i] = particles[particles.length - 1];
          particles.pop();
          continue;
        }
        if (q.trail && Math.random() < 0.28) {
          spawn(q.x, q.y, rand(-10, 10), rand(-6, 16), q.color, { decay: 2.2, g: 25, f: 0.94, size: 1.3 });
        }
        let a = q.life < 0.35 ? q.life / 0.35 : 1;
        if (q.glitter && Math.random() < 0.22) a *= 0.25;
        ctx.globalAlpha = a;
        ctx.strokeStyle = q.color;
        ctx.lineWidth = q.size * (0.55 + 0.45 * q.life) * Math.min(S, 1.5);
        ctx.beginPath();
        ctx.moveTo(q.px, q.py);
        ctx.lineTo(q.x + 0.01, q.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    // initial welcome volley
    if (props.current.auto) volley(3);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      timeouts.forEach(clearTimeout);
      timeouts.clear();
      api.current = {};
    };
  }, []);

  const onPointerDown = (e) => {
    if (!props.current.interactive) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    audio.unlock();
    api.current.tap?.(x, y);
    api.current.launch?.(x, y);
  };

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 ${interactive ? '' : 'pointer-events-none'} ${className}`}
      style={{ touchAction: 'none' }}
      onPointerDown={onPointerDown}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
});

export default FireworksCanvas;
