<template>
  <div class=" bg-white border border-secondary p-2 mb-1">
    <div class="d-flex align-items-center justify-content-center">
      <div class="pr-3 font-weight-bold">Scope</div>
      <div class="text-center mr-2 flex-fill">
        <vue-slider v-model="scope" :disabled="isLoading" :v-data="scopes" :marks="true" :hide-label="true" data-value="id" data-label="description" />
        <div class="text-sm d-flex justify-content-between">
          <span @click="setScope('None')" class="c-pointer float-left">None</span>
          <span @click="setScope('Generally')" class="c-pointer" >Generally</span>
          <span @click="setScope('Total')" class="c-pointer float-right">Total</span>
        </div>
        <div class="text-nowrap text-center">
          <span v-if="scope > 0">{{scopes[findArrayIndex(scope, scopes, 'id')]['description']}}</span>
          <span v-else>Unspecified</span>
        </div>
      </div>
      
    </div>
    <div class="text-center pt-1">
      <button @click="showScope = false" :disabled="isLoading" class="btn btn-cancel"> Cancel</button>
      <button 
        v-if="user && selectedStatementData && user['id'] * 1 === selectedStatementData['user_id'] * 1"
        @click="save"
        :disabled="isLoading || scope === null" 
        class="btn btn-success"
      >
        <span v-if="isSuccess"><fa icon="check" /> Saved!</span>
        <span v-else-if="isLoading"><fa icon="spinner" :spin="isLoading" /> Saving</span>
        <span v-else><fa icon="check" /> Save</span>
      </button>
    </div>
  </div>
</template>
<script>
import VueSlider from 'vue-slider-component' // https://nightcatsama.github.io/vue-slider-component
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
      scope: null,
      isLoading: false,
      isSuccess: false,
      isPublic: false,
      ...GlobalData,
      user: Auth.user()
    }
  },
  methods: {
    setScope(description) {
        // set the scope filtering by the description 
        ScopeAPI.cachedData.value['data'].forEach(scope => {
          if (scope['description'] == description) this.scope = scope['id']
        })

    },
    save(){
      this.isLoading = true
      const param = {
        id: this.selectedStatementData['statement']['id'],
        scope_id: this.scope
      }
      StatementAPI.update(param).then(result => {
        if(result['data'] && this.selectedStatementId){
          this.selectedStatementData['statement']['scope_id'] = this.scope
          this.isSuccess = true
          setTimeout(() => {
            this.isSuccess = false
            this.showScope = false
          }, 500)
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
          console.log('this.selectedStatementData', this.selectedStatementData)
          let statement = this.selectedStatementData['virtual_relation'] ? this.selectedStatementData['virtual_relation']['statement'] : this.selectedStatementData['statement']
          this.scope = statement['scope_id']
          this.isPublic = statement['published_at']
        }else{
          this.scope = null
          this.isSuccess = false
          this.isPublic = false
        }
        console.log('selectedStatementData', this.selectedStatementData)
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
