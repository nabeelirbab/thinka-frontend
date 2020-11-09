<template>
  <div :class="isPositiveStatement ? 'positive-statement' : 'negative-statement'" class="d-flex align-items-center statement-radius mb-1 border-width border-dark p-2 px-2" :style="{'padding-left': (((level - 1) * 20) + 8)+ 'px!important'}">
    <div>
      <select class="border border-danger rounded bg-transparent text-danger font-weight-bold">
        <option>+</option>
        <option>-</option>
        <option>&</option>
        <option>^</option>
        <option>*</option>
      </select>
    </div>
    <textarea class="w-100 bg-transparent border-0 ml-2" placeholder="Type your statement here..." rows="3"></textarea>
    <div class="mx-2">
      <button class="btn btn-success "><fa icon="save" /></button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isPositiveStatement: Boolean,
    level: Number
  }
}
</script>
<style scoped>
textarea:focus {
  border: none!important
}
</style>