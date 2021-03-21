<template>
  <div class="bg-white border border-secondary p-2 mb-1">
    <div class="d-flex align-items-center justify-content-center">
      <div class="font-weight-bold" style="width: 100px">Impact</div>
      <div>
        <div class="text-center" >
          <vue-slider 
            v-model="impact" 
            :min="-100" 
            :max="100"
            :disabled="(isVirtualRelation) ? true : false"
            :dot-options="{0: {disabled: true}, 100: {disabled: false}}"
            style="width:150px; margin-left:20px; margin-right:20px"
          />
          <div class="text-center text-sm">
            <span class="float-left">Disproving</span>
            <!-- <span class="mx-auto" style="position:absolute">None</span> -->
            <span class="float-right">Proving</span>
          </div>
        </div>
      </div>
      <div class="mx-1 text-right" style="width: 75px!important"></div>
    </div>
    <div class="d-flex align-items-center justify-content-center">
      <div class="font-weight-bold " style="width: 100px">Opinion</div>
      <div >
        <Opinion 
          v-if="selectedStatementData"
          v-model="type"
          :relation="selectedStatementData"
          :type-descriptions="typeDescriptions"
          :disabled="isLoading"
          class="text-center"
          style="width:190px"
        />
      </div>
      <div class="mx-1 text-right" style="width: 75px!important"></div>
    </div>
    <div class="d-flex align-items-center justify-content-center ">
      <div class="font-weight-bold" style="width: 100px">Confidence</div>
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
      impact: 0,
      confidence: 0,
      type: 0,
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
      let param = {
        relation_id: this.selectedStatementId,
        confidence: this.confidence / 100,
        impact_amount: this.impact / 100,
      }
      if(this.type){
        param['type'] = this.type
      }
      OpinionAPI.create(param).then(result => {
        if(typeof statementToChange['user_opinions'] === 'undefined'){
          statementToChange['user_opinions'] = []
        }
        if(result['data']){
          if(statementToChange){
            let previousUserOpinionId = statementToChange['user_opinion'] ? statementToChange['user_opinion']['id'] * 1 : null
            statementToChange['user_opinion'] = {
              type: param['type'],
              confidence: (param['confidence']).toFixed(4),
              ...result['data']
            }
            if(previousUserOpinionId){
              statementToChange['user_opinions'] = statementToChange['user_opinions'].filter(userOpinion => {
                return userOpinion['id'] * 1 !== previousUserOpinionId
              })
            }
          }
          console.log('user_opinions', statementToChange['user_opinions'])
          statementToChange['user_opinions'].push(result['data'])
        }
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

          let impactAmount = 0
          for(let x = 0; x < this.selectedStatementData['user_opinions'].length; x++){
            if(this.selectedStatementData['user_opinions'][x]['user_id'] * 1 === this.user.id){
              impactAmount =  this.selectedStatementData['user_opinions'][x]['impact_amount']
              break
            }
          }
          this.impact = (impactAmount * 100).toFixed(0) * 1
        }else{
          this.confidence = 0
          this.type = 0
          this.isPublic = false
          this.impact = 0
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
