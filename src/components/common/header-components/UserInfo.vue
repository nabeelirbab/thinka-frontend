<template>
  <div class="btn-group pt-md-1">
    <button type="button" class="btn border-0 shadow-none" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <fa icon="user-circle" style="font-size:1em" /> <span class="d-md-none">{{toPascal(user['first_name'])}}</span>
      
    </button>
    <div class="dropdown-menu dropdown-menu-right px-3">
      <div class="text-center py-2">{{user['email']}}</div>
      <div class="text-center" >
        <button @click="logout" class="btn btn-outline-danger" type="button">Log Out</button>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
export default {
  data(){
    return {
      user: Auth.user(),
      authenticationStatus: Auth.status()
    }
  },
  methods: {
    toPascal(s){
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
    logout(){
      Auth.logout()
      this.$router.push('/')
    }
  }
}
</script>
