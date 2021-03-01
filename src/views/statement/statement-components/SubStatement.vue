<template>
  <div :style="{'padding-left': (level > 1 ? 20 : 0)+ 'px'}">
    <div
      v-if="isLocked > 0"
      v-show="!isEditing && (!isFilteredOut || hasFilterPassChildren)"
      :class="statementClass"
      class="sub-statement statement-radius mb-1 c-pointer border-width border-dark"
      style="min-height: 35px"
    >
      <div class="d-flex align-items-center pl-1 pt-1 pb-1 pr-0 mr-0 h-100">
        <div class="ml-0 pl-0" style="min-width:30px">
          <button 
            v-if="!showStatement && relationData && subRelations.length && (!hasFilterApplied || (hasFilterApplied && typeof parentRelationIdsWithPassedFilterChildren[relationId] !== 'undefined'))" 
            @click="showStatement = true" class="btn btn-sm btn-outline-secondary"
          >
            <fa icon="level-up-alt" rotation="90" />
          </button>
          <button v-if="showStatement && (!hasFilterApplied || hasFilterPassChildren)" @click="showStatement = false" class="btn btn-sm btn-outline-secondary"><fa icon="chevron-up"  /></button>
        </div>
        <div>
          <CircleLabel v-if="isUpdating" class="mr-1" title="Updating statement. Please wait..." data-toggle="tooltip" data-placement="top">
            <fa icon="spinner" spin />
          </CircleLabel>
          <div v-else-if="(showImpact || showScope) && relationData" class="pr-1 text-wrap px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center mr-1" style="height:35px; width:35px; overflow-wrap:anywhere">
            <small v-if="showImpact" class="text-nowrap">{{relationImpactAmount}}%</small>
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
          <div class="d-flex text-dark text-left mb-1 align-items-center" style="font-size:0.9em"  >
              <div class="" style="margin-left: 0; padding-left: 1em; text-indent: -0.9em;" :title="relationTypeName" data-toggle="tooltip">
                <span class="text-danger font-weight-bold mr-1">{{relationTypeSymbol}}</span>
              </div>
              <div class="text-break">
                <div v-if="isVirtualRelation" class="text-info text-sm"><fa icon="link" class="mr-1" />This is a linked Statement</div>
                <TextDisplayer :text="statementText"  />
              </div>
              <!-- Don't remove the line below. It will only appear in development but not on staging. This makes debugging faster-->
              <template v-if="isDevelopment && relationData">
                <small class="text-muted">r#{{relationData['id']}}</small>
                <small v-if="isVirtualRelation" class="text-muted"> | [vr#{{relationData['virtual_relation_id']}} | hvr#{{relationData['is_virtual_relation']}}]</small>
              </template>
          </div>
          <div>
          </div>
        </div>
        <div class="pl-1 d-flex my-auto align-self-center">
          <div v-if="showOpinion || showCTOpinion" class="bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center mr-2" style="height:35px!important; width:35px!important">
            <small v-if="showOpinion">{{(relationOpinionScoreRelation * 100).toFixed(0)}}%</small>
            <small v-else-if="showCTOpinion">-100%</small>
          </div>
          <div v-else class="d-inline-flex">
            <div v-if="isActive" class="mr-1" >
              <ZoomVirtualRelation 
                v-if="isVirtualRelation"
                :relation="relationData"
              />
              <router-link 
                v-if="!enableDragging && !isVirtualRelation" 
                :to="'/branch/' + relation['id'] + '/t/' + toKebabCase(statementText.slice(0, 30)) + (isLocked === 1 ? '/context/' + mainRelationId : '')"
              >
                <CircleIconButton icon="eye" button-class="btn-light bg-whitesmoke text-primary" />
              </router-link>
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
              <OpinionIcon :type="relationOpinionType" class="ml-1" />
            </div>
            <div v-if="isActive && !enableDragging" class="pr-1 align-self-center">
              <MoreOption :relation="relationData" :level="level" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateSubStatement
      v-if="isEditing"
      @save="statementEdited"
      @cancel="editSelectedStatement = false"
      :relation="relation"
      :mode="'update'"
      :level="level + 1"
      :logic-tree-id="logicTreeId"
      :statement-id="statementId"
      :is-positive-statement="isPositiveStatement"
      :parent-relation-id="relation['id']"  
    />
    <CreateSubStatement
      v-if="createSubStatementParentId === relation['id']" 
      @cancel="createSubStatementParentId = null"
      @save="addNewSubStatement($event, relation['id'])"
      @sav1e="$emit('save', {event: $event, mappingIndex: []})"
      :is-positive-statement="isPositiveStatement" 
      :parent-relation-id="relation['id']"
      :parent-relation="relation"
      :level="level + 1"
      :logic-tree-id="logicTreeId"
      :statement-id="statementId"
    />
    <draggable
      v-if="relationData && isLocked > 0"
      v-show="(showStatement || (subRelations.length === 0)) && !(isDraggingStatement && selectedStatementData && selectedStatementData['id'] * 1 === relationData['id'] * 1)"
      :relation-id="relationData['id']"
      :list="subRelations"
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
import OpinionIcon from '@/views/statement/statement-components/sub-statement-components/OpinionIcon'
import ZoomVirtualRelation from './sub-statement-components/ZoomVirtualRelation.vue'
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
    OpinionIcon,
    ZoomVirtualRelation
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
      if(this.selectedStatementId === this.relation['id']){ // unselect
        this.selectedStatementData = null
        this.selectedStatementId = 0
      }else{
        this.selectedStatementData = this.relationData
        this.selectedStatementId = this.relation['id']
      }
    },
    startDragging(){
      this.isDraggingStatement = this.isPositiveStatement === true ? 1 : 2
    },
    endDragging(){
      this.isDraggingStatement = 0
    },
    listChanged(event){ // for dragging
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
        this.relationData = this.getRelationInstance(this.statement['id'])
        // let statementRelationIndexMap = this.subRelationMap[this.statement['id']]
        // if(statementRelationIndexMap){
        //   let currentRelation = this.mainRelationData
        //   const map = statementRelationIndexMap 
        //   for(let x = 0; x < map.length; x++){
        //     const index = map[x]
        //     if(typeof currentRelation['relations'] !== 'undefined'){
        //       currentRelation = currentRelation['relations'][index]
        //     }
        //   }
        //   this.relationData = currentRelation
        // }
        // if(typeof this.relationData !== 'undefined' && this.relationData && typeof this.relationData['relations'] === 'undefined'){
        //   this.relationData['relations'] = []
        // }
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
      if(this.statement){
        if(this.statement['virtual_relation_id']){ // if root virtual relation
          if(this.statement['virtual_relation'] && this.statement['virtual_relation']['statement']){
            return this.statement['virtual_relation']['statement']['text']
          }else{ // if no virtual relation found
            return 'ERROR: Virtual Relation has no statement. #' + this.statement['virtual_relation_id']
          }
        }else if(this.statement['statement']){
          return this.statement['statement']['text']
        }else{
          return 'ERROR: No Statement'
        }
      }else{
        return 'ERROR: No relation data.'
      }
    },
    subRelations(){
      if(this.relationData){
        if(this.relationData['virtual_relation_id'] && this.relationData['virtual_relation'] && this.relationData['virtual_relation']['relations']){
          return this.relationData['virtual_relation']['relations']
        }else{
          return this.relationData['relations']
        }
      }else{
        return []
      }
    },
    relationImpactAmount(){
      let impactAmount = 0
      if(this.relationData && typeof this.relationData['user_opinions'] === 'object'){
        for(let x = 0; x < this.relationData['user_opinions'].length; x++){
          impactAmount = this.relationData['user_opinions'][x]['impact_amount']
        }
        // if(this.relationData['virtual_relation_id']){
          //   impactAmount =  this.relationData['virtual_relation'] ? this.relationData['virtual_relation']['impact_amount'] : ''
        // }else if(this.relationData['impact_amount'] !== null){
          // impactAmount = this.relationData['impact_amount']
        // }
        console.log('user_opinions', impactAmount, this.relationData['user_opinions'])
      }
      return impactAmount !== '' ? (impactAmount * 100).toFixed(0) : ''
    },
    isVirtualRelation(){
      return this.relationData && this.relationData['is_virtual_relation']
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
    relationOpinionScoreRelation(){
      let userOpinionScoreRelation = 0
      if(this.relationData){
        // if(this.relationData['virtual_relation_id']){
        //   userOpinionScoreRelation = this.relationData['virtual_relation'] && this.relationData['virtual_relation']['user_opinion'] ? this.relationData['virtual_relation']['user_opinion']['opinion_calculated_column']['score_relation'] : 0
        // }else 
        if(this.relationData['user_opinion']){
          userOpinionScoreRelation = this.relationData['user_opinion']['opinion_calculated_column']['score_relation']
        }
      }
      return userOpinionScoreRelation
    },
    relationOpinionType(){
      let userOpinionType = -1
      if(this.relationData){
        // if(this.relationData['virtual_relation_id']){
        //   userOpinionType = this.relationData['virtual_relation'] && this.relationData['virtual_relation']['user_opinion'] ? this.relationData['virtual_relation']['user_opinion']['type'] : 0
        if(this.relationData['user_opinion']){
          userOpinionType = this.relationData['user_opinion']['type']
        }
      }
      return userOpinionType
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
