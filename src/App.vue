<template>
  <div style="padding-top:4.5em">
    <Header />
    <div>
      <div>
        <div v-if="authenticationStatus === 'authenticating' || !isMaintableReady" class="text-center">
          Please wait... <fa icon="spinner" spin />
        </div>
        <router-view v-else></router-view>
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
import Maintanables from '@/api/maintainables'
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
  }
}
</script>

<style>
</style>
