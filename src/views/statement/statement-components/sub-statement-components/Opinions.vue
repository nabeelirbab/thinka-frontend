<template>
  <div :class="isHorizontal ? 'd-flex' : ''" class="text-center pb-1">
    <div :class="userOpinionType === 3 ? 'text-primary' : '' " class="text-nowrap flex-fill pl-1">
      <OpinionIcon type="3" /> {{counts[3]}}
    </div>
    <div :class="userOpinionType === 2 ? 'text-primary' : '' " class="text-nowrap flex-fill pl-1">
      <OpinionIcon type="2" /> {{counts[2]}}
    </div>
    <div :class="userOpinionType === 1 ? 'text-primary' : '' " class="text-nowrap flex-fill pl-1">
      <OpinionIcon type="1" /> {{counts[1]}}
    </div>
  </div>
</template>
<script>
import OpinionIcon from './OpinionIcon'
export default {
  components: {
    OpinionIcon
  },
  props: {
    userOpinions: Array,
    userOpinionType: {
      type: Number,
      default: -1
    },
    isHorizontal: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      counts: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
      }
    }
  },
  watch: {
    userOpinions: {
      handler(userOpinions){
        this.counts[0] = 0
        this.counts[1] = 0
        this.counts[2] = 0
        this.counts[3] = 0
        userOpinions.forEach(userOpinion => {
          this.counts[userOpinion['type']] += 1
        })
      },
      immediate: true
    }
  },
  computed: {
    type0Count(){

      return 0
    },
    type1Count(){
      return 1
    },
    type2Count(){
      return 12
    },
    type3Count(){
      return 123
    }
  }
}
</script>