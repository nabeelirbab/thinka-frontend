import { createApp } from 'vue'
import App from './App.vue'
import router from '@/core/router'

import { FontAwesomeIcon } from '@/core/font-awesome'

createApp(App)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .mount('#app')
