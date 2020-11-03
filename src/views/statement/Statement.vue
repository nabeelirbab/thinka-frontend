<template>
  <div class="px-2 px-md-4 py-2">
    <div v-if="statement">
      <MainStatement :statement="statement" class="mb-3"/>
      <div class="pl-3">
        <template v-for="(children, index) in statement['children']" :key="'children' + index">
          <SubStatement :statement="children" :level="1" />
        </template>
      </div>
      <hr />
      <AddStatementOption class="text-center"/>
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
import AddStatementOption from './statement-components/AddStatementOption'
export default {
  components: {
    MainStatement,
    SubStatement,
    AddStatementOption
  },
  data(){
    return {
      statement: null
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
