<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top font-weight-bold">
    <router-link :to="user ? '/dashboard' : '/'" @click="closeNavBar" class="navbar-brand text-uppercase pt-2 text-primary" style="font-size:1.92875em">Thinka.io</router-link>
    <button :class="user ? '' : 'd-none'" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div ref="navBar" class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <!-- <div class="navbar-nav">
        
        <a class="nav-item nav-link" href="#">Features</a>
        <a class="nav-item nav-link" href="#">Pricing</a>
        <a class="nav-item nav-link disabled" href="#">Disabled</a>
      </div> -->
      <ul class="navbar-nav mr-auto">
        <li v-if="user" class="nav-item">
          <router-link to="/dashboard" class="nav-item nav-link active font-style-2"><fa icon="columns" /> Dashboard </router-link>
        </li>
        
      </ul>
      <LogInForm v-if="user === null" />
      <ul class="nav navbar-nav navbar-right">
        <li v-if="user" class="nav-item mb-sm-1 mr-1 font-style-2">
          <router-link to="/new-statement" class="nav-item nav-link active btn-primary text-white rounded px-2 font-style-2"><fa icon="plus" /> Create Tree </router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="user" to="/search" class="nav-item nav-link active font-style-2"  ><fa icon="search" /> Search</router-link>
          <!-- <router-link v-else-if="authenticationStatus === 'unauthenticated'" to="/login" class="nav-item nav-link active bg-primary btn text-white px-4 font-style-2"  >Log In</router-link> -->
        </li>
      </ul>

    </div>
  </nav>
</template>
<script>
import Auth from '@/core/auth'
import LogInForm from './header-components/LogInForm'
export default {
  components: {
    LogInForm
  },
  mounted(){
    window.addEventListener('click', (event) => {
      if(!(event['target'].classList.contains('nacbar-toggler-icon') || event['target'].classList.contains('nacbar-toggler'))){
        this.closeNavBar()
      }
    })
  },
  data(){
    return {
      user: Auth.user(),
      authenticationStatus: Auth.status()
    }
  },
  methods: {
    closeNavBar(){
      this.$refs.navBar.classList.remove('show')
    }
  }
}
</script>
