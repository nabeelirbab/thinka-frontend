<template>
  <div class="">
    <div class="text-center">
      <button
        @click="tryChangeOpinion(0)"
        :class="selectedOpinionType === 0 ? 'bg-success text-white' : 'bg-white text-primary'"
        title="No Opinion"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="flag" />
      </button>
      <button
        @click="tryChangeOpinion(1)"
        :class="selectedOpinionType === 1 ? 'bg-success text-white' : 'bg-white text-primary'"
        title="Statement is False"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="thumbs-down" />
      </button>
      <button
        @click="tryChangeOpinion(2)"
        :class="selectedOpinionType === 2 ? 'bg-success text-white' : 'bg-white text-primary'"
        title="Statement is True but has no impact"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="hand-point-down" rotation="180" />
      </button>
      <button
        @click="tryChangeOpinion(3)"
        :class="selectedOpinionType === 3 ? 'bg-success text-white' : 'bg-white text-primary'"
        title="Statement is True and has Impact"
        class="opinionButton btn btn-circle mx-1 shadow-none"
      >
        <fa icon="thumbs-up" />
      </button>
    </div>
    <Prompt ref="prompt" />
  </div>
</template>
<script>
import Prompt from '@/components/Prompt'
import Opinion from '@/api/opinion'
export default {
  components: {
    Prompt
  },
  props: {
    relation: Object
  },
  data(){
    return {
      userOpinion: {},
      selectedOpinionType: -1
    }
  },
  methods: {
    tryChangeOpinion(type){
      const typeDescription = [
        'I have no Opinion',
        'Statement is False',
        'Statement is True but has no Impact',
        'Statement is True and has Impact'
      ]
      this.$refs.prompt._open(
        `You are about to change your opinion to: <p class="font-italic text-center font-weight-bold">"${typeDescription[type]}"</p>`,
        [{
          label: 'Proceed',
          class: 'btn btn-success',
          close_on_click: false,
          callback: () => {
            this.changeOpinion(type)
          }
        }],
        'Set Opinion'
      )
    },
    changeOpinion(type){
      this.selectedOpinionType = type
      Opinion.create({
        type: type,
        relation_id: this.relation['id']
      }).then(result => {
        console.log('result', result)
      })
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