<template>
  <div class="d-flex align-items-center justify-content-center bg-white border border-secondary p-2 mb-1">
    <div class="pr-3 font-weight-bold">Impact</div>
    <div class="text-center" >
      <vue-slider v-model="impact" :min="-100" :max="100" style="width:150px; margin-left:20px; margin-right:20px"/>
      <div class="text-center text-sm">
        <span class="float-left">Disproving</span>
        <!-- <span class="mx-auto" style="position:absolute">None</span> -->
        <span class="float-right">Proving</span>
      </div>
    </div>
    <div class="mx-1 text-right" style="width: 75px!important">
      {{impact}}%
      <button
        v-if="user && selectedStatementData && user['id'] * 1 === selectedStatementData['user_id'] * 1"
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
import RelationAPI from '@/api/relation'
export default {
  components: {
    VueSlider
  },
  data(){
    return {
      impact: 0,
      isLoading: false,
      isPublic: false,
      ...GlobalData,
      user: Auth.user()
    }
  },
  methods: {
    save(){
      this.isLoading = true
      const param = {
        id: this.selectedStatementData['id'],
        impact_amount: this.impact
      }
      RelationAPI.update(param).then(result => {
        if(result['data'] && this.selectedStatementId * 1 === result['data']['id']  * 1){
          this.selectedStatementData['impact_amount'] = this.impact
        }
      }).finally(() => {
        this.isLoading = false
      })
    }
  },
  watch: {
    selectedStatementData: {
      handler(){
        if(this.selectedStatementData){
          this.impact = this.selectedStatementData['impact_amount']
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
