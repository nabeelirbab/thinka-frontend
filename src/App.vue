<template>
  <div :class="hasMenu && !hideBranding ? 'has-menu-top-padding' : 'top-padding'" style="">
    <Header />
    <div class="d-flex align-items-stretch">
      <div class=" flex-fill">
        <div v-if="authenticationStatus === 'authenticating' || !isMaintableReady" class="text-center">
          Please wait... <fa icon="spinner" spin />
        </div>
        <router-view v-else-if="!routeRequireUser || (routeRequireUser && authenticationStatus === 'authenticated')"></router-view>
        <div v-else class="text-center w-100 pt-4">
          <div>You need to login to see this page</div>
          <router-link to="/login" class="btn btn-primary">Log In</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap'
import '@/assets/style/custom-theme.scss'
import '@/assets/style/util.scss'
import '@/assets/style/thinka-custom.scss'
import Header from '@/components/common/Header'
import Auth from '@/core/auth'
import Maintanables from '@/api/maintainables' // maintainables do not require authentication
export default {
  name: 'App',
  components: {
    Header
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
    }
  },
  computed: {
    routeRequireUser(){
      return typeof this.$route['meta']['auth'] !== 'undefined' && typeof this.$route['meta']['auth']['require_user'] !== 'undefined' && this.$route['meta']['auth']['require_user']
    },
    hideBranding(){
      return typeof this.$route['meta']['hideBranding'] !== 'undefined' && this.$route['meta']['hideBranding']
    },
    hasMenu(){
      return this.authenticationStatus === 'authenticated'
    }
  }
}
</script>

<style scoped>
.top-padding {
  padding-top:46px
}
.has-menu-top-padding {
  padding-top: 76px;
}
@media (min-width: 768px) {
  .has-menu-top-padding {
    padding-top: 46px;
  }
}
</style>
