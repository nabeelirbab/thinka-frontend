<template>
  <div class="d-flex align-items-center justify-content-center bg-white border border-secondary p-2 mb-1">
    <div class="pr-3 font-weight-bold">Opinion</div>
    <div class="text-center">
      <vue-slider v-model="opinion" :min="-100" :max="100" style="width:150px; margin-left:20px; margin-right:20px"/>
      <div class="text-center text-sm">
        <span class="float-left">Disagree</span>
        <span class="float-right">Agree</span>
      </div>
    </div>
    <div class="mx-1 text-right" style="width: 75px!important">
      {{(opinion).toFixed(0)}}%
      <button
        v-if="user && selectedStatementData && user['id'] * 1 === selectedStatementData['user_id'] * 1"
        :disabled="isLoading || opinion === null"
        @click="save" class="btn text-success p-1"
      >
        <fa v-if="isLoading" icon="spinner" spin />
        <fa v-else icon="check" />
      </button>
    </div>
  </div>
</template>
<script>
import 'vue-slider-component/theme/antd.css'
import VueSlider from 'vue-slider-component'
import GlobalData from '@/views/statement/global-data'
// import RelationAPI from '@/api/relation'
export default {
  components: {
    VueSlider
  },
  data(){
    return {
      opinion: 0,
      isLoading: false,
      ...GlobalData,
    }
  },
  methods: {
    save(){
      // this.isLoading = true
      // const param = {
      //   id: this.selectedStatementData['id'],
      //   impact_amount: this.impact / 100 // convert to decimal
      // }
      // RelationAPI.update(param).then(result => {
      //   if(result['data'] && this.selectedStatementId * 1 === result['data']['id']  * 1){
      //     this.selectedStatementData['opinion'] = this.impact / 100
      //   }
      // }).finally(() => {
      //   this.isLoading = false
      // })
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
