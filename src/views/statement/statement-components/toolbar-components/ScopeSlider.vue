<template>
  <div class=" bg-white border border-secondary p-2 mb-1 pb-4">
    <div class="d-flex align-items-center justify-content-center">
      <div class="pr-3 font-weight-bold">Scope</div>
      <div class="text-center mr-2 flex-fill">
        <vue-slider v-model="scope" :disabled="isLoading" :v-data="scopes" :marks="true" :hide-label="true" data-value="id" data-label="description" />
      </div>
      <button v-if="user && user['id'] * 1 === selectedStatementData['user_id'] * 1" :disabled="isLoading || scope === null" @click="save" class="btn text-success p-1"><fa  :icon="isLoading ? 'spinner' : 'check'" :spin="isLoading" /></button>
    </div>
    <div class="text-nowrap text-center">
      <span v-if="scope > 0">{{scopes[findArrayIndex(scope, scopes, 'id')]['description']}}</span>
      <span v-else>Unspecified</span>
    </div>
  </div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import ScopeAPI from '@/api/scope'
import StatementAPI from '@/api/statement'
import GlobalData from '@/views/statement/global-data'
import Auth from '@/core/auth'
export default {
  components: {
    VueSlider
  },
  data(){
    return {
      isLoading: false,
      scope: null,
      isPublic: false,
      ...GlobalData,
      user: Auth.user()
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
