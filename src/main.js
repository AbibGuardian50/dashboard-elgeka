import './assets/main.css'
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import
import App from './App.vue'
import router from './router'
import config from '../src/components/Formkit/formkit.config.js'
import { plugin, defaultConfig } from '@formkit/vue'

const app = createApp(App)

app.use(router, plugin, Toast, createPinia(),defaultConfig(config))

app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 5000
});

app.mount('#app')
