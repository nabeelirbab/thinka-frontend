<template>
  <div :style="{'padding-left': (level > 1 ? 20 : 0)+ 'px'}">
    <div
      v-if="isLocked > 0"
      v-show="!isEditing && (!isFilteredOut || (typeof parentRelationIdsWithPassedFilterChildren[relationId] !== 'undefined'))"
      :class="statementClass"
      class="sub-statement statement-radius mb-1 c-pointer border-width border-dark"
      style="min-height: 35px"
    >
      <div class="d-flex align-items-center pl-1 pt-1 pb-1 pr-0 mr-0 h-100">
        <div class="ml-0 pl-0" style="min-width:30px">
          <button 
            v-if="!showStatement && relationData && relationData['relations'].length && (!hasFilterApplied || (hasFilterApplied && typeof parentRelationIdsWithPassedFilterChildren[relationId] !== 'undefined'))" 
            @click="showStatement = true" class="btn btn-sm btn-outline-secondary"
          >
            <fa icon="level-up-alt" rotation="90" />
          </button>
          <button v-if="showStatement && (!hasFilterApplied || (hasFilterApplied && typeof parentRelationIdsWithPassedFilterChildren[relationId] !== 'undefined'))" @click="showStatement = false" class="btn btn-sm btn-outline-secondary"><fa icon="chevron-up"  /></button>
        </div>
        <div>
          <CircleLabel v-if="isUpdating" class="mr-1" title="Updating statement. Please wait..." data-toggle="tooltip" data-placement="top">
            <fa icon="spinner" spin />
          </CircleLabel>
          <div v-else-if="showImpact || showScope" class="pr-1 text-wrap px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center mr-1" style="height:35px; width:35px; overflow-wrap:anywhere">
            <small v-if="showImpact" class="text-nowrap">{{relationData['impact_amount'] !== null ? (relationData['impact_amount'] * 100).toFixed(0) : ''}}%</small>
            <small v-if="relationData && showScope" style="line-height: 1">
              {{relationData['statement']['scope_id'] ? scopes[findArrayIndex(relationData['statement']['scope_id'], scopes, 'id')]['description'] : null}}
            </small>
          </div>
        </div>
        <div class="flex-fill"  @click="statementClicked" >
          <div v-if="isActive && relation && relation['user']" class="text-sm ml-3">
            <span class="font-weight-bold mr-1">{{relation['user']['username']}}</span>
            <span v-if="relation['published_at']" class="font-italic text-muted">{{timeSince(relation['published_at'])}}</span>
          </div>
          <div class="d-flex text-dark text-left mb-1" style="font-size:0.9em"  >
              <div class="column" style="margin-left: 0; padding-left: 1em; text-indent: -0.9em;" :title="relationTypeName" data-toggle="tooltip">
                <span class="text-danger font-weight-bold mr-1">{{relationTypeSymbol}}</span>
              </div>
              <div class="column text-break"><TextDisplayer :text="statementText"  /></div>
              <!-- Don't remove the line below. It will only appear in development but not on staging. This makes debugging faster-->
              
              <small v-if="isDevelopment && relationData" class="text-muted">#{{relationData['statement']['id']}} => #{{ relationData['id']}}</small>
          </div>
          <div>
            
          </div>
        </div>
        <div class="pl-1 d-flex my-auto align-self-center">
          <div v-if="showOpinion || showCTOpinion" class="bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center mr-2" style="height:35px!important; width:35px!important">
            <small v-if="showOpinion">100%</small>
            <small v-else-if="showCTOpinion">-100%</small>
          </div>
          <div v-else class="d-inline-flex">
            <div v-if="isActive" class="mr-1" >
              <router-link v-if="!enableDragging" :to="'/branch/' + relation['id'] + '/t/' + toKebabCase(statementText.slice(0, 30))" ><CircleIconButton icon="eye" button-class="btn-light bg-whitesmoke text-primary" /></router-link>
              <!-- <CircleIconButton v-if="relation && !relation['published_at']" @click.stop="editStatement" icon="edit" button-class="btn-light bg-whitesmoke text-primary ml-1" /> -->
              <CircleIconButton v-if="enableDragging && relation && !relation['published_at'] && !isUpdating" icon="arrows-alt" button-class="move-icon btn-light bg-whitesmoke text-primary" />
            </div>

            <div v-else class="ml-2 mr-2 align-self-center" style="color: gray">
              <!-- <div ref="tooltip2" v-if="!relation['published_at'] && mainRelationData['published_at']" class="tooltip2">
                <fa  icon="briefcase" title="Private" />
                <span class="tooltiptext">test</span>
              </div> -->
              <span v-if="!relation['published_at'] && mainRelationData['published_at']" data-toggle="tooltip" title="Private">
                <fa  icon="briefcase"  />
              </span>

              <!-- <fa v-else icon="sun" :title="relation['published_at']" /> -->
              <span v-else-if="isDifferentAuthor" data-toggle="tooltip" :title="relation['user']['username']">
                <fa  icon="user"  />
              </span>
              <fa v-if="isLocked == 1" icon="lock" title="Locked" />
            </div>
            <div v-if="isActive && !enableDragging" class="pr-1 align-self-center">
              <MoreOption :relation="relationData"/>
            </div>
          </div>
        </div>
      </div>
      <Opinion v-if="isActive" :relation="relationData" class="py-2" />
    </div>
    <CreateSubStatement v-if="isEditing" :relation="relation" :mode="'update'" :level="level + 1" :logic-tree-id="logicTreeId" :statement-id="statementId"  @save="statementEdited" @cancel="editSelectedStatement = false" :is-positive-statement="isPositiveStatement" :parent-relation-id="relation['id']"  />
    <CreateSubStatement v-if="createSubStatementParentId === relation['id']" @cancel="createSubStatementParentId = null" :is-positive-statement="isPositiveStatement" :parent-relation-id="relation['id']" :level="level + 1" :logic-tree-id="logicTreeId" :statement-id="statementId"  @save="$emit('save', {event: $event, mappingIndex: []})"/>
    <draggable
      v-if="relationData && isLocked > 0"
      v-show="(showStatement || (relationData['relations'].length === 0)) && !(isDraggingStatement && selectedStatementData && selectedStatementData['id'] * 1 === relationData['id'] * 1)"
      :relationid="relationData['id']"
      :list="relationData['relations']"
      class="dragArea"
      :class="(((isPositiveStatement && isDraggingStatement === 1) || (!isPositiveStatement && isDraggingStatement === 2)) && !isActive) ? 'isDragging' : ''"
      item-key="id"
      handle=".isRelationSelected.enableDragging"
      :group="{ name: groupName }"
      @start="startDragging"
      @end="endDragging"
      @change="listChanged"
    >
      <!-- <template #item="{element}">
        {{element}}
      </template> -->
      <template #item="{element, index}">
        <SubStatement
          @save="newSubStatementSaved($event, index)"
          @update="statementUpdated($event, index)"
          :is-positive-statement="isPositiveStatement"
          :statement="element"
          :logic-tree-id="logicTreeId"
          :level="level + 1"
          :group-name="groupName"
        />
      </template>
    </draggable>
  </div>
