/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f0f0f',
        'dark-card': '#1e1e1e',
        'dark-border': '#2d2d2d',
        'blue-primary': '#3b82f6',
        'blue-secondary': '#1d4ed8',
        'blue-accent': '#60a5fa',
        'green-online': '#10b981',
        'green-accent': '#34d399',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'heart-beat': 'heartbeat 1.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'modal-slide': 'modal-slide 0.4s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'typing-dots': 'typing-dots 1.4s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        'modal-slide': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'typing-dots': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-10px)', opacity: '1' },
        },
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0f0f0f, #1a1a1a, #2d2d2d)',
        'blue-gradient': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        'card-gradient': 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.95))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
