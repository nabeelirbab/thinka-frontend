<template>
  <fa v-if="type * 1 === 0" :icon="['far', 'flag']" />
  <fa v-else-if="type * 1 === 1" :icon="['far', 'thumbs-down']" />
  <fa v-else-if="type * 1 === 2" :icon="['far', 'hand-point-down']" rotation="180" />
  <fa v-else-if="type * 1 === 3" :icon="['far', 'thumbs-up']" />
</template>
<script>
export default {
  props: {
    type: [String, Number]
  }
}
</script>
