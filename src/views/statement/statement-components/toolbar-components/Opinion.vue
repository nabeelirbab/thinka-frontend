<template>
  <div class="">
    <div class="">
      <!-- <button
        @click="tryChangeOpinion(0)"
        :class="modelValue === 0 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[0]"
        :disabled="disabled"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <OpinionIcon type="0" />
      </button> -->
      
      
      <button
        @click="tryChangeOpinion(1)"
        :class="modelValue === 1 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[1]"
        :disabled="disabled"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <OpinionIcon type="1" />
      </button>
      <button
        @click="tryChangeOpinion(2)"
        :class="modelValue === 2 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[2]"
        :disabled="disabled"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <OpinionIcon type="2" />
      </button>
      <button
        @click="tryChangeOpinion(3)"
        :class="modelValue === 3 ? 'bg-primary text-white' : 'bg-white text-primary'"
        :title="typeDescriptions[3]"
        :disabled="disabled"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <OpinionIcon type="3" />
      </button>
    </div>
    
  </div>
</template>
<script>
import OpinionIcon from '@/views/statement/statement-components/sub-statement-components/OpinionIcon'
export default {
  components: {
    OpinionIcon
  },
  props: {
    modelValue: [Number],
    relation: Object,
    typeDescriptions: { // array of string containing the description for each opinion types
      type: Array,
      required: true
    },
    disabled: Boolean
  },
  emits: ['change', 'update:modelValue'],
  data(){
    return {
      userOpinion: {},
    }
  },
  methods: {
    tryChangeOpinion(type){
      this.$emit('update:modelValue', type)
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