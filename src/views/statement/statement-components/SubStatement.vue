<template>
  <div>
    <div
    
      v-show="statementTextFilter === '' || (statementText.toLowerCase()).indexOf(statementTextFilter.toLowerCase()) >= 0"
      :class="statementClass"
      class="sub-statement statement-radius mb-1 c-pointer border-width border-dark"
      @click="statementClicked"
    >
      <div class="d-flex align-items-center p-2">
        <div v-if="showImpact || showScope" class="pr-1">
          <div class="text-wrap px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px; width:35px; overflow-wrap:anywhere">
            <small v-if="showImpact">100%</small>
            <small v-if="showScope" style="line-height: 1">
              {{localStatementData['statement']['scope_id'] ? scopes[findArrayIndex(localStatementData['statement']['scope_id'], scopes, 'id')]['description'] : null}}
            </small>
          </div>
        </div>
        <div class="flex-fill" :style="{'padding-left': ((level - 1) * 20)+ 'px'}">
          <!-- <div class="d-flex justify-content-between mb-1 ">
            <div>
              <small class="badge badge-pill badge-light mr-1 d-none d-md-inline-block"><fa icon="level-up-alt" rotation="90" /> {{level}}</small>
              <small class="badge badge-pill badge-primary mr-1 text-nowrap">By <strong>{{statement['user'] ? statement['user']['name'] : null}}</strong></small>
              <small class="badge badge-pill badge-warning text-nowrap font-weight-bold">Almost All</small>
            </div>
            <small class="text-nowrap d-none d-md-block">{{statement['created_at']}}</small>
            <CTPoints :points="statement['ct_points']" />
          </div> -->
          <div class="d-flex text-justify align-items-center" >
              <div class="text-danger font-weight-bold mr-1" style="font-size:1.5em">{{relationTypeSymbol}}</div>
              <div class="text-dark text-justify mb-1 text-break">{{statementText}} [#{{statementId}}, #{{relation['id']}}]</div>
              <!--  -->
          </div>
          <!-- <div class="d-flex justify-content-between">
            <div>
              <small class="badge badge-pill  text-nowrap"><strong>{{statement['subscribers'].length}}</strong> Subscribers</small>
            </div>
            <AddStatementOption size="compact" class="text-right" />
          </div> -->
        </div>
        <div class="pl-1">
          <div v-if="showOpinion || showCTOpinion || isActive" class="px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px!important; width:35px!important">
            <small v-if="showOpinion">100%</small>
            <small v-else-if="showCTOpinion">-100%</small>
            <router-link v-else :to="'/branch/' + relation['id']" tag="div" ><fa icon="eye" /></router-link>
          </div>
        </div>
      </div>
    </div>
    <CreateSubStatement v-if="createSubStatementParentId === relation['id']" :is-positive-statement="isPositiveStatement" :parent-relation-id="relation['id']" :level="level + 1" :logic-tree-id="logicTreeId" :statement-id="statementId"  @save="$emit('save', {event: $event, mappingIndex: []})"/>
    <template v-for="(children, index) in statementChildren" :key="'children' + index">
      <SubStatement :is-positive-statement="isPositiveStatement" :statement="children" :logic-tree-id="logicTreeId" :level="level + 1" @save="newSubStatementSaved($event, index)" />
    </template>
  </div>
</template>
<script>
// import CTPoints from '@/components/CTPoints'
import SubStatement from './SubStatement'
import GlobalData from '../global-data'
import CreateSubStatement from './CreateSubStatement'
import RelationTypeAPI from '@/api/relation-type'
import ScopeAPI from '@/api/scope'

// import AddStatementOption from './AddStatementOption'
export default {
  name: 'SubStatement',
  components: {
    // CTPoints,
    // AddStatementOption,
    CreateSubStatement,
    SubStatement
  },
  props: {
    level: Number,
    isPositiveStatement: {
      type: Boolean,
      required: true
    },
    logicTreeId: Number,
    statement: {
      type: Object,
      required: true
    }
  },
  emits: {
    save: null
  },
  data(){
    // const isPositiveStatement = typeof this.statement['relation'] === 'undefined' ||  this.statement['relation'] !== '-'
    return {
      ...GlobalData,
      scopes: ScopeAPI.cachedData.value['data'],
      localStatementData: {scope: null},
      statementClass: {
        'negative-statement': !this.isPositiveStatement,
        'positive-statement': this.isPositiveStatement,
        'border ': false
      },
      relationTypes: RelationTypeAPI.cachedData && RelationTypeAPI.cachedData.value['data'] ? RelationTypeAPI.cachedData.value['data'] : []
    }
  },
  methods: {
    newSubStatementSaved(event, index){
      event['mappingIndex'].push(index)
      this.$emit('save', event)
    },
    statementClicked(){
      this.selectedStatementData = this.localStatementData
      this.selectedStatementId = this.selectedStatementId === this.relation['id'] ? 0 : this.relation['id']
    }
  },
  watch: {
    isActive(){
      this.statementClass['border'] = this.isActive
    },
    statement: {
      handler(){
        this.localStatementData = JSON.parse(JSON.stringify(this.statement))
      },
      immediate: true
    }
  },
  computed: {
    parentStatement(){
      return typeof this.statement['relation'] !== 'undefined' && this.statement['relation'] ? this.statement['relation'] : null
    },
    isActive(){
      return this.relation['id'] === this.selectedStatementId
    },
    statementId(){
      return typeof this.statement['statement'] !== 'undefined' ? this.statement['statement']['id'] : 'ERROR: Statement text not found'
    },
    statementText(){
      return typeof this.statement['statement'] !== 'undefined' ? this.statement['statement']['text'] : 'ERROR: Statement text not found'
    },
    statementChildren(){
      return typeof this.statement['relations'] !== 'undefined' ? this.statement['relations'] : []
    },
    relation(){
      return this.statement
    },
    relationTypeSymbol(){
      const relationTypeId = this.statement['relation_type_id']
      const relationTypeIndex = this.findArrayIndex(relationTypeId * 1, this.relationTypes, 'id')
      if(relationTypeIndex >= 0){
        return this.relationTypes[relationTypeIndex]['symbol']
      }else{
        return '??'
      }
    }
  }
}
</script>
