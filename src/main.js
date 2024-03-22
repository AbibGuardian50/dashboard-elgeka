import './assets/main.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router, Toast, createPinia())


app.mount('#app')
