import { createApp } from 'vue'
import App from './App.vue'
import router from '@/core/router'

import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@/core/font-awesome'
import Helpers from '@/helpers/index.js'
createApp(App)
  .use(router)
  .mixin(Helpers)
  .component("fa", FontAwesomeIcon)
  .component("fa-layers", FontAwesomeLayers)
  .component("fa-layers-text", FontAwesomeLayersText)
  .mount('#app')
