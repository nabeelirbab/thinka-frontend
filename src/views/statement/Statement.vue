<template>
  <div class="">
    <div v-if="isLoading" class="text-center">
      Please wait... <fa icon="spinner" spin />
    </div>
    <div v-else-if="mainRelationData === null" class="text-center mt-4">
      <fa icon="exclamation-triangle" /> Statement Not Found or is Private <br />
      <LogInModal v-if="authenticationStatus === 'unauthenticated'" :has-button="true" />
      <router-link v-else class="btn btn btn-outline-dark" to="/search"><fa icon="search" /> Find Statements</router-link>
    </div>
    <div v-show="!isLoading && mainRelationData" >
      <TopToolbar :main-relation="mainRelationData ? mainRelationData : {}" :statement-id="statementId" :parent-relation-id="parentRelationId" :selected-statement-id="selectedStatementId * 1" :sub-relation-ids="subRelationIds" />
      <div class="container py-2 bg-white">
        <MainStatement v-if="mainRelationData" ref="mainStatement" @updated="mainStatementUpdated" @height-changed="mainStatementHeight = $event" :relation="mainRelationData" :logic-tree-id="logicTreeId" class="mb-1 c-pointer"/>
        <div v-if="mainRelationData" @click1="selectMainStatement" class="toolbar-bottom-space">
          <div ref="positiveWindow" class="statement-window" :style="{height: positiveStatementHeight + 'px', 'max-height': (totaRelevanceWindowHeight - 50) + 'px', 'min-height': (50) + 'px'}">
            <draggable
              :list="mainRelationData['relations']"
              :disable="true"
              class="dragArea"
              item-key="id"
              :group="{ name: 'g1' }"
              @end="relationsRearrange"
            >
              <template #item="{element, index}">
                <div v-if="element['relevance_window'] === 0">
                  <SubStatement :statement="element" :level="1" :logic-tree-id="logicTreeId" @save="addNewSubStatement($event, element)" @update="updateNewSubStatement($event, index)" :is-positive-statement="true" :statement-relation-index-map="[index]"/>
                </div>
              </template>
            </draggable>
            <CreateSubStatement v-if="activeCreateWindow === 'support' && authenticationStatus === 'authenticated'"  :is-positive-statement="true" :logic-tree-id="logicTreeId" :parent-relation-id="mainRelationData['id']" :statement-id="statementId" @save="addNewSubStatement" />
            <div v-else class="text-center pt-1">
              <button v-if="authenticationStatus === 'authenticated'" @click="activeCreateWindow = 'support'" class="btn btn-outline-secondary">Add Supporting Statement</button>
            </div>
            <div class="text-center text-secondary"><small>{{positiveStatements.length ? '- End of Line -' : 'No supporting statements'}}</small></div>
          </div>
          <WindowSeparator ref="separator" :y-range="totaRelevanceWindowHeight - 50" @move="resizePositiveStatement" />
          <div ref="negativeWindow" class="statement-window" :style="{height: (totaRelevanceWindowHeight - positiveStatementHeight) + 'px', 'max-height': (totaRelevanceWindowHeight - 50) + 'px', 'min-height': (50) + 'px'}">
            <draggable
              :list="mainRelationData['relations']"
              :disable="true"
              class="dragArea"
              item-key="id"
              :group="{ name: 'g2' }"
              @end="relationsRearrange"
            >
              <template #item="{element, index}">
                <div v-if="element['relevance_window'] === 1">
                  <SubStatement :statement="element" :level="1" :logic-tree-id="logicTreeId" @save="addNewSubStatement($event, element)" @update="updateNewSubStatement($event, index)" :is-positive-statement="false" :statement-relation-index-map="[index]" :group-name="'g2'"/>
                </div>
              </template>
            </draggable>
            <CreateSubStatement v-if="activeCreateWindow === 'counter' && authenticationStatus === 'authenticated'"  :is-positive-statement="false" :logic-tree-id="logicTreeId" :parent-relation-id="mainRelationData['id']" :statement-id="statementId" @save="addNewSubStatement" />
            <div v-else class="text-center pt-1">
              <button v-if="authenticationStatus === 'authenticated'" @click="activeCreateWindow = 'counter'" class="btn btn-outline-secondary">Add Counter Statement</button>
            </div>
            <div class="text-center text-secondary"><small>{{negativeStatements.length ? '- End of Line -' : 'No counter statements'}}</small></div>
          </div>
        </div>
      </div>
      <Toolbar class="fixed toolbar" />
    </div>
  </div>
