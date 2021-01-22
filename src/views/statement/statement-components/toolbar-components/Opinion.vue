<template>
  <div class="">
    <div class="">
      <button
        @click="tryChangeOpinion(0)"
        :class="selectedOpinionType === 0 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[0]"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="flag" />
      </button>
      <button
        @click="tryChangeOpinion(1)"
        :class="selectedOpinionType === 1 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[1]"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="thumbs-down" />
      </button>
      <button
        @click="tryChangeOpinion(2)"
        :class="selectedOpinionType === 2 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[2]"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="hand-point-down" rotation="180" />
      </button>
      <button
        @click="tryChangeOpinion(3)"
        :class="selectedOpinionType === 3 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[3]"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="thumbs-up" />
      </button>
    </div>
    
  </div>
</template>
<script>


export default {
  components: {
  },
  props: {
    relation: Object,
    typeDescriptions: { // array of string containing the description for each opinion types
      type: Array,
      required: true
    } 
  },
  emits: ['change'],
  data(){
    return {
      userOpinion: {},
      selectedOpinionType: -1
    }
  },
  methods: {
    tryChangeOpinion(type){
      this.selectedOpinionType = type
      this.$emit('change', type)
    }
  },
  watch: {
    relation: {
      handler(relation){
        if(typeof relation ==='undefined' || typeof relation['user_opinion'] === 'undefined'){
          this.selectedOpinionType = -1
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style scoped>
.opinionButton {
  height: 35px;
  width: 35px;
}
</style>