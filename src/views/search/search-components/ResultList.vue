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
      let param = {
        select: {
          relation: {
            select: {
              ...[
                'logic_tree_id',
                'statement_id_2',
                'statement_id_1',
              ],
              statement_1: {
                select: ['id', 'text', 'created_at']
              }
            }
          },
          statement_type: {
            select: ['description']
          },
          logic_tree: {
            select: ['description', 'is_public', 'statement_id']
          },
          ...(['text', 'synopsis', 'comment', 'created_at', 'updated_at'])
        }
      }
      if(filter){
        param['condition'] = [{
          column: 'text',
          clause: 'like',
          value: '%' + filter + '%'
        }]
      }
      this.statements = []
      StatementAPI.retrieve(param).then(result => {
        console.log('result', result)
        if(result['data']){
          this.statements = result['data']
        }
      })
    }
  }
}
</script>