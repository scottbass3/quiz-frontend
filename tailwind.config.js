/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fff7ed',
        'body-bg': '#eddbc7',
        'card-bg': '#fde8c8',
        orange: '#f97316',
        red: '#ef4444',
        yellow: '#fbbf24',
        green: '#22c55e',
        purple: '#8b5cf6',
        ink: '#1c1917',
        'ink-soft': '#57534e',
      },
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        hard: '4px 4px 0 #1c1917',
        'hard-sm': '2px 2px 0 #1c1917',
        'hard-orange': '4px 4px 0 #f97316',
        'hard-1': '1px 1px 0 #1c1917',
      },
      borderWidth: {
        '2.5': '2.5px',
      },
      keyframes: {
        screenIn: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.94)' },
          '55%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '18%': { transform: 'translateX(-9px)' },
          '36%': { transform: 'translateX(9px)' },
          '54%': { transform: 'translateX(-6px)' },
          '72%': { transform: 'translateX(6px)' },
        },
        heartBeat: {
          '0%,100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.45)' },
        },
        cntPulse: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        cfFall: {
          to: { transform: 'translateY(110vh) rotate(700deg)', opacity: '0' },
        },
        rot: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'screen-in': 'screenIn 0.28s cubic-bezier(.22,1,.36,1)',
        'bounce-in': 'bounceIn 0.6s ease',
        shake: 'shake 0.45s ease',
        'heart-beat': 'heartBeat 0.4s ease',
        'cnt-pulse': 'cntPulse 0.85s ease infinite',
        'cf-fall': 'cfFall linear forwards',
        spin: 'rot 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}