</template>
<script>
// import VueResizable from 'vue-resizable'
import WindowSeparator from './statement-components/WindowSeperator.vue'
// import StatementAPI from '@/api/statement.js'
import RelationAPI from '@/api/relation.js'
import MainStatement from './statement-components/MainStatement'
import SubStatement from './statement-components/SubStatement'
import CreateSubStatement from './statement-components/CreateSubStatement'
// import AddStatementOption from './statement-components/AddStatementOption'
import Toolbar from './statement-components/Toolbar'
import TopToolbar from './statement-components/TopToolBar'
import GlobalData from './global-data'
import LogInModal from '@/components/login/LogInModal'
import Auth from '@/core/auth'

import draggable from 'vuedraggable'

export default {
  components: {
    // VueResizable,
    WindowSeparator,
    MainStatement,
    SubStatement,
    CreateSubStatement,
    // AddStatementOption,
    TopToolbar,
    Toolbar,
    LogInModal,
    draggable
  },
  mounted(){
  },
  data(){
    return {
      isLoading: false,
      mainRelationData: GlobalData.mainRelationData,
      selectedStatementId: GlobalData.selectedStatementId,
      statementTextFilter: GlobalData.statementTextFilter,
      deletedRelationId: GlobalData.deletedRelationId,
      backHistory: GlobalData.backHistory,
      mainStatementHeight: 0,
      positiveStatementHeight: 100,
      authenticationStatus: Auth.status(),
      user: Auth.user(),
      activeCreateWindow: false,
      subRelationIds: [], // used to update all the sub statements
      subStatementMap: {} // trace the location of the substatement given the statement id
    }
  },
  methods: {
    selectMainStatement($e){
      if($e.target === this.$refs.positiveWindow || $e.target === this.$refs.negativeWindow){
        this.$refs.mainStatement._statementClicked()
      }
    },
    initialize(relationId){
      // this.retrieveRecursiveTree(statementId)
      this.retrieveRelation(relationId)
      this.selectedStatementId = 0
      this.statementTextFilter = ''
    },
    retrieveRelation(relationId){
      this.isLoading = true
      this.subRelationIds = []
      this.statement = null
      const param = {
        select: {
          logic_tree: {
            select: ['description', 'is_public']
          },
          relations: {
            select: this.generateRecursiveRelationsSelect(1),
            sort: [{column: 'relevance_row', order: 'asc'}]
          },
          user_relation_bookmarks: {
            select: ['user_id', 'relation_id', 'sub_relation_id']
          },
          statement: {
            select: ['text', 'synopsis', 'comment', 'scope', 'scope_id', 'statement_type_id']
          },
          ...(['parent_relation_id', 'logic_tree_id', 'statement_id', 'relation_type_id', 'relevance_window', 'user_id', 'is_public', 'logic_tree_id', 'impact', 'impact_amount'])
        },
        condition: [{
          column: 'id',
          value: relationId * 1
        }]
      }
      RelationAPI.retrieve(param).then(result => {
        if(result['data'] && result['data'].length){
          this.mainRelationData = result['data'][0]
          this.setMainRelation(this.mainRelationData)
        }else{
          this.isLoading = false
        }
      }).catch((error) => {
        console.error(error)
        this.isLoading = false
      })
    },
    setMainRelation(statement){
      this.statement = statement
      this.isLoading = true
      this.subStatementMap = {}
      this.subRelationIds = this.getSubRelationIds(statement)
      setTimeout(() => {
        this.resizePositiveStatement()
        this.setDefaultSeparator()
      }, 1200)
      this.isLoading = false
    },
    getSubRelationIds(relation, parentIds = []){
      let ids = []
      relation['relations'].forEach((relation, index) => {
        ids.push({id: relation['id']})
        this.subStatementMap[relation['id']] = parentIds.concat([index])
        if(relation['relations'].length){
          ids = ids.concat(this.getSubRelationIds(relation, this.subStatementMap[relation['id']]))
        }
      })
      return ids
    },
    setDefaultSeparator(){
      const negativeChildren = this.$refs.negativeWindow.children
      let negativeInnerHeight = 0
      for(let x = 0; x < negativeChildren.length; x++){
        negativeInnerHeight += negativeChildren[x].offsetHeight
      }
      const positiveChildren = this.$refs.positiveWindow.children
      let positiveInnerHeight = 0
      for(let x = 0; x < positiveChildren.length; x++){
        positiveInnerHeight += positiveChildren[x].offsetHeight
      }
      if(positiveInnerHeight < (this.totaRelevanceWindowHeight / 2)){
        this.$refs.separator._setOffset(((this.totaRelevanceWindowHeight / 2) - positiveInnerHeight - 100) * -1)
      }else if(negativeInnerHeight < (this.totaRelevanceWindowHeight / 2)){
        this.$refs.separator._setOffset(((this.totaRelevanceWindowHeight / 2) - negativeInnerHeight) )
      }
    },
    generateRecursiveRelationsSelect(currentDeep, deep = 10){
      let selectParam = {
        statement: {
          select: ['id', 'text', 'synopsis', 'comment', 'scope', 'scope_id', 'statement_type_id']
        },
        ...(['relation_type_id', 'statement_id', 'parent_relation_id', 'is_public', 'relevance_window', 'relevance_row', 'user_id', 'is_public', 'logic_tree_id', 'impact', 'impact_amount'])
      }
      if(currentDeep <= deep){
        selectParam['relations'] = {
          select: this.generateRecursiveRelationsSelect(++currentDeep),
          sort: [{column: 'relevance_row', order: 'asc'}]
        }
      }
      return selectParam
    },
    addNewSubStatement(newSubStatement, parentStatement = null){
      if(parentStatement === null){
        let recursiveDownRelations = newSubStatement['relation']
        delete newSubStatement['relation']
        recursiveDownRelations['statement'] = newSubStatement
        recursiveDownRelations['relations'] = []
        recursiveDownRelations['user_id'] = this.user['id']
        this.mainRelationData['relations'].push(recursiveDownRelations)
      }else{
        let newRecursiveDownRelations = newSubStatement['event']['relation']
        delete newSubStatement['event']['relation']
        newRecursiveDownRelations['statement'] = newSubStatement['event']
        newRecursiveDownRelations['user_id'] = this.user['id']
        newRecursiveDownRelations['relations'] = []
        const parentStatementId = parentStatement['statement']['id']
        let currentStatement = this.mainRelationData['relations'][this.statementIdIndexLookUp[parentStatementId]]
        const mappingIndex = newSubStatement['mappingIndex']
        for(let index = mappingIndex.length - 1; index >= 0; index--){
          currentStatement = currentStatement['relations'][mappingIndex[index]]
        }
        currentStatement['relations'].push(newRecursiveDownRelations)
      }
      this.subStatementMap = {}
      this.subRelationIds = this.getSubRelationIds(this.mainRelationData)
    },
    updateNewSubStatement(newSubStatement, firstLevelIndex){
      let currentStatement = this.mainRelationData['relations'][firstLevelIndex]
      let updatedStatement = newSubStatement
      if(typeof newSubStatement['mappingIndex'] !== 'undefined'){
        updatedStatement = newSubStatement['event']
        const mappingIndex = newSubStatement['mappingIndex']
        for(let index = mappingIndex.length - 1; index >= 0; index--){
          currentStatement = currentStatement['relations'][mappingIndex[index]]
        }
      }
      currentStatement['statement']['text'] = updatedStatement['text']
      currentStatement['statement']['statement_type_id'] = updatedStatement['statement_type_id']
      currentStatement['statement']['id'] = updatedStatement['id']
      currentStatement['parent_relation_id'] = updatedStatement['relation']['parent_relation_id']
      currentStatement['logic_tree_id'] = updatedStatement['relation']['logic_tree_id']
      currentStatement['relation_type_id'] = updatedStatement['relation']['relation_type_id']
      currentStatement['relevance_row'] = updatedStatement['relation']['relevance_row']
      currentStatement['relevance_window'] = updatedStatement['relation']['relevance_window']
      console.log('currentStatement', updatedStatement['relation'])
    },
    mainStatementUpdated(updatedMainStatement){
      console.log(updatedMainStatement, this.mainRelationData)
      this.mainRelationData['statement']['text'] = updatedMainStatement['text']
      this.mainRelationData['statement']['statement_type_id'] = updatedMainStatement['statement_type_id']
      this.mainRelationData['statement']['id'] = updatedMainStatement['id']
      this.mainRelationData['relation_type_id'] = updatedMainStatement['relation']['relation_type_id']
    },
    resizePositiveStatement(){
      if(this.$refs.separator){
        this.positiveStatementHeight = ((this.totaRelevanceWindowHeight) / 2) + this.$refs.separator._getYOffset()
      }
    },
    relationsRearrange(e){
      console.log(e)
      this.getSubRelationIds(this.mainRelationData)
    }
  },
  watch: {
    statementId: {
      handler(statementId){
        if(statementId){
          const lastViewRelationId = localStorage.getItem('last_viewed_relation_id')
          if(lastViewRelationId !== statementId + '' || this.mainRelationData === null){
            console.log('initialized', this.mainRelationData)
            this.initialize(statementId)
          }else{
            this.setMainRelation(this.mainRelationData)
            console.log('not initialized')
          }

          localStorage.setItem('last_viewed_relation_id', this.statementId)
        }
      },
      immediate: true
    },
    mainStatementHeight(){
      setTimeout(() => {
        this.resizePositiveStatement()
      }, 5)
    },
    selectedStatementId(){
      this.activeCreateWindow = false
    },
    deletedRelationId(deletedRelationId){
      if(deletedRelationId){
        const map = this.subStatementMap[deletedRelationId]
        let currentRelation = this.mainRelationData
        for(let x = 0; x < map.length - 1; x++){
          const index = map[x]
          currentRelation = currentRelation['relations'][index]
        }
        console.log(currentRelation['relations'])
        currentRelation['relations'].splice(map[map.length - 1], 1)
        console.log(currentRelation['relations'])
        this.subStatementMap = {}
        this.subRelationIds = this.getSubRelationIds(this.mainRelationData)
      }
    }
    // deletedRelationId(deletedRelationId){
    //   if(deletedRelationId){
    //     const map = this.subStatementMap[deletedRelationId]
    //     let currentRelation = this.statement
    //     for(let x = 0; x < map.length - 1; x++){
    //       const index = map[x]
    //       currentRelation = currentRelation['relations'][index]
    //     }
    //     currentRelation['relations'].splice(map[map.length - 1], 1)
    //     this.subStatementMap = {}
    //     this.subRelationIds = this.getSubRelationIds(this.statement)
    //   }
    // }
  },
  computed: {
    totaRelevanceWindowHeight(){
      const headerHeight = 90 // px
      const separatorHeight = 18 // px
      const bodyTopPadding = 8 // px
      const toolbarHeight = 76 //px
      const windowHeight = window.innerHeight // px
      const totaRelevanceWindowHeight = windowHeight - headerHeight - separatorHeight - bodyTopPadding - toolbarHeight
      return totaRelevanceWindowHeight - this.mainStatementHeight
    },
    parentRelationId(){
      return this.mainRelationData ? this.mainRelationData['parent_relation_id'] : null
    },
    statementId(){
      return this.$route.params.relationId * 1
    },
    logicTreeId(){
      return this.mainRelationData ? this.mainRelationData['logic_tree_id'] : null// this.$route.params.logicTreeId * 1
    },
    positiveStatements(){
      if(this.mainRelationData && typeof this.mainRelationData['relations'] !== 'undefined'){
        return this.mainRelationData['relations'].filter(childStatement => {
          return childStatement['relevance_window'] * 1 === 0
        })
      }else{
        return []
      }
    },
    negativeStatements(){
      if(this.mainRelationData && typeof this.mainRelationData['relations'] !== 'undefined'){
        return this.mainRelationData['relations'].filter(childStatement => {
          return childStatement['relevance_window'] * 1 === 1
        })
      }else{
        return []
      }
    },
    statementIdIndexLookUp(){
      if(this.mainRelationData && typeof this.mainRelationData['relations'] !== 'undefined'){
        let IdIndexLookUp = {}
        this.mainRelationData['relations'].forEach((childStatement, index) => {
          IdIndexLookUp[childStatement['statement']['id']] = index
        })
        return IdIndexLookUp
      }else{
        return {}
      }
    }
  }
}
</script>
<style scoped>
.toolbar-bottom-space{
  padding-bottom: 60px
}
.statement-window {
  overflow-y: auto;
  resize: vertical;
}
</style>