import { createApp } from 'vue'
import App from './App.vue'
import router from '@/core/router'

import { FontAwesomeIcon } from '@/core/font-awesome'
import Helpers from '@/helpers/index.js'
createApp(App)
  .use(router)
  .mixin(Helpers)
  .component("fa", FontAwesomeIcon)
  .mount('#app')
