<template>
  <button 
    v-if="deferredInstallPrompt"
    @click="addToHomeScreen"
    :disabled="isLoading"
    class="btn btn-outline-success"
  >
    <span v-if="!isLoading">Install App</span>
    <span v-else >Please wait <fa icon="spinner" spin /></span>
  </button>
</template>
<script>
import {ref} from 'vue'
const deferredInstallPrompt = ref(null)
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt triggered', e)
  // Stash the event so it can be triggered later.
  deferredInstallPrompt.value = e
})
export default {
  data(){
    return {
      deferredInstallPrompt: deferredInstallPrompt.value,
      isLoading: false
    }
  },
  methods: {
    addToHomeScreen(){
      this.isLoading = true
      if(this.deferredInstallPrompt){
        // Show the prompt
        this.deferredInstallPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredInstallPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.deferredInstallPrompt = null
            console.log('User accepted the A2HS prompt')
          } else {
            console.log('User dismissed the A2HS prompt')
          }
          this.isLoading = false
        })
        
      }else{
        console.log('A2HS is not supported')
        this.isLoading = false
      }
      
    },
  }
}
</script>