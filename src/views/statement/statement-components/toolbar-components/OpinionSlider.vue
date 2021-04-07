<template>
  <div class="bg-white border border-secondary p-2 mb-1">
    <div v-if="type !== -1" v-html="message" class="text-center py-2"></div>
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
    <div class="d-flex align-items-center justify-content-center">
      <div class="font-weight-bold" style="width: 100px">Impact</div>
      <div>
        <div class="" >
          <vue-slider
            v-model="impact"
            @click="hasImpactChanged = true"
            :min="minImpactLimit"
            :max="maxImpactLimit"
            :dot-options="{0: {disabled: true}, 100: {disabled: false}}"
            style="width:150px; margin-left:20px; margin-right:20px"
          />
          <div class="text-sm d-flex justify-content-between">
            <span v-if="minImpactLimit === -100" @click="impact = -100; hasImpactChanged = true" class="c-pointer float-left">Counter</span>
            <span @click="impact = 0; hasImpactChanged = true" class="c-pointer" >Neutral</span>
            <span v-if="maxImpactLimit === 100" @click="impact = 100; hasImpactChanged = true" class="c-pointer float-right">Supportive</span>
          </div>
        </div>
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
      confidence: 100,
      type: 0,
      typeDescriptions: OpinionHelper.typeDescriptions,
      user: Auth.user(),
      isLoading: false,
      isSuccess: false,
      minImpactLimit: -100,
      maxImpactLimit: 100,
      relationTypes: RelationTypeAPI.cachedDataLookUpById,
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
          statementToChange['user_opinions'].push(result['data'])
        }
        this.isSuccess = true
        setTimeout(() => {
          this.showImpactOpinionDialog = false
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
        switch(type * 1){
          case 1:
            this.impact = 0
            break
          case 2:
            this.impact = 0
          break
          case 3:
            if(typeof this.relationTypes[relationTypeId] !== 'undefined'){
              this.impact = (this.relationTypes[relationTypeId]['default_impact'] * 100).toFixed(0) * 1
            }
          break
        }
      }
    },
    selectedStatementData: {
      handler(){
        this.minImpactLimit = -100
        this.maxImpactLimit = 100
        this.impact = 0
        this.confidence = 100
        this.type = 0
        this.isPublic = false
        if(this.selectedStatementData){


          const relationTypeId = this.selectedStatementData['relation_type_id']
          if(typeof this.relationTypes[relationTypeId] !== 'undefined'){
            const defaultImpact = this.relationTypes[relationTypeId]['default_impact'] * 1
            if(defaultImpact === 0){
              this.minImpactLimit = 0
              this.maxImpactLimit = 0
            }else if(defaultImpact < 0){
              this.minImpactLimit = -100
              this.maxImpactLimit = 0
            }else if(defaultImpact > 0){
              this.minImpactLimit = 0
              this.maxImpactLimit = 100
            }
          }
          if(typeof this.selectedStatementData['user_opinion'] !== 'undefined' && this.selectedStatementData['user_opinion']){
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
            setTimeout(() => {
              this.impact = (impactAmount * 100).toFixed(0) * 1
            }, 200)
          }

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
      return OpinionHelper.convertToMessage(this.type, this.confidence / 100, this.impact / 100)
    },
    isVirtualRelation(){
      return this.selectedStatementData && this.selectedStatementData['is_virtual_relation']
    },
    hasUserOpinion(){
      return this.selectedStatementData && typeof this.selectedStatementData['user_opinion'] !== 'undefined' && this.selectedStatementData['user_opinion'] !== null
    },
  }
}
</script>