</template>
<script>
// import CTPoints from '@/components/CTPoints'
import Auth from '@/core/auth'
import SubStatement from './SubStatement'
import draggable from 'vuedraggable' // https://github.com/SortableJS/Vue.Draggable
import GlobalData from '../global-data'
import CreateSubStatement from './CreateSubStatement'
import RelationTypeAPI from '@/api/relation-type'
import ScopeAPI from '@/api/scope'
import CircleIconButton from '@/components/CircleIconButton'
import RelationAPI from '@/api/relation'
import CircleLabel from '@/components/CircleLabel'
import TextDisplayer from '@/components/TextDisplayer'
import MoreOption from './sub-statement-components/MoreOption'
import Opinion from './Opinion'
// import AddStatementOption from './AddStatementOption'
export default {
  name: 'SubStatement',
  components: {
    // CTPoints,
    // AddStatementOption,
    CreateSubStatement,
    SubStatement,
    draggable,
    CircleIconButton,
    CircleLabel,
    TextDisplayer,
    MoreOption,
    Opinion
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
    },
    groupName: {
      type: String,
      default: 'g1'
    }
  },
  emits: {
    save: null,
    update: null
  },
  mounted(){
    const $ = require('jquery')
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'click hover'
    })
    $('[data-toggle="tooltip"]').on('inserted.bs.tooltip', function () {
      const autoCloseTime = $(this).attr('data-original-title').length * 200
      setTimeout(() => {
        $(this).tooltip('hide')
      }, autoCloseTime + 1000)
    })
  },
  setup(){
    return {
      ...GlobalData,
    }
  },
  data(){
    // const isPositiveStatement = typeof this.statement['relation'] === 'undefined' ||  this.statement['relation'] !== '-'
    return {
      user: Auth.user(),
      relationData: null,
      showStatement: this.level < 1,
      scopes: ScopeAPI.cachedData.value['data'],
      statementClass: {
        'negative-statement': !this.isPositiveStatement,
        'positive-statement': this.isPositiveStatement,
        'is-different-author': false,
        'border': false,
        'isRelationSelected': false,
        'enableDragging': false
      },
      relationTypes: RelationTypeAPI.cachedData && RelationTypeAPI.cachedData.value['data'] ? RelationTypeAPI.cachedData.value['data'] : [],
      isUpdating: false,
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    statementEdited(event){
      this.$emit('update', {event: event, mappingIndex: []});
      this.editSelectedStatement = false
    },
    statementUpdated(event, index){
      event['mappingIndex'].push(index)
      this.$emit('update', event)
    },
    newSubStatementSaved(event, index){
      event['mappingIndex'].push(index)
      this.$emit('save', event)
    },
    statementClicked(){
      this.selectedStatementData = this.relationData
      this.selectedStatementId = this.selectedStatementId === this.relation['id'] ? 0 : this.relation['id']
    },
    startDragging(){
      this.isDraggingStatement = this.isPositiveStatement === true ? 1 : 2
    },
    endDragging(){
      this.isDraggingStatement = 0
    },
    listChanged(event){
      if(typeof event['added'] !== 'undefined' && this.relationData['relations']){
        this.isUpdating = true
        this.relationData['relations'][event['added']['newIndex']]['parent_relation_id'] = this.relationData['id']
        RelationAPI.update({
          id: this.relationData['relations'][event['added']['newIndex']]['id'],
          parent_relation_id: this.relationData['relations'][event['added']['newIndex']]['parent_relation_id'],
        }).finally(() => {
          this.mapRelations()
          this.isUpdating = false
        })
      }
    }
  },
  watch: {
    enableDragging(enableDragging){
      this.statementClass['enableDragging'] = enableDragging
    },
    isActive(){
      this.statementClass['border'] = this.isActive
      this.statementClass['isRelationSelected'] = this.isActive
    },
    isDifferentAuthor: {
      handler(isDifferentAuthor){
        if(isDifferentAuthor){
          this.statementClass['negative-statement'] = !isDifferentAuthor
          this.statementClass['positive-statement'] = !isDifferentAuthor
        }
        this.statementClass['is-different-author'] = isDifferentAuthor
      },
      immediate: true
    },
    statement: {
      handler(){
        let statementRelationIndexMap = this.subRelationMap[this.statement['id']]
        this.relationData = null
        if(statementRelationIndexMap){
          let currentRelation = this.mainRelationData
          const map = statementRelationIndexMap
          for(let x = 0; x < map.length; x++){
            const index = map[x]
            if(typeof currentRelation['relations'] !== 'undefined'){
              currentRelation = currentRelation['relations'][index]
            }
          }
          this.relationData = currentRelation
        }
        if(typeof this.relationData !== 'undefined' && typeof this.relationData['relations'] === 'undefined'){
          this.relationData['relations'] = []
        }
      },
      immediate: true
    },
  },
  computed: {
    relationId(){
      return this.relationData ? this.relationData['id'] : null
    },
    isEditing(){
      return this.isActive && this.editSelectedStatement
    },
    isLocked(){ // if < 0, do not show, if 1 context lock active here, if 2 no context lock set
      if(this.relationData && typeof this.relationData['user_relation_context_locks'] !== 'undefined' && this.relationData['user_relation_context_locks'].length){
        for(let x = 0; x < this.relationData['user_relation_context_locks'].length; x++){
          if(this.relationData['user_relation_context_locks'][x]['root_relation_id'] * 1 === this.mainRelationData['id'] * 1){
            return 1
          }
        }
        return -1
      }else{
        return 2
      }
    },
    parentStatement(){
      return typeof this.statement['relation'] !== 'undefined' && this.statement['relation'] ? this.statement['relation'] : null
    },
    isActive(){
      return this.relationData && this.relationData['id'] * 1 === this.selectedStatementId * 1
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
    isDifferentAuthor(){
      return this.mainRelationData && this.mainRelationData['user_id'] * 1 !== this.relation['user_id'] * 1
    },
    relationTypeSymbol(){
      const relationTypeId = this.statement['relation_type_id']
      const relationTypeIndex = this.findArrayIndex(relationTypeId * 1, this.relationTypes, 'id')
      if(relationTypeIndex >= 0){
        return this.relationTypes[relationTypeIndex]['symbol']
      }else{
        return '??'
      }
    },
    isAuthorFilterPassed(){
      return this.relationData === null || typeof this.relationData['is_author_filter_passed'] === 'undefined' || this.relationData['is_author_filter_passed']
    },
    hasFilterPassChildren(){
      return typeof this.parentRelationIdsWithPassedFilterChildren[this.relationId] !== 'undefined'
    },
    isFilteredOut(){
      let failedTextFilter = this.statementTextFilter !== '' && (this.statementText.toLowerCase()).indexOf(this.statementTextFilter.toLowerCase())  === -1
      return failedTextFilter || !this.isAuthorFilterPassed
    },
    relationTypeName(){
      const relationTypeId = this.statement['relation_type_id']
      const relationTypeIndex = this.findArrayIndex(relationTypeId * 1, this.relationTypes, 'id')
      if(relationTypeIndex >= 0){
        return this.relationTypes[relationTypeIndex]['description']
      }else{
        return '??'
      }
    },
    titleIds(){
        return '('+this.relation['parent_relation_id']+') [' + this.relation['id'] + ']'
    }
  }
}
</script>
<style scoped>
.dragArea.isDragging {
  min-height: 20px;
  border: 1px dashed;
  padding: 10px;
}
</style>
