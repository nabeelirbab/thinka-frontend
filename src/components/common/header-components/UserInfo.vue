<template>
  <div class="btn-group pt-md-1">
    <button type="button" class="btn border-0 shadow-none py-1 d-flex align-items-center" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <fa icon="user-circle" :class="user ? 'text-primary' : ''" class="mr-1" style="font-size:1.7em" /> <span v-if="user" class="d-md-none">{{toPascal(user['first_name'])}}</span>
    </button>
    <div class="dropdown-menu dropdown-menu-right px-3 py-2">
      <template v-if="user">
        <div class="text-center py-2">{{user['email']}}</div>
        <div class="text-center" >
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
  data(){
    return {
      user: Auth.user(),
      authenticationStatus: Auth.status()
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
