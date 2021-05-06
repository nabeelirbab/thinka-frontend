<template>
  <span v-if="type * 1 === 0">
    <fa  :icon="['far', 'flag']" />
  </span>
  <span v-else-if="type * 1 === 1" >
    <fa  v-if="userType === 1" :icon="['fas', 'thumbs-down']" />
    <fa  v-else :icon="['far', 'thumbs-down']" />
  </span>
  <span v-else-if="type * 1 === 2" >
    <fa  v-if="userType === 2" :icon="['fas', 'hand-point-down']" />
    <fa  v-else :icon="['far', 'hand-point-down']" rotation="180" />
  </span>
  <span v-else-if="type * 1 === 3" >
    <fa  v-if="userType === 3" :icon="['fas', 'thumbs-up']" />
    <fa  v-else :icon="['far', 'thumbs-up']" />
  </span>
</template>
<script>
export default {
  props: {
    type: [String, Number],
    userType: Number
  }
}
</script>
