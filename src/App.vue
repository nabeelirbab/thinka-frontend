<template>
  <div style="padding-top:4.5em">
    <Header />
    <div>
      <div>
        <router-view></router-view>
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
export default {
  name: 'App',
  components: {
    Header
  },
  mounted(){
    Auth.chechAuth()
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
