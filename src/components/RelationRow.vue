<template>
  <div v-if="relation" class="w-100 hover-border-dark border-bottom border-width-4 px-3 py-2">
    <router-link
      @click="$emit('link-clicked')"
      :to="'/branch/' + relation['id'] + '/t/' + toKebabCase((relationStatement['text']).slice(0,30)) + hash"
      class="text-dark"
      style="text-decoration-line: none"
    >
    <div class="d-flex mb-1">
      <div class="flex-fill d-flex align-items-center">
        <template v-if="!noUser">
          <img v-if="profilePhoto" :src="profilePhoto" class="rounded-circle mr-2" style="width: 42px" />
          <fa v-else icon="user-circle" class="mr-2 text-light" style="font-size:42px" />

        </template>
        <div>
          <div class="text-uppercase">
            <StatementTypePill :statementTypeId="statementTypeId" />
          </div>
          <div v-if="!noUser" class="text-light text-sm pl-1">
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
        {{timeSince(relation['updated_at'] + ' UTC', 2592000000, 'm d, Y')}}
      </small>
    </div>
    <div class="d-flex w-100" >
      <div class="pr-1 text-primary">
        <fa v-if="parentRelationId" icon=leaf />
        <fa v-else icon=tree />
      </div>
      <div v-if="relationStatement" class="flex-fill text-break">
        
          {{relationStatement['text']}}
        
      </div>
      <div v-else>
        {{relation}}
        <span class="text-light">Statement Not Found. R#{{relation['id']}}</span>
      </div>
    </div>
    <div v-if="relation['parent_relation'] && relation['parent_relation']['statement']" class="mt-2 ">
      <div class="bg-light p-1 rounded text-sm px-3 d-flex align-items-center">
        <fa icon="tree" class="mr-2" />
        <span class="text-break">{{relation['parent_relation']['statement']['text']}}</span>
      </div>
    </div>
    </router-link>
  </div>
</template>
<script>
import StatementTypePill from '@/components/StatementTypePill'
import FileServerHelper from '@/helpers/file-server'
export default {
  components: {
    StatementTypePill
  },
  props: {
    relation: Object,
    rootParentStatementText: String,
    noUser: {
      type: Boolean,
      default: false
    },
    hash: {
      type: String,
      default: ''
    },
  },
  emits: ['link-clicked'],
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
    },
    relationStatement(){
      if(this.relation){
        if(this.relation['virtual_relation']){
          return this.relation['virtual_relation']['statement']
        }else{
          return this.relation['statement']
        }
      }else{
        return null
      }
    },
    profilePhoto(){
      return !this.noUser && typeof this.relation['user']['user_profile_photo'] !== 'undefined' && this.relation['user']['user_profile_photo'] ? 
        FileServerHelper.url(this.relation['user']['user_profile_photo']['file_name']) : null
    }
  }
}
</script>