module.exports = {
  prefix: 'tw-',
  content: ['./src/**/*.{vue,js,ts}'],
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
