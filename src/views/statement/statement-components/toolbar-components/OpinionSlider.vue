<template>
  <div class="bg-white border border-secondary p-2 mb-1">
    <div class="d-flex align-items-center justify-content-center">
      <div class="font-weight-bold mr-3" style="width: 100px">Opinion</div>
      <div>
        <Opinion 
          v-if="selectedStatementData"
          v-model="type"
          :relation="selectedStatementData"
          :type-descriptions="typeDescriptions"
          :disabled="isLoading"
        />
      </div>
      <div class="mx-1 text-right" style="width: 75px!important"></div>
    </div>
    <div class="d-flex align-items-center justify-content-center ">
      <div class="pr-3 font-weight-bold">Confidence</div>
      <div class="text-center">
        <vue-slider 
          v-model="confidence"
          :disabled="type <= 0 || isLoading"
          :min="0" 
          :max="100" 
          style="width:150px; margin-left:20px; margin-right:20px"
        />
        <div class="text-center text-sm">
          <span class="float-left">0%</span>
          <span class="float-right">100%</span>
        </div>
      </div>
      <div class="mx-1 text-right" style="width: 75px!important">
        <!-- {{(confidence).toFixed(0)}}% -->
        <!-- <button
          v-if="user && selectedStatementData && user['id'] * 1 === selectedStatementData['user_id'] * 1"
          :disabled="isLoading || confidence === null"
          @click="save" class="btn text-success p-1"
        >
          <fa v-if="isLoading" icon="spinner" spin />
          <fa v-else icon="check" />
        </button> -->
      </div>
    </div>
    <div v-if="type !== -1" v-html="message" class="text-center py-2">
      
    </div>
    <div class="text-center">
      <fa v-if="isLoading" icon="spinner" spin />
      <span v-else-if="isSuccess" class="text-success">Saved!</span>
      <button v-else @click="changeOpinion" :disabled="isLoading" class="btn btn-success"><fa icon="check" /> Save</button>
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
import OpinionHelper from '@/helpers/opinion'
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
      typeDescriptions: OpinionHelper.typeDescriptions,
      user: Auth.user(),
      isLoading: false,
      isSuccess: false,
      ...GlobalData,
    }
  },
  methods: {
    // tryChangeOpinion(type){
    //   this.$refs.prompt._open(
    //     `You are about to change your opinion to: <p class="font-italic text-center font-weight-bold ">"${typeDescription[type]}"</p>`,
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
    changeOpinion(){
      this.isLoading = true
      let statementToChange = this.selectedStatementData
      const param = {
        type: this.type,
        relation_id: this.selectedStatementId,
        confidence: this.confidence / 100
      }
      console.log('before statementToChange', statementToChange)
      OpinionAPI.create(param).then(result => {
        if(result['data']){
          statementToChange['user_opinion'] = {
            type: param['type'],
            confidence: (param['confidence']).toFixed(4),
            ...result['data']
          }
        }
        console.log('result', result['data'])
        console.log('after', statementToChange)
        this.isSuccess = true
        setTimeout(() => {
          this.isSuccess = false
        }, 700)
      }).finally(() => {
        this.isLoading = false
      })
    }
  },
  watch: {
    type(type){
      if(type <= 0){
        this.confidence = 0
      }
    },
    selectedStatementData: {
      handler(){
        if(this.selectedStatementData && typeof this.selectedStatementData['user_opinion'] !== 'undefined' && this.selectedStatementData['user_opinion']){
          this.type = this.selectedStatementData['user_opinion']['type']
          this.confidence = this.selectedStatementData['user_opinion']['confidence'] * 100
          this.isPublic = this.selectedStatementData['published_at']
        }else{
          this.confidence = 0
          this.type = -1
          this.isPublic = false
        }
        this.isSuccess = false
      },
      immediate: true
    }
  },
  computed: {
    message(){
      if(typeof this.type === -1){
        return 'Select an opinion'
      }
      return OpinionHelper.convertToMessage(this.type, this.confidence / 100)
    },
    isVirtualRelation(){
      return this.selectedStatementData && this.selectedStatementData['is_virtual_relation']
    }
  }
}
</script>
