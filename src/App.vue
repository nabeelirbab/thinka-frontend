<template>
  <button class="btn btn-success">Bootstrap Works <fa icon="check" /></button>
</template>

<script>
import 'bootstrap'
import '@/assets/style/custom-theme.scss'
export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
