<template>
  <span class="badge badge-pill px-2 text-uppercase" :style="{ 'background-color': statementTypeColor(statementTypeId) }">
    {{statementTypeDescription(statementTypeId)}}
  </span>
</template>
<script>
import StatementTypeAPI from '@/api/statement-type'
export default {
  props: {
    statementTypeId: Number
  },
  data(){
    return {
      statementTypeAPICache: StatementTypeAPI.cachedData
    }
  },
  methods: {
    statementTypeDescription(statementTypeId){
      if(typeof this.statementTypes[statementTypeId] !== 'undefined'){
        return this.statementTypes[statementTypeId]['description']
      }else{
        return ''
      }
    },
    statementTypeColor(statementTypeId){
      if(typeof this.statementTypes[statementTypeId] !== 'undefined'){
        return this.statementTypes[statementTypeId]['color']
      }else{
        return ''
      }
    }
  },
  computed: {
    statementTypes(){
      if(this.statementTypeAPICache && this.statementTypeAPICache.data){
        let statementTypes = {}
        this.statementTypeAPICache.data.forEach(statementType => {
          statementTypes[statementType['id']] = statementType
        })
        return statementTypes
      }else{
        return {}
      }
    }
  }
}
</script>