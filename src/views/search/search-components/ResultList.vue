<template>
  <div class="">
    <div v-if="isLoading" class="text-center py-3">
      Searching... <fa icon="spinner" spin />
    </div>
    <div v-else class="mb-4">
      <div class="border-bottom px-3 py-2 d-flex align-items-center">
        <h6 class="text-primary mb-0 flex-fill text-uppercase d-flex align-items-center">
          <fa icon="search" class="mr-2 text-lg" /> Search Results: {{relations.length}}
        </h6>
        <fa @click="clearSearch" icon="trash" class="text-light text-lg c-pointer" />
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
// const itemsPerPage = 20
export default {
  components: {
    ResultItem
  },
  emits: ['is-loading', 'clear-search'],
  mounted(){
    let cachedSearchResult
    try {
      cachedSearchResult = JSON.parse(localStorage.getItem('search_page_result_cache'));
    } catch (exception) {
      cachedSearchResult = null;
    }
    this.relations = cachedSearchResult ? cachedSearchResult : []
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
        // limit: itemsPerPage,
        // offset: (this.page - 1) * itemsPerPage,
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
            select: ['description', 'published_at', 'statement_id']
          },
          user: {
            select: {
            ...(['id', 'username'])
            }
          },
          ...(['logic_tree_id', 'statement_id', 'user_id', 'updated_at', 'user_id', 'virtual_relation_id', 'published_at'])
        },
        condition: [{
          column: 'virtual_relation_id',
          value: null
        }],
        sort: [{
          column: 'updated_at',
          order: 'desc'
        }]
      }
      if(filter){
        if(typeof filter['statementText'] !== 'undefined' && filter['statementText'] !== ''){
          param['condition'].push({
            column: 'statement.text',
            clause: 'like',
            value: '%' + filter['statementText'] + '%'
          })
        } 
        if(typeof filter['mineOnly'] !== 'undefined' && filter['mineOnly'] !== false && this.user){
          param['condition'].push({
            column: 'user_id',
            value: this.user['id']
          })
        }
      }
      this.relations = []
      if (filter['statementText'] != '')  
              RelationAPI.retrieve(param).then(result => {
                if(filter){
                  localStorage.setItem('search_page_filter', JSON.stringify(filter))
                  localStorage.setItem('search_page_result_cache', JSON.stringify(result['data']))
                }else{
                  localStorage.removeItem('search_page_filter')
                  localStorage.removeItem('search_page_result_cache')
                }
                if(result['data']){
                  this.relations = result['data']
                }
                if(typeof result['additional_data']['total_result'] !== 'undefined'){
                  this.totalPageResult = result['additional_data']['total_result']
                }
              }).finally(() => {
                this.isLoading = false
              })
      else {
        this.isLoading = false
        localStorage.removeItem('search_page_filter')
        localStorage.removeItem('search_page_result_cache')
      }
    },
    clearSearch(){
      this.$emit('clear-search')
    }
  },
  watch: {
    isLoading(newData){
      this.$emit('is-loading', newData)
    }
  }
}
</script>