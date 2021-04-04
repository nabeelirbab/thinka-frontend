<template>
  <div class="text-center">
    <div>
      <img class="animate-pulse" src="@/assets/images/thinka-square-logo.png" alt="Thinka" style="max-width:250px"/>
    </div>
    <div class="mt-1">{{message}}... <fa icon="spinner" spin /></div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Please wait'
    }
  }
}
</script>
<style>
.animate-pulse {
  animation: animate-pulse 3s infinite alternate-reverse;
}
@keyframes animate-pulse {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>