<template>
  <button 
    v-if="deferredInstallPrompt"
    @click="addToHomeScreen"
    class="btn btn-outline-success"
  >
    Install App
  </button>
</template>
<script>
export default {
  mounted(){
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      console.log('beforeinstallprompt triggered', e)
      // Stash the event so it can be triggered later.
      this.deferredInstallPrompt = e
    })
  },
  data(){
    return {
      deferredInstallPrompt: null
    }
  },
  methods: {
    addToHomeScreen(){
      if(this.deferredInstallPrompt){
        // Show the prompt
        this.deferredInstallPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredInstallPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt')
          } else {
            console.log('User dismissed the A2HS prompt')
          }
          this.deferredInstallPrompt = null
        })
      }else{
        console.log('A2HS is not supported')
      }
    },
  }
}
</script>