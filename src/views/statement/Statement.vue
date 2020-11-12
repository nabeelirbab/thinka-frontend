<template>
  <div class="px-2 px-md-4 py-2">
    <div v-if="isLoading" class="text-center">
      Please wait... <fa icon="spinner" spin />
    </div>
    <div v-else-if="statement" >
      <MainStatement :statement="statement" :logic-tree-id="logicTreeId" class="mb-1 c-pointer"/>
      <div class="toolbar-bottom-space">
        <template v-for="(children, index) in positiveStatements" :key="'children' + index">
          <SubStatement :is-positive-statement="true" :statement="children" :level="1" :logic-tree-id="logicTreeId" @save="addNewSubStatement($event, children)" />
        </template>
        <template v-for="(children, index) in negativeStatements" :key="'children' + index">
          <SubStatement :is-positive-statement="false" :statement="children" :level="1" :logic-tree-id="logicTreeId" @save="addNewSubStatement($event, children)" />
        </template>
        <CreateSubStatement :is-positive-statement="true" :logic-tree-id="logicTreeId" :statement-id="statementId" @save="addNewSubStatement" />
        <div class="text-center text-secondary"><small>{{typeof statement['children'] !== 'undefined' && statement['children'].length ? '- End of Line -' : 'No Sub Statement'}}</small></div>
      </div>
      <!-- <AddStatementOption class="text-center"/> -->
      <Toolbar  class="fixed toolbar" />
    </div>
    <div v-else>
      Statement Not Found
    </div>
  </div>
</template>
<script>
import StatementAPI from '@/api/statement.js'
import MainStatement from './statement-components/MainStatement'
import SubStatement from './statement-components/SubStatement'
import CreateSubStatement from './statement-components/CreateSubStatement'
// import AddStatementOption from './statement-components/AddStatementOption'
import Toolbar from './statement-components/Toolbar'
import GlobalData from './global-data'
export default {
  components: {
    MainStatement,
    SubStatement,
    CreateSubStatement,
    // AddStatementOption,
    Toolbar
  },
  data(){
    return {
      isLoading: false,
      statement: null,
      selectedStatementId: GlobalData.selectedStatementId,
    }
  },
  methods: {
    initialize(statementId){
      // this.retrieveTree(statementId)
      this.retrieveRecursiveTree(statementId)
    },
    retrieveTree(statementId){
      this.isLoading = true
      StatementAPI.retrieveTree({id: statementId}).then(result => {
        this.statement = result
      }).finally(() => {
        this.isLoading = false
      })
    },
    retrieveRecursiveTree(statementId){
      this.isLoading = true
      const param = {
        id: statementId * 1,
        select: {
          recursive_down_relations: {
            select: ['logic_tree_id', 'statement_id_1', 'statement_id_2', 'relation_type_id']
          },
          relation: {
            select: [
              'logic_tree_id',
              'statement_id_2',
              'statement_id_1',
            ]
          },
          logic_tree: {
            select: ['description', 'is_public']
          },
          ...(['text', 'synopsis', 'comment'])
        }
      }
      StatementAPI.get(param).then(result => {
        this.statement = result['data']
      }).finally(() => {
        this.isLoading = false
      })
    },
    addNewSubStatement(newSubStatement, parentStatement = null){
      if(parentStatement === null){
        let recursiveDownRelations = newSubStatement['relation']
        delete newSubStatement['relation']
        recursiveDownRelations['recursive_down_statement'] = newSubStatement
        recursiveDownRelations['recursive_down_statement']['recursive_down_relations'] = []
        this.statement['recursive_down_relations'].push(recursiveDownRelations)
      }else{
        let newRecursiveDownRelations = newSubStatement['event']['relation']
        delete newSubStatement['event']['relation']
        newRecursiveDownRelations['recursive_down_statement'] = newSubStatement['event']
        newRecursiveDownRelations['recursive_down_statement']['recursive_down_relations'] = []
        const parentStatementId = parentStatement['recursive_down_statement']['id']
        let currentStatement = this.statement['recursive_down_relations'][this.statementIdIndexLookUp[parentStatementId]]
        const mappingIndex = newSubStatement['mappingIndex']
        for(let index = mappingIndex.length - 1; index >= 0; index--){
          console.log(mappingIndex[index])
          currentStatement = currentStatement['recursive_down_statement']['recursive_down_relations'][mappingIndex[index]]
        }
        console.log('currentStatement', currentStatement['recursive_down_statement']['recursive_down_relations'])
        console.log('newRecursiveDownRelations', newRecursiveDownRelations)
        currentStatement['recursive_down_statement']['recursive_down_relations'].push(newRecursiveDownRelations)
      }
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
  },
  computed: {
    statementId(){
      return this.$route.params.statementId * 1
    },
    logicTreeId(){
      return this.$route.params.logicTreeId * 1
    },
    negativeStatements(){
      if(this.statement && typeof this.statement['recursive_down_relations'] !== 'undefined'){
        return this.statement['recursive_down_relations'].filter(childStatement => {
          return childStatement['relation_type_id'] * 1 === 1
        })
      }else{
        return []
      }
    },
    positiveStatements(){
      if(this.statement && typeof this.statement['recursive_down_relations'] !== 'undefined'){
        return this.statement['recursive_down_relations'].filter(childStatement => {
          return childStatement['relation_type_id'] * 1 === 2
        })
      }else{
        return []
      }
    },
    statementIdIndexLookUp(){
      if(this.statement && typeof this.statement['recursive_down_relations'] !== 'undefined'){
        let IdIndexLookUp = {}
        this.statement['recursive_down_relations'].forEach((childStatement, index) => {
          IdIndexLookUp[childStatement['recursive_down_statement']['id']] = index
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
  padding-bottom: 73px
}

</style>