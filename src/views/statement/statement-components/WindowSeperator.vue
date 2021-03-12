<template>
  <div
    @touchstart="dragStart"
    @mousedown="dragStart"
    style1="{transform:'translate3d(' + 0 + 'px, ' + currentY + 'px, 0)'}"
    class="separator py-2"
  >
    <div :class="active ? 'bg-dark' : 'bg-secondary'" style="height:2px"></div>
  </div>
</template>
<script>
export default {
  props: {
    yRange: Number
  },
  emits: ['move'],
  mounted(){
    window.addEventListener('touchend', this.dragEnd, false)
    window.addEventListener('mouseup', this.dragEnd, false)
    window.addEventListener('touchmove', this.drag, false)
    window.addEventListener('mousemove', this.drag, false)
  },
  unmounted(){
    window.removeEventListener('touchend', this.dragEnd)
    window.removeEventListener('mouseup', this.dragEnd)
    window.removeEventListener('touchmove', this.drag)
    window.removeEventListener('mousemove', this.drag)
  },
  data(){
    return {
      active: false,
      initialY: 0,
      initialX: 0,
      yOffset: 0
    }
  },
  methods: {
    _setOffset(value){
      this.yOffset = value
    },
    _getYOffset(){
      return this.yOffset
    },
    dragStart(e) {
      if (e.type === "touchstart") {
        this.initialY = e.touches[0].clientY - this.yOffset
      } else {
        this.initialY = e.clientY - this.yOffset
      }
      this.active = true;
    },
    drag(e) {
      const currentY = (e.type === "touchmove") ? e.touches[0].clientY - this.initialY : e.clientY - this.initialY
      if (this.active && currentY >= (this.windowHeight * -1) && currentY <= this.windowHeight) {
        this.yOffset = currentY;
      }
    },
    dragEnd() {
      if(this.active){
        this.initialY = this.yOffset
        this.active = false
      }
    }
  },
  watch: {
    yOffset(){
      this.$emit('move', this.yOffset)
    }
  },
  computed: {
    windowHeight(){
      return this.yRange / 2
    }
  }
}
</script>
<style scoped>
.separator {
  cursor: n-resize
}
</style>
