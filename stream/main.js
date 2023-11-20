// FILE: main.js

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Dialog } from 'quasar';
import quasarIconSet from 'quasar/icon-set/svg-fontawesome-v6';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css

// Import Quasar css
import 'quasar/src/css/index.sass';

import route from './src/router/index.ts';

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './src/App.vue';

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Dialog,
  }, // import Quasar plugins and add here
  iconSet: quasarIconSet,
});

const pinia = createPinia();
app.use(pinia);

app.use(route());

// Assumes you have a <div id="app"></div> in your index.html
app.mount('#app');
