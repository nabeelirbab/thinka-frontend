<template>
  <div class="w-100 py-2">
    <div class="d-flex mb-1">
      <div class="flex-fill text-uppercase">
        <span class="badge badge-pill bg-pastel-pink" >
          {{statementTypeDescription(statementTypeId)}}
        </span>
        <span v-if="hasPublishedAt"  class="pl-2">
          <fa v-if="relation['published_at']" icon="sun" />
          <fa v-else icon="briefcase" />
        </span>
      </div>
      <small class="text-light">{{timeSince(relation['updated_at'])}}</small>
    </div>
    <div class="d-flex w-100" >
      <div class="pr-1 text-primary">
        <fa v-if="parentRelationId" icon=leaf />
        <fa v-else icon=tree />
      </div>
      <div class="flex-fill text-break">
        <router-link
          :to="'/branch/' + relation['id'] + '/t/' + toKebabCase((relation['text']).slice(0,30))"
          class="text-dark"
        >
          {{relation['text']}}
        </router-link>
      </div>
    </div>
    <div v-if="relation['root_parent_statement_text']" class="mt-2 px-3">
      <div class="bg-light p-2 rounded text-sm">
        <fa icon="tree" class="mr-2" />
        {{relation['root_parent_statement_text']}}
      </div>
    </div>
  </div>
</template>
<script>
import StatementTypeAPI from '@/api/statement-type'
export default {
  props: {
    relation: Object
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
    }
  },
  computed: {
    parentRelationId(){
      return typeof this.relation !== 'undefined' ? this.relation['parent_relation_id'] : null
    },
    statementTypeId(){
      return typeof this.relation !== 'undefined' ? this.relation['statement_type_id'] : null
    },
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
    },
    hasPublishedAt(){
      return typeof this.relation['published_at'] !== 'undefined'
    }
  }
}
</script>