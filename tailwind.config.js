/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0a0820',
        maroon: '#3a0a1c',
        diya: '#f5b83d',
        saffron: '#ff8a1f',
        ember: '#ff5a1f',
        ruby: '#b3122f',
        cream: '#fff4dc',
      },
      fontFamily: {
        display: ['"Cinzel Decorative"', '"Cinzel"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        flicker: {
          '0%,100%': { transform: 'scale(1, 1) rotate(-1deg)', opacity: '1' },
          '25%': { transform: 'scale(0.94, 1.08) rotate(1.5deg)', opacity: '0.95' },
          '50%': { transform: 'scale(1.05, 0.95) rotate(-1deg)', opacity: '1' },
          '75%': { transform: 'scale(0.97, 1.05) rotate(1deg)', opacity: '0.92' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(-110vh) translateX(var(--dx, 20px))', opacity: '0' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        twinkle: {
          '0%,100%': { opacity: '0.35', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        petalFall: {
          '0%': { transform: 'translate3d(0,-10vh,0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translate3d(var(--dx, 40px),110vh,0) rotate(var(--rot, 540deg))', opacity: '0.9' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.12)' },
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        flicker: 'flicker 1.3s ease-in-out infinite',
        floatUp: 'floatUp var(--dur, 12s) linear infinite',
        sway: 'sway 4s ease-in-out infinite',
        twinkle: 'twinkle 2.4s ease-in-out infinite',
        shimmer: 'shimmer 5s linear infinite',
        petalFall: 'petalFall var(--dur, 12s) linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        spinSlow: 'spinSlow 60s linear infinite',
      },
    },
  },
  plugins: [],
};
