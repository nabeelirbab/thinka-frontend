<template>
  <div :class="size ? 'size-' + size : ''" class="font-weight bold text-nowrap">
    <fa v-if="points >= 50" icon="thumbs-up" class="text-success" /> 
    <fa v-else icon="thumbs-down" class="text-danger" />
    <span class="text-dark">{{points}}</span> 
    
  </div>
</template>
<script>
export default {
  props: {
    points: Number,
    hasIcon: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: null
    }
  }
}
</script>
<style>
  .size-lg {
    font-size: 1.5em
  }
</style>
