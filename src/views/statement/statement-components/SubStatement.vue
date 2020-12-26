<template>
  <div :style="{'padding-left': ((level - 1) * 20)+ 'px'}">
    <div
      v-if="!isLocked"
      v-show="!isEditing && !isFilteredOut"
      :class="statementClass"
      class="sub-statement statement-radius mb-1 c-pointer border-width border-dark"
    >
      <div class="d-flex align-items-center p-1">
        <div class="ml-0 pl-0" style="min-width:30px">
          <button v-if="!showStatement && statement['relations'].length" @click="showStatement = true" class="btn btn-sm btn-outline-secondary"><fa icon="level-up-alt" rotation="90" /></button>
          <button v-if="showStatement" @click="showStatement = false" class="btn btn-sm btn-outline-secondary"><fa icon="chevron-up"  /></button>
        </div>
        <div>
          <CircleLabel v-if="isUpdating" class="mr-1" title="Updating statement. Please wait..." data-toggle="tooltip" data-placement="top">
            <fa icon="spinner" spin />
          </CircleLabel>
          <div v-else-if="showImpact || showScope" class="pr-1 text-wrap px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center mr-1" style="height:35px; width:35px; overflow-wrap:anywhere">
            <small v-if="showImpact" class="text-nowrap">{{relationData['impact_amount'] !== null ? relationData['impact_amount'] : ''}}%</small>
            <small v-if="showScope" style="line-height: 1">
              {{localStatementData['statement']['scope_id'] ? scopes[findArrayIndex(localStatementData['statement']['scope_id'], scopes, 'id')]['description'] : null}}
            </small>
          </div>
        </div>
        <div class="flex-fill"  @click="statementClicked" >
          <div v-if="isDifferentAuthor && relation && relation['user']" class="text-sm">
            <span class="font-weight-bold mr-1">{{relation['user']['username']}}</span>
            <span v-if="relation['published_at']" class="font-italic text-muted">{{timeSince(relation['published_at'])}}</span>
          </div>
          <div class="d-flex text-dark text-left mb-1" style="font-size:0.9em"  >
              <div class="column" style="margin-left: 0; padding-left: 1em; text-indent: -0.9em;" :title="relationTypeName" data-toggle="tooltip" data-placement="top">
                <span class="text-danger font-weight-bold mr-1">{{relationTypeSymbol}}</span>
              </div>
              <div class="column text-break"><TextDisplayer :text="statementText"  /></div>
              <small v-if="isDevelopment && relationData" class="text-muted">#{{relationData['statement']['id']}} => #{{ relationData['id']}}</small>
          </div>
        </div>
        <div class="pl-1 d-flex ">
          <div v-if="showOpinion || showCTOpinion" class="px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px!important; width:35px!important">
            <small v-if="showOpinion">100%</small>
            <small v-else-if="showCTOpinion">-100%</small>
          </div>
          <template v-else-if="isActive">
            <router-link :to="'/branch/' + relation['id'] + '/t/' + toKebabCase(statementText).slice(0, 30)" ><CircleIconButton v-if="!enableDragging" icon="eye" button-class="btn-light bg-whitesmoke text-primary" /></router-link>
            <!-- <CircleIconButton v-if="relation && !relation['published_at']" @click.stop="editStatement" icon="edit" button-class="btn-light bg-whitesmoke text-primary ml-1" /> -->
            <CircleIconButton v-if="isActive && enableDragging && relation && !relation['published_at'] && !isUpdating" icon="arrows-alt" button-class="move-icon btn-light bg-whitesmoke text-primary ml-1" />
          </template>
          <div class="p-1 pl-2 flex-column" style="color: gray">
            <fa v-if="!relation['published_at'] && mainRelationData['published_at']" icon="briefcase" title="Private" />
            <!-- <fa v-else icon="sun" :title="relation['published_at']" /> -->
            <fa v-if="user && (user['id'] !== relation['user_id'])" icon="user" :title="relationData['user']['user_basic_information']['first_name'] + ' ' + relationData['user']['user_basic_information']['last_name']" />
          </div>
        </div>
      </div>

    </div>
    <CreateSubStatement v-if="isEditing" :relation="relation" :mode="'update'" :level="level + 1" :logic-tree-id="logicTreeId" :statement-id="statementId"  @save="statementEdited" @cancel="editSelectedStatement = false" :is-positive-statement="isPositiveStatement" :parent-relation-id="relation['id']"  />
    <CreateSubStatement v-if="createSubStatementParentId === relation['id']" @cancel="createSubStatementParentId = null" :is-positive-statement="isPositiveStatement" :parent-relation-id="relation['id']" :level="level + 1" :logic-tree-id="logicTreeId" :statement-id="statementId"  @save="$emit('save', {event: $event, mappingIndex: []})"/>

    <draggable
      v-if="relationData && !isLocked"
      v-show="showStatement && !(isDraggingStatement && selectedStatementData && selectedStatementData['id'] * 1 === relationData['id'] * 1)"
      :relationid="relationData['id']"
      :list="statement['relations']"
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
        <SubStatement :is-positive-statement="isPositiveStatement" :statement="element" :logic-tree-id="logicTreeId" :level="level + 1" @save="newSubStatementSaved($event, index)" @update="statementUpdated($event, index)" :statement-relation-index-map="statementRelationIndexMap.concat(index)" :group-name="groupName" />
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
    TextDisplayer
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
    statementRelationIndexMap: Array,
    groupName: {
      type: String,
      default: 'g1'
    }
  },
  emits: {
    save: null,
    update: null
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
      localStatementData: {scope: null},
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
      console.log('end dragging')
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
        this.localStatementData = JSON.parse(JSON.stringify(this.statement))
      },
      immediate: true
    },
    statementRelationIndexMap: {
      handler(statementRelationIndexMap){
        this.relationData = null
        if(statementRelationIndexMap){
          let currentRelation = this.mainRelationData
          const map = statementRelationIndexMap
          for(let x = 0; x < map.length; x++){
            const index = map[x]
            currentRelation = currentRelation['relations'][index]
          }
          this.relationData = currentRelation
        }
      },
      immediate: true
    },
  },
  computed: {
    isEditing(){
      return this.isActive && this.editSelectedStatement
    },
    isLocked(){ // if true, do not show
      if(this.statement && typeof this.statement['user_relation_context_locks'] !== 'undefined' &&this.statement['user_relation_context_locks'].length){
        for(let x = 0; x < this.statement['user_relation_context_locks'].length; x++){
          if(this.statement['user_relation_context_locks'][x]['root_relation_id'] * 1 === this.mainRelationData['id'] * 1){
            return false
          }
        }
        return true
      }else{
        return false
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
    isFilteredOut(){
      console.log('isFilteredOut', this.authorFilter, this.relation['user_id'])
      let failedTextFilter = this.statementTextFilter !== '' && (this.statementText.toLowerCase()).indexOf(this.statementTextFilter.toLowerCase())  === -1
      let failedAuthorFilter = Object.keys(this.authorFilter).length > 0 && typeof this.authorFilter[this.relation['user_id']] === 'undefined'
      return failedTextFilter || failedAuthorFilter
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
