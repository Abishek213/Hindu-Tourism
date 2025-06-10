module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-saffron': '#f85c2c',
        'secondary-green': '#16a34a',
        'white':'#FFFFFFFF',
        'light': '#F05A28',
        'dark': '#833419'
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        custom: ["'Fontspring Bold Italic'", "sans-serif"],
        Qasira: ["Qasira", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['responsive', 'hover', 'focus', 'active'],
      textColor: ['responsive', 'hover', 'focus', 'active'],
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
