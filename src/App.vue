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
import Header from '@/components/common/Header'
export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>
</style>
