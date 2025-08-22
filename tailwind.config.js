/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // emerald-500
        secondary: "#059669", // emerald-600
        accent: "#F59E0B", // amber-500
        background: "#18181B", // zinc-900
        surface: "#27272A", // zinc-800
        border: "#3F3F46", // zinc-700
        text: {
          primary: "#F4F4F5", // zinc-100
          secondary: "#A1A1AA", // zinc-400
          accent: "#34D399", // emerald-400
          highlight: "#F59E0B", // amber-400
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
