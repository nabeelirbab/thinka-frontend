<template>
  <div class="btn-group pt-md-1">
    <button type="button" class="btn border-0 shadow-none py-1 d-flex align-items-center px-2 text-nowrap" data-toggle="dropdown" >
      <span v-if="user" class="mr-1">{{toPascal(user['username'])}}</span>
      <span style="font-size:1.6em!important">
        <fa icon="user-circle" :class="user ? 'text-regular' : 'text-light'"  /> 
      </span>
    </button>
    <div class="dropdown-menu dropdown-menu-right px-3 py-2">
      <template v-if="user">
        <div class="text-center py-2">{{user['email']}}</div>
        <div class="text-center" >
          <router-link to="profile-setting" class="btn btn-outline-dark mb-1 text-nowrap w-100" type="button"><fa icon="user" /> Profile Setting</router-link>
          <InstallAppButton class="w-100 mb-1" />
          <button @click="logout" class="btn btn-outline-danger w-100" type="button">Log Out</button>
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
import InstallAppButton from '@/components/InstallAppButton'
export default {
  components: {
    InstallAppButton
  },
  data(){
    return {
      user: Auth.user(),
      authenticationStatus: Auth.status(),
    }
  },
  methods: {
    
    logout(){
      Auth.logout()
      this.$router.push('/')
    }
  }
}
</script>
