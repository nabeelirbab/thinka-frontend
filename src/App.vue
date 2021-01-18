<template class="overflow-hidden">
  <div :class="!hideBranding ? 'has-menu-top-padding' : 'top-padding'" style="">
    <Header />
    <div class="d-flex align-items-stretch">
      <div class="flex-grow-1" style="min-width:0">
        <div v-if="authenticationStatus === 'authenticating' || !isMaintableReady" class="text-center pt-4">
          Please wait... <fa icon="spinner" spin />
        </div>
        <router-view v-else-if="!routeRequireUser || (routeRequireUser && authenticationStatus === 'authenticated')"></router-view>
        <div v-else class="text-center w-100 pt-4">
          <div>You need to login to see this page</div>
          <button @click="checkIfLogInRequired" class="btn btn-primary font-style-2 px-4" type="button">Log In</button>
        </div>
        <LogInModal ref="logInModal" message="You need to log in to use this page or functionality" />
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap'
import 'vue-popperjs/dist/vue-popper.css'
import '@/assets/style/custom-theme.scss'
import '@/assets/style/util.scss'
import '@/assets/style/thinka-custom.scss'
import Header from '@/components/common/Header'
import Auth from '@/core/auth'
import LogInModal from '@/components/login/LogInModal'
import Maintanables from '@/api/maintainables' // maintainables do not require authentication


export default {
  name: 'App',
  components: {
    Header,
    LogInModal
  },
  mounted(){
    Maintanables.prepare().then(() => {
      this.isMaintableReady = true
    })
    Auth.chechAuth()
  },
  data(){
    return {
      isMaintableReady: false,
      authenticationStatus: Auth.status()
    }
  },
  methods: {
    test(){
      console.log('Auth', Auth, Auth.chechAuth)
    },
    checkIfLogInRequired(){
      setTimeout(() => {
        if(this.routePath !== '/' && this.routeRequireUser && this.authenticationStatus === 'unauthenticated' && this.authenticationStatus !== 'authenticating'){
          this.$refs.logInModal._open()
        }
      }, 100)
    }
  },
  watch: {
    authenticationStatus: {
      handler(){
        this.checkIfLogInRequired()
      },
      immediate: true
    },
    routePath: {
      handler(){
        this.checkIfLogInRequired()
      },
      immediate: true
    },
    // routeRequireUser(){
    //   this.checkIfLogInRequired()
    // }
  },
  computed: {
    routePath(){
      return this.$route['path']
    },
    routeRequireUser(){
      return typeof this.$route['meta']['auth'] !== 'undefined' && typeof this.$route['meta']['auth']['require_user'] !== 'undefined' && this.$route['meta']['auth']['require_user']
    },
    hideBranding(){
      return typeof this.$route['meta']['hideBranding'] !== 'undefined' && this.$route['meta']['hideBranding']
    },
    hasMenu(){
      return true // this.authenticationStatus === 'authenticated'
    }
  }
}
</script>

<style scoped>
.top-padding {
  padding-top:46px
}
.has-menu-top-padding {
  padding-top: 84px;
}
@media (min-width: 768px) {
  .top-padding {
    padding-top:46px
  }
  .has-menu-top-padding {
    padding-top: 46px;
  }
}
</style>
