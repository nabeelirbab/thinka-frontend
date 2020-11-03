<template>
  <div>
    <div class="mb-2">
      Results: {{statements.length}}
    </div>
    <template v-for="(statement, index) in statements" :key="'result' + index">
      <ResultItem :statement="statement" />
    </template>
  </div>
</template>
<script>
import StatementAPI from '@/api/statement.js'
import ResultItem from './result-list-components/ResultItem'
export default {
  components: {
    ResultItem
  },
  mounted(){
    this._search()
  },
  data(){
    return {
      statements: []
    }
  },
  methods: {
    _search(filter = null){
      StatementAPI.get(filter).then(result => {
        console.log('result', result)
        this.statements = result
      })
    }
  }
}
</script>