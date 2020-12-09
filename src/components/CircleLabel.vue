<template>
  <div class="circleLabel bg-white d-flex align-items-center">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
  }
}
</script>
<style scoped>
  .circleLabel {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    text-align: center;
    justify-content: center !important;
    align-items: center !important;
    padding: 0;
    border: 0;
    margin: 0;
  }
</style>