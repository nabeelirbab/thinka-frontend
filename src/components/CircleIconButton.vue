<template>
  <div class="text-center">
    <button 
      @click.stop="click"
      :class="(active ? 'btn-success' : buttonClass) + ' ' + (disabled ? 'disabled': '')" 
      :disabled="disabled" 
      class="btn btn-icon-circle btn-lg"
    >
      <fa :icon="icon" />
    </button> <br />
      {{text}}
  </div>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    text: String,
    buttonClass: {
      type: String,
      default: 'btn-primary'
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    click(){
      if(!this.disabled){
        this.$emit('click')
      }
    }
  }
}
</script>
<style>
.btn-icon-circle {
  font-size:1em;
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