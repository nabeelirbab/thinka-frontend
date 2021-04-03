<template>
  <div class="btn-group pt-md-1">
    <button type="button" class="btn border-0 shadow-none py-1 d-flex align-items-center" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span v-if="user" class="mr-1">{{toPascal(user['username'])}}</span>
      <fa icon="user-circle" :class="user ? 'text-regular' : 'text-light'" class="mr-1" style="font-size:1.7em" /> 
    </button>
    <div class="dropdown-menu dropdown-menu-right px-3 py-2">
      <template v-if="user">
        <div class="text-center py-2">{{user['email']}}</div>
        <div class="mb-1">
          <button v-if="deferredInstallPrompt" @click="addToHomeScreen" class="btn btn-outline-success w-100">Install</button>
        </div>
        <div class="text-center" >
          <router-link to="profile-setting" class="btn btn-outline-dark mb-1 text-nowrap" type="button"><fa icon="user" /> Profile Setting</router-link>
          <button @click="logout" class="btn btn-outline-danger" type="button">Log Out</button>
        </div>
      </template>
      <template v-else>
        <div class="text-center" >
          <button @click="$emit('open-login')" class="btn py-1 btn-primary w-100">Log In</button>
          <div class="text-center py-0">or</div>
          <router-link to="/register" class="btn py-1 btn-outline-primary w-100">Register</router-link>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
export default {
  components: {
  },
  emits: ['open-login'],
  mounted(){
    console.log('mounting')
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
      user: Auth.user(),
      authenticationStatus: Auth.status(),
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
    logout(){
      Auth.logout()
      this.$router.push('/')
    }
  }
}
</script>
