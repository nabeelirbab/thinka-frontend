<template>
  <fa v-if="type * 1 === 0" icon="flag" />
  <fa v-else-if="type * 1 === 1" icon="thumbs-down" />
  <fa v-else-if="type * 1 === 2" icon="hand-point-down" rotation="180" />
  <fa v-else-if="type * 1 === 3" icon="thumbs-up" />
</template>
<script>
export default {
  props: {
    type: [String, Number]
  }
}
</script>
