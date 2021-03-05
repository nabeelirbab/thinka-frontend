<template>
  <span 
    @click.stop="toggleCheckbox" 
    class="c-pointer"
  >
    <fa v-if="modelValue" :icon="['far', 'check-square']" />
    <fa v-else :icon="['far', 'square']" />
  </span>
</template>
<script>
export default {
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  methods: {
    toggleCheckbox(){
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
}
</script>