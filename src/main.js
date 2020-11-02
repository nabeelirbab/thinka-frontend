import { createApp } from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from '@/core/font-awesome'
createApp(App).component("fa", FontAwesomeIcon).mount('#app')
