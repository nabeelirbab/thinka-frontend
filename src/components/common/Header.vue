<template>
  <div class="d-md-flex fixed-top font-weight-bold border-bottom align-items-center py-1 bg-white">
    <div v-if="!hideBranding" class="px-2 w-sm-100 d-flex align-items-center">
      <router-link :to="user ? '/dashboard' : '/'" class="navbar-brand py-0 text-uppercase text-primary" style="font-size:1.60875em">Thinka.io</router-link>
      <router-link v-if="user === null" to="/login" class="btn btn-primary d-inline d-md-none ml-auto">Log In</router-link>
    </div>
    <div class="d-flex flex-fill">
      <LogInForm v-if="user === null" class="ml-auto d-none d-md-block" />
      <div v-else class="d-flex justify-content-around  w-100 container" >
        <router-link v-if="user" to="/dashboard" :class="routePath === '/dashboard' ? '' : 'text-secondary'" class="shadow-none py-1"><fa icon="home" /> </router-link>
        <router-link v-if="user" to="/search" :class="routePath === '/search' ? '' : 'text-secondary'" class="shadow-none py-1"  tag="button"><fa icon="search" /></router-link>
        <router-link v-if="user" to="/branch" :class="routePath.indexOf('/branch') !== -1 ? '' : 'text-secondary'" class="shadow-none py-1"  tag="button"><fa icon="tree" /></router-link>
        <router-link v-if="user" to="/bookmarks" :class="routePath === '/bookmarks' ? '' : 'text-secondary'" class="shadow-none py-1"  tag="button"><fa icon="bookmark" /></router-link>
        <router-link v-if="user" to="/notification" :class="routePath === '/notification' ? '' : 'text-secondary'" class="shadow-none py-1"  tag="button"><fa icon="bell" /></router-link>
        <router-link v-if="user" to="/search" class="text-secondary shadow-none py-1"  tag="button"><fa icon="bars" /></router-link>
      </div>
      <!-- <div class="navbar-nav">
        
        <a class="nav-item nav-link" href="#">Features</a>
        <a class="nav-item nav-link" href="#">Pricing</a>
        <a class="nav-item nav-link disabled" href="#">Disabled</a>
      </div> -->
      <!-- <ul class="navbar-nav mr-auto">
        <li v-if="user" class="nav-item">
          
        </li>
        
      </ul>
      
      <ul class="nav navbar-nav navbar-right">
        <li v-if="user" class="nav-item mb-sm-1 mr-1 font-style-2">
          <router-link to="/new-statement" class="nav-item nav-link active btn-primary text-white rounded px-2 font-style-2"><fa icon="plus" /> Create Tree </router-link>
        </li>
        <li class="nav-item">
          
        </li>
      </ul> -->

    </div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
import LogInForm from './header-components/LogInForm'
export default {
  components: {
    LogInForm
  },
  mounted(){
  },
  data(){
    return {
      user: Auth.user(),
      authenticationStatus: Auth.status()
    }
  },
  
  methods: {
  },
  watch: {
    routePath(){
    }
  },
  computed:{
    routePath(){
      return this.$route['path']
    },
    hideBranding(){
      return typeof this.$route['meta']['hideBranding'] !== 'undefined' && this.$route['meta']['hideBranding']
    }
  }
}
</script>
<style>
</style>