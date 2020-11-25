<template>
  <div class="">
    <div v-if="isLoading" class="text-center">
      Please wait... <fa icon="spinner" spin />
    </div>
    <div v-else-if="statement === null">
      Statement Not Found
    </div>
    <div v-show="!isLoading && statement" >
      <TopToolbar :main-relation="statement ? statement : {}" :statement-id="statementId" :parent-relation-id="parentRelationId" :selected-statement-id="selectedStatementId * 1" />
      <div class="container py-2 bg-white">
        <MainStatement v-if="statement" ref="mainStatement" @height-changed="mainStatementHeight = $event" :relation="statement" :logic-tree-id="logicTreeId" class="mb-1 c-pointer"/>
        <div @click="selectMainStatement" class="toolbar-bottom-space">
          <div ref="positiveWindow" class="statement-window" :style="{height: positiveStatementHeight + 'px', 'max-height': (totaRelevanceWindowHeight - 50) + 'px', 'min-height': (50) + 'px'}">
            <template v-for="(children, index) in positiveStatements" :key="'children' + index">
              <SubStatement :is-positive-statement="true" :statement="children" :level="1" :logic-tree-id="logicTreeId" @save="addNewSubStatement($event, children)" />
            </template>
            <CreateSubStatement v-if="selectedStatementId === statementId"  :is-positive-statement="true" :logic-tree-id="logicTreeId" :parent-relation-id="statement['id']" :statement-id="statementId" @save="addNewSubStatement" />
            <div class="text-center text-secondary"><small>{{positiveStatements.length ? '- End of Line -' : 'No supporting statements'}}</small></div>
          </div>
          <WindowSeparator ref="separator" :y-range="totaRelevanceWindowHeight - 50" @move="resizePositiveStatement" />
          <div ref="negativeWindow" class="statement-window" :style="{height: (totaRelevanceWindowHeight - positiveStatementHeight) + 'px', 'max-height': (totaRelevanceWindowHeight - 50) + 'px', 'min-height': (50) + 'px'}">
            <template v-for="(children, index) in negativeStatements" :key="'children' + index">
              <SubStatement  :is-positive-statement="false" :statement="children" :level="1" :logic-tree-id="logicTreeId" @save="addNewSubStatement($event, children)" />
            </template>
            <CreateSubStatement v-if="selectedStatementId === statementId"  :is-positive-statement="false" :logic-tree-id="logicTreeId" :parent-relation-id="statement['id']" :statement-id="statementId" @save="addNewSubStatement" />
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
import StatementAPI from '@/api/statement.js'
import RelationAPI from '@/api/relation.js'
import MainStatement from './statement-components/MainStatement'
import SubStatement from './statement-components/SubStatement'
import CreateSubStatement from './statement-components/CreateSubStatement'
// import AddStatementOption from './statement-components/AddStatementOption'
import Toolbar from './statement-components/Toolbar'
import TopToolbar from './statement-components/TopToolBar'
import GlobalData from './global-data'

