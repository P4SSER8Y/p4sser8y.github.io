module.exports = {
  prefix: 'tw-',
  content: ['./main/**/*.{vue,js,ts}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['night'],
  },
  theme: {
    container: {
      center: true,
    },
  },
};
