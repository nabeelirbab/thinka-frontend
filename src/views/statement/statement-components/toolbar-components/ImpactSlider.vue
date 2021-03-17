<template>
  <div class="d-flex align-items-center justify-content-center bg-white border border-secondary p-2 mb-1">
    <div class="pr-3 font-weight-bold">Impact</div>
    <div class="text-center" >
      <vue-slider 
        v-model="impact" 
        :min="-100" 
        :max="100"
        :disblaed="isVirtualRelation"
        style="width:150px; margin-left:20px; margin-right:20px"
      />
      <div class="text-center text-sm">
        <span class="float-left">Disproving</span>
        <!-- <span class="mx-auto" style="position:absolute">None</span> -->
        <span class="float-right">Proving</span>
      </div>
    </div>
    <div class="mx-1 text-right" style="width: 75px!important">
      {{(impact).toFixed(0)}}%
      <button
        :disabled="isLoading || impact === null"
        @click="save" class="btn text-success p-1"
      >
        <fa v-if="isLoading" icon="spinner" spin />
        <fa v-else icon="check" />
      </button>
    </div>
  </div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import Auth from '@/core/auth'
import GlobalData from '@/views/statement/global-data'
import OpinionAPI from '@/api/opinion'
export default {
  components: {
    VueSlider
  },
  data(){
    return {
      impact: 0,
      isLoading: false,
      ...GlobalData,
      user: Auth.user()
    }
  },
  methods: {
    save(){
      this.isLoading = true
      let selectedStatementData = this.selectedStatementData
      const param = {
        relation_id: selectedStatementData['id'],
        impact_amount: this.impact / 100 // convert to decimal
      }
      OpinionAPI.post('/change-impact', param).then(result => {
        if(result['data']){
          if(typeof selectedStatementData['user_opinions'] === 'undefined'){
            selectedStatementData['user_opinions'] = []
          }
          selectedStatementData['user_opinions'] = selectedStatementData['user_opinions'].filter(userOpinion => {
            if(userOpinion['user_id'] !== this.user.id){
              return true
            }else{
              return null
            }
          })
          selectedStatementData['user_opinions'].push(result['data'])
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    // save(){
    //   this.isLoading = true
    //   const param = {
    //     id: this.selectedStatementData['id'],
    //     impact_amount: this.impact / 100 // convert to decimal
    //   }
    //   RelationAPI.update(param).then(result => {
    //     if(result['data'] && this.selectedStatementId * 1 === result['data']['id']  * 1){
    //       this.selectedStatementData['impact_amount'] = this.impact / 100
    //     }
    //   }).finally(() => {
    //     this.isLoading = false
    //   })
    // },
  },
  watch: {
    selectedStatementData: {
      handler(){
        if(this.selectedStatementData && typeof this.selectedStatementData['user_opinions'] !== 'undefined'){
          let impactAmount = 0
          for(let x = 0; x < this.selectedStatementData['user_opinions'].length; x++){
            if(this.selectedStatementData['user_opinions'][x]['user_id'] * 1 === this.user.id){
              impactAmount =  this.selectedStatementData['user_opinions'][x]['impact_amount']
              break
            }
          }
          this.impact = impactAmount * 100
        }else{
          this.impact = 0
        }
      },
      immediate: true
    }
  },
  computed: {
    isVirtualRelation(){
      return this.selectedStatementData && this.selectedStatementData['is_virtual_relation']
    }
  }
}
</script>
