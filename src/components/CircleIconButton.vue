<template>
  <div class="text-center">
    <button :class="active ? 'btn-success' : 'btn-primary'" class="btn-icon-circle btn-lg">
      <fa :icon="icon" />
    </button> <br />
      {{text}}
  </div>
</template>
<script>
export default {
  props: {
    icon: String,
    text: String,
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style>
.btn-icon-circle {
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