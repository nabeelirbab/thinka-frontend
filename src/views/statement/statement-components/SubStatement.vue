<template>
  <div
    :id="'relation-container-' + relationId"
    :class="statementClass"
    :is-support="isPositiveStatement"
    :style="level > 1 ? 'box-shadow: #29292959  0px -1px 4px' : ''"
    class="d-flex mt-1  border-width-none border-radius"
  >
    <div
      @click.stop="showStatement = !showStatement"
      class="align-items-stretch align-items-center text-center px-1 border-left-radius border-width-none text-sm pt-1"
      style="min-width: 17px;"
    >
        <fa v-if="!showStatement && hasToggleableChildren" icon="chevron-down" />
        <fa v-else-if="showStatement && hasToggleableChildren && (!hasFilterApplied || hasFilterPassChildren)" icon="chevron-up" />
    </div>
    <div v-if="relationData" class="flex-fill pl-1 pt-1 border-right-radius bg-white">
      <div v-if="isActive && relation['user']" class="text-sm ml-2 pr-3 d-flex justify-content-end">
        <div v-if="isActive" class="flex-fill">
          <span class="font-weight-bold mr-1">{{relation['user']['username']}}</span>
        </div>
        <div v-if="isActive && isVirtualRelation" class="text-info text-sm text-right text-dark">
          <!-- <fa icon="link" class="mr-1 " /> &#8226; -->
          <ZoomVirtualRelation v-if="isVirtualRelation" :relation="relation" />
        </div>
        <div v-if="isActive" class="">
          <span v-if="publishedAt"  class="pl-2 text-light">
            <fa icon="sun" />
            &#8226;
            <span>{{timeSince(publishedAt + ' UTC', 2592000000, 'm d, Y')}}</span>
          </span>
          <span v-else>
            <fa icon="briefcase" />
            &#8226;
            <span>{{timeSince(relation['created_at'] + ' UTC', 2592000000, 'm d, Y')}}</span>
          </span>
        </div>
      </div>
      <div
        v-if="isLocked > 0"
        v-show="!isEditing && (!isFilteredOut || hasFilterPassChildren)"
        class="sub-statement border-width border-dark"
        style="min-height: 35px;"
      >
        <div class="d-flex align-items-center py-1">
          <div>
            <CircleLabel v-if="isUpdating" class="mr-1" title="Updating statement. Please wait..." data-toggle="tooltip" data-placement="top">
              <fa icon="spinner" spin />
            </CircleLabel>
            <div 
              v-else-if="(showImpact || showScope)" 
              class="pr-1 text-wrap px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center mr-1" 
              style="height:35px; width:35px; overflow-wrap:anywhere"
            >
              <small v-if="showImpact" class="text-nowrap">{{userOpinionImpact}}%</small>
              <small v-if="relation['statement'] && showScope" style="line-height: 1">
                {{relation['statement']['scope_id'] ? scopes[findArrayIndex(relation['statement']['scope_id'], scopes, 'id')]['description'] : null}}
              </small>
            </div>
          </div>
          <div class="flex-fill c-pointer align-items-stretch">
            <div>
              <div @click="statementClicked" class="d-flex text-dark text-left m-0 p-0" >
                  <div class="pl-2" style="line-height:1.8">
                    <RelationTypeLabel class="p-1.5" :relation-type-id="relation['relation_type_id'] * 1" />                    
                    <TextDisplayer :text="' ' + statementText" />
                  </div>                  
                  <!-- Don't remove the line below. It will only appear in development but not on staging. This makes debugging faster-->
                  <!-- <template v-if="isDevelopment">
                    <small class="text-muted">r#{{relationId}}</small>
                    <small v-if="isVirtualRelation" class="text-muted"> | [vr#{{relation['virtual_relation_id']}} | hvr#{{relation['is_virtual_relation']}}]</small>
                  </template> -->
              </div>
              <div v-if="isActive || showCTOpinion" class="bg-white">
                <Opinions
                  @click="opinionSummaryClicked"
                  :user-opinions="userOpinions"
                  :user-opinion-type="relationOpinionType"
                  class="text-right px-2 c-pointer no-wrap"
                />
              </div>              
            </div>        
          </div>
          <div class="d-flex my-auto align-self-center">
            <!-- <div v-if="showOpinion || showCTOpinion" class="bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center mr-2" style="height:35px!important; width:35px!important">
              <small v-if="showOpinion">{{(relationOpinionScoreRelation * 100).toFixed(0)}}%</small>
              <small v-else-if="showCTOpinion">-100%</small>
            </div> -->
            <div class="d-inline-flex">
              <div v-if="isActive" class="mr-1" >
                <!-- <ZoomVirtualRelation 
                  v-if="isVirtualRelation"
                  :relation="relation"
                /> -->
                <!-- <router-link
                  v-if="!enableDragging && !isVirtualRelation" 
                  :to="'/branch/' + relationId + '/t/' + toKebabCase(statementText.slice(0, 30)) + (isLocked === 1 ? '/context/' + mainRelationId : '')"
                >
                  <CircleIconButton icon="eye" button-class="btn-light bg-whitesmoke text-primary" />
                </router-link> -->
                <!-- <CircleIconButton v-if="relation && !relation['published_at']" @click.stop="editStatement" icon="edit" button-class="btn-light bg-whitesmoke text-primary ml-1" /> -->
                <CircleIconButton v-if="enableDragging && !relation['published_at'] && !isUpdating" icon="arrows-alt" button-class="move-icon btn-light bg-whitesmoke text-primary" />
              </div>
              <div v-else class="ml-2 mr-2 align-self-center text-nowrap">
                <span v-if="!relation['published_at'] && mainRelationData['published_at']" data-toggle="tooltip" title="Private">
                  <fa  icon="briefcase"  />
                </span>
                <!-- <fa v-else icon="sun" :title="relation['published_at']" /> -->
                <span v-else-if="isAuthorNotUser" data-toggle="tooltip" :title="relation['user']['username']">
                  <fa  icon="user"  />
                </span>
                <fa v-if="isLocked == 1" icon="lock" title="Locked" />
                <OpinionIcon v-if="relationOpinionType && !showCTOpinion" :type="relationOpinionType" @click="statementClicked" class="ml-1" />
              </div>
              <div v-if="isActive && !enableDragging" class="pr-1 align-self-center">
                <MoreOption :relation="relation" :level="level" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-1">
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
          :parent-relation-id="relationId"
          class="mt-2"
        />
        <CreateSubStatement
          v-if="createSubStatementParentId === relationId"
          @cancel="createSubStatementParentId = null"
          @save="addNewSubStatement($event, relationId)"
          @sav1e="$emit('save', {event: $event, mappingIndex: []})"
          :is-positive-statement="isPositiveStatement" 
          :parent-relation-id="relationId"
          :parent-relation="relation"
          :level="level + 1"
          :logic-tree-id="logicTreeId"
          :statement-id="statementId"
          class="mt-2"
        />
        <draggable
          v-if="relation && isLocked > 0"
          v-show="showSubStatements"
          :relation-id="relationId"
          :list="!hasVirtualRelations ? relation['relations'] : relation['virtual_relation']['relations']"
          class="dragArea"
          :class="(((isPositiveStatement && isDraggingStatement === 1) || (!isPositiveStatement && isDraggingStatement === 2)) && !isActive) ? 'isDragging' : ''"
          item-key="id"
          handle=".isRelationSelected.enableDragging"
          :group="{ name: groupName }"
          @start="startDragging"
          @end="endDragging"
          @change="listChanged"
        >
          <template #item="{element, index}">
            <SubStatement
              @save="newSubStatementSaved($event, index)"
              @update="statementUpdated($event, index)"
              :is-positive-statement="isPositiveStatement"
              :relation-id="element['id']"
              :relation="element"
              :logic-tree-id="logicTreeId"
              :level="level + 1"
              :group-name="groupName"
            />
          </template>
        </draggable>
      </div>
    </div>
    <div v-else class="text-center w-100"><fa icon="spinner" spin /></div>
  </div>
</template>
<script>
// import CTPoints from '@/components/CTPoints'
import Auth from '@/core/auth'
import SubStatement from './SubStatement'
import draggable from 'vuedraggable' // https://github.com/SortableJS/Vue.Draggable
import GlobalData from '../global-data'
import CreateSubStatement from './CreateSubStatement'

import ScopeAPI from '@/api/scope'
import CircleIconButton from '@/components/CircleIconButton'
import RelationAPI from '@/api/relation'
import CircleLabel from '@/components/CircleLabel'
import TextDisplayer from '@/components/TextDisplayer'
import MoreOption from './sub-statement-components/MoreOption'
import OpinionIcon from '@/views/statement/statement-components/sub-statement-components/OpinionIcon'
import Opinions from '@/views/statement/statement-components/sub-statement-components/Opinions'
import ZoomVirtualRelation from './sub-statement-components/ZoomVirtualRelation.vue'
import RelationTypeLabel from './sub-statement-components/RelationTypeLabel'

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
    Opinions,
    ZoomVirtualRelation,
    RelationTypeLabel
  },
  props: {
    level: Number,
    isPositiveStatement: {
      type: Boolean,
      required: true
    },
    logicTreeId: Number,
    relationId: {
      type: Number,
      required: true
    },
    relation: {
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
    this.focusToSubRelation()
  },
  data(){
    return {
      ...GlobalData,
      user: Auth.user(),
      relationData: null,
      showStatement: this.level < 1,
      scopes: ScopeAPI.cachedData.value['data'],
      statementClass: {
        'negative-statement': !this.isPositiveStatement,
        'positive-statement': this.isPositiveStatement,
        'is-different-author': false,
        // 'border': false,
        'isRelationSelected': false,
        'enableDragging': false
      },
      
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
      if(this.selectedStatementId === this.relationId){ // unselect
        this.selectedStatementData = null
        this.selectedStatementId = 0
      }else{
        this.selectedStatementData = this.relationData
        this.selectedStatementId = this.relationId
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
        this.mapRelations()
        const addedIndex = event['added']['newIndex']
        this.isUpdating = true
        this.relationData['relations'][addedIndex]['parent_relation_id'] = this.relationId
        RelationAPI.update({
          id: this.relationData['relations'][addedIndex]['id'],
          parent_relation_id: this.relationData['relations'][addedIndex]['parent_relation_id'],
        }).finally(() => {
          console.log('maping sub list change')
          
          this.isUpdating = false
        })
      }
    },
    opinionSummaryClicked(){
      if(this.selectedStatementId === this.relationId){
        this.showImpactOpinionDialog = !this.showImpactOpinionDialog
      }else{
        this.statementClicked()
      }
    },
    focusToSubRelation(){
      if(this.relationData && this.hashRelationId === this.relationData['id']){ // the last hash is a number
        const relationContainer = document.getElementById('relation-container-' + this.hashRelationId)
        const windowContainer = this.windowContainers[relationContainer.getAttribute('is-support') === 'true' ? 0 : 1]
        setTimeout(() => {
          this.statementClicked()
          if(relationContainer){
            (windowContainer).scrollTop = relationContainer.offsetTop - (windowContainer).offsetTop - 10
          }
        }, 100)
      }
    },
  },
  watch: {
    hashRelationId(){
      if(this.relationData && typeof this.expandedRelationIds[this.relationData['id']] !== 'undefined'){
        this.showStatement = true
      }
    },
    enableDragging(enableDragging){
      this.statementClass['enableDragging'] = enableDragging
    },
    isActive(){
      this.statementClass['border'] = this.isActive
      this.statementClass['border-success'] = this.isActive
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
    relation: { // this is a relation
      handler(){
        setTimeout(() => {
          if(this.relation && typeof this.relation['id'] !== 'undefined'){
            let relationData = this.getRelationInstance(this.relation['id'])
            if(relationData === null){
              this.mapRelations()
              relationData = this.getRelationInstance(this.relation['id'])
            }
            if(typeof relationData !== 'undefined'){
              this.relationData = relationData
              if(typeof this.expandedRelationIds[relationData['id']] !== 'undefined'){
                this.showStatement = true
              }
              setTimeout(() => {
                this.focusToSubRelation()
              }, 100)
            }
          }else{
            console.error('No relation')
          }
        }, 300)
      },
      immediate: true
    },
    hasToggleableChildren: {
      handler(hasToggleableChildren){
        if(hasToggleableChildren){
          this.statementClass['c-pointer'] = true
        }else{
          this.statementClass['c-pointer'] = false
        }
      },
      immediate: true
    }
  },
  computed: {
    isEditing(){
      return this.isActive && this.editSelectedStatement
    },
    isLocked(){ // if < 0, do not show, if 1 context lock active here, if 2 no context lock set
      if(typeof this.relation['user_relation_context_locks'] !== 'undefined' && this.relation['user_relation_context_locks'].length){
        for(let x = 0; x < this.relation['user_relation_context_locks'].length; x++){
          if(this.relation['user_relation_context_locks'][x]['root_relation_id'] * 1 === this.mainRelationData['id'] * 1){
            return 1
          }
        }
        return -1
      }else{
        return 2
      }
    },
    isActive(){
      return this.relationId * 1 === this.selectedStatementId * 1
    },
    statementId(){
      return typeof this.relation['statement'] !== 'undefined' ? this.relation['statement']['id'] : 'ERROR: Statement text not found'
    },
    statementText(){
        if(this.relation['virtual_relation_id']){ // if root virtual relation
          if(this.relation['virtual_relation'] && this.relation['virtual_relation']['statement']){
            return this.relation['virtual_relation']['statement']['text']
          }else{ // if no virtual relation found
            return 'ERROR: Virtual Relation has no statement. #' + this.relation['virtual_relation_id']
          }
        }else if(this.relation['statement']){
          return this.relation['statement']['text']
        }else{
          return 'ERROR: No Statement'
        }
    },
    publishedAt(){
      return typeof this.relation['published_at'] !== 'undefined' ? this.relation['published_at'] : ''
    },
    showSubStatements(){
      return (this.showStatement || (this.subRelations.length === 0))
        && !(this.isDraggingStatement && this.selectedStatementId === this.relationId * 1) 
        && ((this.isDraggingStatement && !this.hasVirtualRelations) || !this.isDraggingStatement)
    },
    hasVirtualRelations(){
      return this.relation && this.relation['virtual_relation_id'] && this.relation['virtual_relation'] && this.relation['virtual_relation']['relations']
    },
    subRelations(){
      if(this.relation){
        if(this.relation['virtual_relation_id'] && this.relation['virtual_relation'] && this.relation['virtual_relation']['relations']){
          return this.relation['virtual_relation']['relations']
        }else{
          return this.relation['relations']
        }
      }else{
        return []
      }
    },
    userOpinionImpact(){
      let impactAmount = ''
      if(Object.keys(this.authorFilter).length){
        impactAmount = 0
        for(let x = 0; x < this.userOpinions.length; x++){
          const userId = this.userOpinions[x]['user_id']
          if(typeof this.authorFilter[userId] !== 'undefined'){
            impactAmount += this.userOpinions[x]['impact']
          }
        }
        impactAmount = impactAmount / this.userOpinions.length
      }else{
        for(let x = 0; x < this.userOpinions.length; x++){
          if(this.userOpinions[x]['user_id'] * 1 === this.mainRelationUserId){
            impactAmount = this.userOpinions[x]['impact']
          }
        }
      }
      return impactAmount !== '' ? (impactAmount * 100).toFixed(0) : ''
    },
    userOpinions(){
      return typeof this.relation['user_opinions'] === 'object' ? this.relation['user_opinions'] : []
    },
    hasToggleableChildren(){
      return this.subRelations.length && (!this.hasFilterApplied || (this.hasFilterApplied && typeof this.parentRelationIdsWithPassedFilterChildren[this.relationId] !== 'undefined'))
    },
    isVirtualRelation(){
      return this.relation['is_virtual_relation']
    },
    isAuthorNotUser(){
      return this.user && this.user['id'] !==this.relation['user_id'] * 1
    },
    isDifferentAuthor(){
      return this.mainRelationData && this.mainRelationData['user_id'] * 1 !== this.relation['user_id'] * 1
    },
    isAuthorFilterPassed(){
      return this.relation === null || typeof this.relation['is_author_filter_passed'] === 'undefined' || this.relation['is_author_filter_passed']
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
      // if(this.relation['virtual_relation_id']){
      //   userOpinionScoreRelation = this.relation['virtual_relation'] && this.relation['virtual_relation']['user_opinion'] ? this.relation['virtual_relation']['user_opinion']['opinion_calculated_column']['score_relation'] : 0
      // }else 
      if(this.relation['user_opinion']){
        userOpinionScoreRelation = this.relation['user_opinion']['opinion_calculated_column']['score_relation']
      }
      return userOpinionScoreRelation
    },
    relationOpinionType(){
      let userOpinionType = -1
      // if(this.relation['virtual_relation_id']){
      //   userOpinionType = this.relation['virtual_relation'] && this.relation['virtual_relation']['user_opinion'] ? this.relation['virtual_relation']['user_opinion']['type'] : 0
      if(this.relation['user_opinion']){
        userOpinionType = this.relation['user_opinion']['type']
      }
      return userOpinionType
    },
    titleIds(){
        return '('+this.relation['parent_relation_id']+') [' + this.relationId + ']'
    }
  }
}
</script>
<style scoped>
.dragArea.isDragging {
  min-height: 75px;
  border: 1px dashed;
  padding: 10px;
}
.border-radius {
  border-radius: 8px;
}
.border-left-radius {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.border-right-radius {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
