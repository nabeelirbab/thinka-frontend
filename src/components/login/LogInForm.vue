<template>
  <div>
    <form>
      <div v-if="mismatched" class="alert alert-danger">Email and Password mismatched</div>
      <div class="form-group">
        <label >Email address</label>
        <input v-model="email" @keydown.enter="focusOnPassword" type="email" class="form-control" aria-describedby="emailHelp" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input ref="passwordField" v-model="password" @keydown.enter="logIn" type="password" autocomplete="on" class="form-control" placeholder="Password" current-password>
      </div>
      <div class="text-center">
        <template v-if="!isLoading">
          <button @click="logIn" :disabled="!hasCredentials" type="button" class="btn btn-primary mr-1">Log In</button>
          <div>
            Dont have an account yet? <router-link to="/register" :disabled="!hasCredentials"  class="">Sign up</router-link>
          </div>
        </template>
        <template v-else>
          Please wait...
        </template>
      </div>
    </form>
  </div>
</template>
<script>
import Auth from '@/core/auth'
export default {
  emits: ['login'],
  data(){
    return {
      email: '',
      password: '',
      mismatched: false,
      isLoading: false
    }
  },
  methods: {
    focusOnPassword(){
      this.$refs.passwordField.focus()
    },
    logIn(){
      this.isLoading = true
      this.mismatched = false
      Auth.logIn(this.email, this.password).then(result => {
        this.$emit('login', result)
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