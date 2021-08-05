import { createApp } from 'vue'
import App from './App.vue'
import router from '@/core/router'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@/core/font-awesome'
import Helpers from '@/helpers/index.js'
import VTooltipPlugin  from 'v-tooltip' // https://v-tooltip.netlify.app/guide/installation.html#node
import './registerServiceWorker'

// VTooltip.options.autoHide = false
createApp(App)
  .use(router)
  .use(VTooltipPlugin, {
    defaultTrigger: 'hover focus click'
  })
  .mixin(Helpers)
  .component("fa", FontAwesomeIcon)
  .component("fa-layers", FontAwesomeLayers)
  .component("fa-layers-text", FontAwesomeLayersText)

  // .directive('close-popover', VClosePopover)
  // .component('v-popover', VPopover)

  .mount('#app')
