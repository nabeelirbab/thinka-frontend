<template>
  <div class="px-2 px-md-4 py-2">
    <div v-if="statement" >
      <MainStatement :statement="statement" class="mb-1 c-pointer"/>
      <div class="toolbar-bottom-space">
        <template v-for="(children, index) in statement['children']" :key="'children' + index">
          <SubStatement :statement="children" :level="1" />
        </template>
        <div class="text-center text-secondary"><small>{{typeof statement['children'] !== 'undefined' && statement['children'].length ? '- End of Line -' : 'No Sub Statemetn'}}</small></div>
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
// import AddStatementOption from './statement-components/AddStatementOption'
import Toolbar from './statement-components/Toolbar'
import GlobalData from './global-data'
export default {
  components: {
    MainStatement,
    SubStatement,
    // AddStatementOption,
    Toolbar
  },
  data(){
    return {
      statement: null,
      selectedStatementId: GlobalData.selectedStatementId,
    }
  },
  methods: {
    initialize(statementId){
      StatementAPI.get({id: statementId}).then(result => {
        console.log('result', result)
        this.statement = result
      })
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
    }
  },
  computed: {
    statementId(){
      return this.$route.params.statementId
    }
  }
}
</script>
<style scoped>
.toolbar-bottom-space{
  padding-bottom: 73px
}

</style>