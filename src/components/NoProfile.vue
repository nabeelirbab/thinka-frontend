<template>
  <label 
    class="bg-secondary rounded-circle text-center mb-0 text-white font-weight-bold" 
    style="width: 1.7em; height: 1.8em; position:absolute; padding-top:0.1em"
  > 
    {{nameInitial}}
  </label>
  <label style="width: 1.8em;">&nbsp;</label>
</template>
<script>
export default {
  props: {
    name: String
  },
  computed: {
    nameInitial(){
      return this.name[0]
    }
  }
}
</script>