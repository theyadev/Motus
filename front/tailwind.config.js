module.exports = {
  mode: "jit",
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Almarai", "sans-serif"]
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
