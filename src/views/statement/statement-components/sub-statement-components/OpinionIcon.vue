<template>
  <fa v-if="type * 1 === 0" :icon="['far', 'flag']" />
  <fa v-else-if="type * 1 === 1" :icon="[user_type === 1 ? 'fas' : 'far', 'thumbs-down']" />
  <fa v-else-if="type * 1 === 2" :icon="[user_type === 2 ? 'fas' : 'far', 'hand-point-down']" rotation="180" />
  <fa v-else-if="type * 1 === 3" :icon="[user_type === 3 ? 'fas' : 'far', 'thumbs-up']" />
</template>
<script>
export default {
  props: {
    type: [String, Number],
    user_type: Number
  }
}
</script>
