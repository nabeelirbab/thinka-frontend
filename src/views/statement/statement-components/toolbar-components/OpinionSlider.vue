<template>
  <div class="bg-white border border-secondary p-2 mb-1">
    <div class="d-flex align-items-center justify-content-center">
      <div class="font-weight-bold" style="width: 100px">Impact</div>
      <div>
        <div class="text-center" >
          <vue-slider 
            v-model="impact"
            @click="hasImpactChanged = true"
            :min="-100" 
            :max="100"
            :dot-options="{0: {disabled: true}, 100: {disabled: false}}"
            style="width:150px; margin-left:20px; margin-right:20px"
          />
          <div class="text-center text-sm">
            <span @click="impact = -100" class="c-pointer float-left">Disproving</span>
            <span @click="impact = -0" class="c-pointer mx-auto" >Neutral</span>
            <span @click="impact = 100" class="c-pointer float-right">Proving</span>
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
        <div v-if="type" class="text-center text-sm">
          <span @click="confidence = 0" class="c-pointer float-left">0%</span>
          <span @click="confidence = 100" class="c-pointer float-right">100%</span>
        </div>
      </div>
      <div class="mx-1 text-right" style="width: 75px!important">
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
import RelationTypeAPI from '@/api/relation-type'
export default {
  components: {
    VueSlider,
    Opinion,
    Prompt
  },
  data(){
    return {
      impact: 0,
      hasImpactChanged: false,
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
    type(type){ // 1 - thumbsdown, 2 - point up, 3 - thumbs up
      if(type <= 0){
        this.confidence = 0
      }
      if(!this.hasImpactChanged && this.selectedStatementData && !this.hasUserOpinion){ // setting default impact if no user opinion yet or impact slider is not yet manually set
        const relationTypeId = this.selectedStatementData['relation_type_id']
        console.log('type', type, relationTypeId)
        switch(type * 1){
          case 1:
            this.impact = 0
            break
          case 2:
            this.impact = 100
            this.confidence = 100
          break
          case 3:
            if(typeof RelationTypeAPI.cachedDataLookUpById.value[relationTypeId] !== 'undefined'){
              console.log('default_impact', RelationTypeAPI.cachedDataLookUpById.value[relationTypeId]['default_impact'])
              this.impact = (RelationTypeAPI.cachedDataLookUpById.value[relationTypeId]['default_impact'] * 100).toFixed(0) * 1
            }
          break
        }
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
        this.hasImpactChanged = false
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
    },
    hasUserOpinion(){
      return this.selectedStatementData && this.selectedStatementData['user_opinion'] !== null
    }
  }
}
</script>