export default {
  components: {
    // VueResizable,
    WindowSeparator,
    MainStatement,
    SubStatement,
    CreateSubStatement,
    // AddStatementOption,
    TopToolbar,
    Toolbar
  },
  mounted(){
  },
  data(){
    return {
      isLoading: false,
      statement: null,
      selectedStatementId: GlobalData.selectedStatementId,
      statementTextFilter: GlobalData.statementTextFilter,
      backHistory: GlobalData.backHistory,
      mainStatementHeight: 0,
      positiveStatementHeight: 100,
    }
  },
  methods: {
    selectMainStatement($e){
      if($e.target === this.$refs.positiveWindow || $e.target === this.$refs.negativeWindow){
        this.$refs.mainStatement._statementClicked()
      }
    },
    initialize(relationId){
      // this.retrieveTree(statementId)
      // this.retrieveRecursiveTree(statementId)
      this.retrieveRelation(relationId)
      this.selectedStatementId = 0
      this.statementTextFilter = ''
    },
    retrieveTree(statementId){
      this.isLoading = true
      StatementAPI.retrieveTree({id: statementId}).then(result => {
        this.statement = result
      }).finally(() => {
        this.isLoading = false
      })
    },
    retrieveRelation(relationId){
      this.isLoading = true
      const param = {
        id: relationId * 1,
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
            select: ['text', 'synopsis', 'comment', 'scope', 'scope_id']
          },
          ...(['parent_relation_id', 'logic_tree_id', 'statement_id', 'relation_type_id', 'relevance_window', 'user_id'])
        }
      }
      RelationAPI.retrieve(param).then(result => {
        if(result['data']){
          this.statement = result['data']
          console.log(result['data'])
          setTimeout(() => {
            this.resizePositiveStatement()
            this.setDefaultSeparator()
          }, 1000)
          this.isLoading = false
        }else{
          this.isLoading = false
        }
      }).catch(() => {
        this.isLoading = false
      })
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
        this.$refs.separator._setOffset(((this.totaRelevanceWindowHeight / 2) - positiveInnerHeight) * -1)
      }else if(negativeInnerHeight < (this.totaRelevanceWindowHeight / 2)){
        this.$refs.separator._setOffset(((this.totaRelevanceWindowHeight / 2) - negativeInnerHeight) )
      }
    },
    generateRecursiveRelationsSelect(currentDeep, deep = 10){
      let selectParam = {
        statement: {
          select: ['id', 'text', 'synopsis', 'comment', 'scope', 'scope_id']
        },
        ...(['relation_type_id', 'statement_id', 'parent_relation_id', 'is_public', 'relevance_window', 'relevance_row', 'user_id'])
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
        this.statement['relations'].push(recursiveDownRelations)
      }else{
        let newRecursiveDownRelations = newSubStatement['event']['relation']
        delete newSubStatement['event']['relation']
        newRecursiveDownRelations['statement'] = newSubStatement['event']
        newRecursiveDownRelations['relations'] = []
        const parentStatementId = parentStatement['statement']['id']
        let currentStatement = this.statement['relations'][this.statementIdIndexLookUp[parentStatementId]]
        const mappingIndex = newSubStatement['mappingIndex']
        for(let index = mappingIndex.length - 1; index >= 0; index--){
          currentStatement = currentStatement['relations'][mappingIndex[index]]
        }
        currentStatement['relations'].push(newRecursiveDownRelations)
      }
    },
    resizePositiveStatement(){
      this.positiveStatementHeight = ((this.totaRelevanceWindowHeight) / 2) + this.$refs.separator._getYOffset()
    }
  },
  watch: {
    statementId: {
      handler(newData){
        if(newData){
          this.initialize(this.statementId)
        }
      },
      immediate: true
    },
    mainStatementHeight(){
      console.log('mainstatementheight', this.mainStatementHeight)
      setTimeout(() => {
        this.resizePositiveStatement()
      }, 5)
    }
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
      return this.statement ? this.statement['parent_relation_id'] : null
    },
    statementId(){
      return this.$route.params.relationId * 1
    },
    logicTreeId(){
      return this.statement ? this.statement['logic_tree_id'] : null// this.$route.params.logicTreeId * 1
    },
    positiveStatements(){
      if(this.statement && typeof this.statement['relations'] !== 'undefined'){
        return this.statement['relations'].filter(childStatement => {
          return childStatement['relevance_window'] * 1 === 0
        })
      }else{
        return []
      }
    },
    negativeStatements(){
      if(this.statement && typeof this.statement['relations'] !== 'undefined'){
        return this.statement['relations'].filter(childStatement => {
          return childStatement['relevance_window'] * 1 === 1
        })
      }else{
        return []
      }
    },
    statementIdIndexLookUp(){
      if(this.statement && typeof this.statement['relations'] !== 'undefined'){
        let IdIndexLookUp = {}
        this.statement['relations'].forEach((childStatement, index) => {
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