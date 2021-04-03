import { createApp } from 'vue'
import App from './App.vue'
import router from '@/core/router'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@/core/font-awesome'
import Helpers from '@/helpers/index.js'
import { VTooltip, VPopover, VClosePopover } from 'v-tooltip'
import './registerServiceWorker'

VTooltip.options.autoHide = false
createApp(App)
  .use(router)
  .mixin(Helpers)
  .component("fa", FontAwesomeIcon)
  .component("fa-layers", FontAwesomeLayers)
  .component("fa-layers-text", FontAwesomeLayersText)
  .directive('tooltip', VTooltip)
  .directive('close-popover', VClosePopover)
  .component('v-popover', VPopover)

  .mount('#app')
