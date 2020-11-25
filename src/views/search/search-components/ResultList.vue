<template>
  <div class="mb-4 pb-2">
    <div v-if="isLoading" class="text-center">
      Searching... <fa icon="spinner" spin />
    </div>
    <div v-else class="mb-4">
      <div class="mb-2">
        Results: {{totalPageResult}}
      </div>
      <template v-for="(relation, index) in relations" :key="'result' + index">
        <ResultItem :relation="relation" />
      </template>
      <nav v-if="totalPageResult" aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1"><fa icon="chevron-left"></fa></a>
          </li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item">
            <a class="page-link" href="#"><fa icon="chevron-right"/></a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script>
// import StatementAPI from '@/api/statement.js'
import RelationAPI from '@/api/relation.js'
import ResultItem from './result-list-components/ResultItem'
import Auth from '@/core/auth'
const itemsPerPage = 20
export default {
  components: {
    ResultItem
  },
  emits: ['is-loading'],
  mounted(){
    
  },
  data(){
    return {
      user: Auth.user(),
      isLoading: false,
      relations: [],
      page: 1,
      totalPageResult: 0,
      currentFilter: null
    }
  },
  methods: {
    _search(filter = null){
      this.currentFilter = filter
      this.isLoading = true
      let param = {
        limit: itemsPerPage,
        offset: (this.page - 1) * itemsPerPage,
        select: {
          statement: {
            select: {
              statement_type: {
                select: ['description']
              },
              ...(['statement_type_id', 'text', 'synopsis', 'comment', 'created_at', 'updated_at', 'statement_type_id'])
            }
          },
          parent_relation: {
            select: {
              statement: {
                select: ['id', 'text', 'created_at']
              },
              ...(['id', 'statement_id', 'logic_tree_id'])
            }
          },
          logic_tree: {
            select: ['description', 'is_public', 'statement_id']
          },
          ...(['logic_tree_id', 'statement_id'])
        }
      }
      if(filter){
        if(typeof filter['statementText'] !== 'undefined' && filter['statementText'] !== ''){
          param['condition'] = [{
            column: 'statement.text',
            clause: 'like',
            value: '%' + filter['statementText'] + '%'
          }]
        } 
        if(typeof filter['mineOnly'] !== 'undefined' && filter['mineOnly'] !== false && this.user){
          param['condition'] = [{
            column: 'user_id',
            value: this.user['id']
          }]
        }
      }
      this.relations = []
      RelationAPI.retrieve(param).then(result => {
        if(result['data']){
          this.relations = result['data']
        }
        if(typeof result['additional_data']['total_result'] !== 'undefined'){
          this.totalPageResult = result['additional_data']['total_result']
        }
      }).finally(() => {
        this.isLoading = false
      })
    }
  },
  watch: {
    isLoading(newData){
      this.$emit('is-loading', newData)
    }
  }
}
</script>