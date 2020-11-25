<template>
  <div class="">
    <div class="form-inline">
      <input v-model="email" class="form-control mr-sm-2" type="input" placeholder="Email" style="height:36px; padding-top:9px">
      <input v-model="password" @keypress.enter="logIn" class="form-control mr-sm-2" type="password" placeholder="Password" style="height:36px; padding-top:9px">
      <button :disabled="!hasCredentials || isLoading" @click="logIn" class="btn btn-primary font-style-2 px-4" type="button" style="height:36px; padding-top:6px">Log In</button>
    </div>
    <div v-if="mismatched" class="text-danger"><small><fa icon="exclamation" /> Email & Password mismatched!</small></div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
export default {
  data(){
    return {
      email: '',
      password: '',
      mismatched: false,
      isLoading: false
    }
  },
  methods: {
    logIn(){
      this.isLoading = true
      this.mismatched = false
      Auth.logIn(this.email, this.password).then(result => {
        console.log(this.$router.push('/dashboard'), result)
      }).catch(error => {
        console.log(error)
        if(error.status === 401){
          this.mismatched = true
        }
        this.isLoading = false
      })
    }
  },
  computed: {
    hasCredentials(){
      return this.email !== '' && this.password !== ''
    }
  }
}
</script>
