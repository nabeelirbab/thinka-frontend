<template>
  <div v-if="relation" class="w-100 hover-border-dark border-bottom px-3 py-3">
    <div class="d-flex mb-1">
      <div class="flex-fill d-flex align-items-center">
        <fa icon="user-circle" class="mr-2 text-light" style="font-size:2.9em" />
        <div>
          <div class="text-uppercase">
            <StatementTypePill :statementTypeId="statementTypeId" />
          </div>
          <div class="text-light text-sm pl-1">
            by {{relation['user'] ? relation['user']['username'] : 'Unknown User#' + relation['user_id']}}
          </div>
        </div>
      </div>
      <small class="text-light">
        <span v-if="hasPublishedAt"  class="pl-2 text-light">
          <fa v-if="relation['published_at']" icon="sun" />
          <fa v-else icon="briefcase" />
          &#8226;
        </span>
        {{timeSince(relation['updated_at'], 2592000000, 'm d, Y')}}
      </small>
    </div>
    <div class="d-flex w-100" >
      <div class="pr-1 text-primary">
        <fa v-if="parentRelationId" icon=leaf />
        <fa v-else icon=tree />
      </div>
      <div v-if="relation['statement']" class="flex-fill text-break">
        <router-link
          :to="'/branch/' + relation['id'] + '/t/' + toKebabCase((relation['statement']['text']).slice(0,30))"
          class="text-dark"
        >
          {{relation['statement']['text']}}
        </router-link>
      </div>
      <div v-else>
        <span class="text-light">Statement Not Found. R#{{relation['id']}}</span>
      </div>
    </div>
    <div v-if="relation['parent_relation'] && relation['parent_relation']['statement']" class="mt-2 ">
      <div class="bg-light p-1 rounded text-sm px-3 d-flex align-items-center">
        <fa icon="tree" class="mr-2" />
        <span class="text-break">{{relation['parent_relation']['statement']['text']}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import StatementTypePill from '@/components/StatementTypePill'
export default {
  components: {
    StatementTypePill
  },
  props: {
    relation: Object,
    rootParentStatementText: String
  },
  methods: {
    
  },
  computed: {
    parentRelationId(){
      return typeof this.relation !== 'undefined' ? this.relation['parent_relation_id'] : null
    },
    statementTypeId(){
      return (typeof this.relation !== 'undefined' && this.relation['statement']) ? this.relation['statement']['statement_type_id'] : null
    },
    hasPublishedAt(){
      return typeof this.relation['published_at'] !== 'undefined'
    }
  }
}
</script>