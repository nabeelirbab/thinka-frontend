<template>
  <div class="bg-white border border-secondary p-2 mb-1">
    <div class="d-flex align-items-center justify-content-center">
      <div class="font-weight-bold mr-3" style="width: 100px">Opinion</div>
      <div >
        <Opinion 
          v-if="selectedStatementData"
          @change="type=$event"
          :relation="selectedStatementData"
          :type-descriptions="typeDescriptions"
        />
      </div>
      <div class="mx-1 text-right" style="width: 75px!important"></div>
    </div>
    <div class="d-flex align-items-center justify-content-center ">
      <div class="pr-3 font-weight-bold">Confidence</div>
      <div class="text-center">
        <vue-slider v-model="confidence" :min="0" :max="100" style="width:150px; margin-left:20px; margin-right:20px"/>
        <div class="text-center text-sm">
          <span class="float-left">0%</span>
          <span class="float-right">100%</span>
        </div>
      </div>
      <div class="mx-1 text-right" style="width: 75px!important">
        <!-- {{(confidence).toFixed(0)}}% -->
        <button
          v-if="user && selectedStatementData && user['id'] * 1 === selectedStatementData['user_id'] * 1"
          :disabled="isLoading || confidence === null"
          @click="save" class="btn text-success p-1"
        >
          <!-- <fa v-if="isLoading" icon="spinner" spin />
          <fa v-else icon="check" /> -->
        </button>
      </div>
    </div>
    <div v-if="type !== -1" class="text-center py-2">
      "{{typeDescriptions[type]}}
      <span v-if="type">
        and I'm <em>{{(confidence).toFixed(0)}}%</em> confident about it
      </span>"
    </div>
    <div class="text-center">
      <fa v-if="isLoading" icon="spinner" spin />
      <button v-else class="btn btn-success"><fa icon="check" /> Save</button>
    </div>
    <Prompt ref="prompt" />
  </div>
</template>
<script>
import 'vue-slider-component/theme/antd.css'
import VueSlider from 'vue-slider-component'
import GlobalData from '@/views/statement/global-data'
import Opinion from './Opinion'
import OpinionAPI from '@/api/opinion'
import Prompt from '@/components/Prompt'
import Auth from '@/core/auth'
// import RelationAPI from '@/api/relation'
export default {
  components: {
    VueSlider,
    Opinion,
    Prompt
  },
  data(){
    return {
      confidence: 0,
      type: -1,
      typeDescriptions: [
        'I have No Opinion',
        'I think Statement is False',
        'I think Statement is True but has no impact',
        'I think Statement is True and has Impact'
      ],
      user: Auth.user(),
      isLoading: false,
      ...GlobalData,
    }
  },
  methods: {
    // tryChangeOpinion(type){
    //   this.$refs.prompt._open(
    //     `You are about to change your opinion to: <p class="font-italic text-center font-weight-bold">"${typeDescription[type]}"</p>`,
    //     [{
    //       label: 'Proceed',
    //       class: 'btn btn-success',
    //       close_on_click: false,
    //       callback: () => {
    //         this.changeOpinion(type)
    //       }
    //     }],
    //     'Set Opinion'
    //   )
    // },
    changeOpinion(type){
      this.selectedOpinionType = type
      OpinionAPI.create({
        type: type,
        relation_id: this.relation['id']
      }).then(result => {
        console.log('result', result)
      })
    }
  },
  watch: {
    selectedStatementData: {
      handler(){
        if(this.selectedStatementData){
          this.impact = this.selectedStatementData['impact_amount'] * 100
          this.isPublic = this.selectedStatementData['published_at']
        }else{
          this.impact = null
          this.isPublic = false
        }
      },
      immediate: true
    }
  }
}
</script>
