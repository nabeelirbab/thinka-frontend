<template>
  <div class="d-flex align-items-center justify-content-center bg-white border border-secondary p-2 mb-1 pb-4">
    <div class="pr-3 font-weight-bold">Scope</div>
    <div class="text-center mr-2" style="width:250px">
      <vue-slider v-model="scope" :disabled="isLoading" :v-data="scopes" :marks="true" :hide-label="true" data-value="id" data-label="description" />
    </div>
    <div class="text-nowrap" style="width:26px">
      <span v-if="scope > 0" class='mr-2'>{{scopes[findArrayIndex(scope, scopes, 'id')]['description']}}</span>
      <button v-if="scope !== null" :disabled="isLoading" @click="save" class="btn text-success p-1"><fa  :icon="isLoading ? 'spinner' : 'check'" :spin="isLoading" /></button>
    </div>
  </div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import ScopeAPI from '@/api/scope'
import StatementAPI from '@/api/statement'
import GlobalData from '@/views/statement/global-data'
export default {
  components: {
    VueSlider
  },
  data(){
    return {
      isLoading: false,
      scope: null,
      isPublic: false,
      ...GlobalData
    }
  },
  methods: {
    save(){
      this.isLoading = true
      const param = {
        id: this.selectedStatementId,
        scope_id: this.scope
      }
      StatementAPI.update(param).then(result => {
        if(result['data'] && this.selectedStatementId){
          this.selectedStatementData['statement']['scope_id'] = this.scope
        }
      }).finally(() => {
        this.isLoading = false
      })
    }
  },
  watch: {
    selectedStatementId: {
      handler(){
        if(this.selectedStatementData){
          this.scope = this.selectedStatementData['statement']['scope_id']
          this.isPublic = this.selectedStatementData['statement']['is_public']
        }else{
          this.scope = null
          this.isPublic = false
        }
      },
      immediate: true
    }
  },
  computed: {
    scopes(){
      let scopes = []
      ScopeAPI.cachedData.value['data'].forEach(scope => {
        scopes.push(scope['description'])
      })
      return ScopeAPI.cachedData.value['data']
    }
  }
}
</script>
