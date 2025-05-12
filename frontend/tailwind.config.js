// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          100: '#ffe8d6',
          200: '#ffd6a5',
          500: '#ff9e5d',
          600: '#e85d04',
          700: '#dc2f02',
          900: '#7f2704'
        },
        amber: {
          500: '#ffb703',
        },
        blue: {
          50: '#eef8ff',
          400: '#6ba8e5',
          500: '#3e85de',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
    },
  },
  plugins: [],
}