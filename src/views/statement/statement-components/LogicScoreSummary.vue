<template>
  <div @click="showUserList" class="">
    <span class="mr-1">
      <fa icon="flag" :class="'text-' + flagColor[1]" /> {{counts[1]}}
    </span>
    <span class="mr-1">
      <fa :icon="['far', 'flag']"  /> {{counts[0]}}
    </span>
    <span class="mr-1">
      <fa icon="flag" :class="'text-' + flagColor[2]" /> {{counts[2]}}
    </span>
    <span class="mr-1">
      <fa icon="flag" :class="'text-' + flagColor[3]" /> {{counts[3]}}
    </span>
  </div>
  <modal ref="modal" title="User Logic Scores" :closeabled="true">
    <div v-if="Object.keys(userStatementLogicScores).length">
      <template v-for="userStatementLogicScore in userStatementLogicScores">
        <div class="d-flex">
          <div class="flex-fill">{{userStatementLogicScore['user']['username']}}</div>
          <div class="pr-2 text-right">{{(userStatementLogicScore['final_score'] * 100).toFixed(0)}}%</div>
          <div>
            <fa v-if="userStatementLogicScore['flag'] === 0" :icon="['far', 'flag']" />
            <fa v-else :class="'text-' + flagColor[userStatementLogicScore['flag']]" icon="flag" />
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      No opinions
    </div>
  </modal>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
export default {
  components: {
    Modal
  },
  props: {
    userStatementLogicScores: Object,
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
      },
      flagColor: {
        1: 'info',
        2: 'dark',
        3: 'danger',
      }
    }
  },
  methods: {
    showUserList(){
      this.$refs.modal._open()
    }
  },
  watch: {
    userStatementLogicScores: {
      handler(userStatementLogicScores){
        console.log('userStatementLogicScores', userStatementLogicScores)
        this.counts[0] = 0
        this.counts[1] = 0
        this.counts[2] = 0
        this.counts[3] = 0
        for(let userId in userStatementLogicScores){
          this.counts[userStatementLogicScores[userId]['flag']] += 1
        }
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