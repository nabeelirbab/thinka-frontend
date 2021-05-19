<template>
  <div class="">
    <span :class="userOpinionType === 3 ? 'text-dark' : 'text-primary'"><OpinionIcon type="3" :user-type="userOpinionType"  />
      <span class="ml-1 mr-2">{{counts[3]}}</span></span>
    <span :class="userOpinionType === 2 ? 'text-dark' : 'text-primary'"><OpinionIcon type="2" :user-type="userOpinionType"  />
      <span class="ml-1 mr-2">{{counts[2]}}</span></span>
    <span :class="userOpinionType === 1 ? 'text-dark' : 'text-primary'"><OpinionIcon type="1" :user-type="userOpinionType" />
      <span class="ml-1 mr-2">{{counts[1]}}</span></span>
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
      deep: true,
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