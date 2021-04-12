<template>
  <div >
    <div class="image-background pt-3 px-4 mb-0 pb-8">
      <div class="container px-4">
        <SearchBar ref="searchBar" @search="filterSearch" :init_focus="false" />
      </div>
    </div>
    <div class='container pb-2 px-2 mt-n-3'>
      <div class="bg-white rounded-md shadow-light rounded-rounder">
        <div v-if="isLoading" class="text-center py-3">
          Searching... <fa icon="spinner" spin />
        </div>
        <div v-else class="mb-4">
          <div class="border-bottom border-width-6 px-3 py-2 d-flex align-items-center">
            <h6 class="text-primary mb-0 flex-fill text-uppercase d-flex align-items-center">
              <fa icon="bookmark" class="mr-2 text-lg" /> Bookmarks: {{filteredBookmarks.length}}
            </h6>
            <fa @click="clearSearch" icon="trash" class="text-light text-lg c-pointer" />
          </div>
          <div>
            <template v-for="userRelationBookmark in filteredBookmarks">
              <div v-if="userRelationBookmark['relation']" class=" border-bottom">
                <RelationRow :relation="userRelationBookmark['relation']" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserRelationBookmarkAPI from '@/api/user-relation-bookmark'
import Auth from '@/core/auth'
import ResultItem from '@/views/search/search-components/result-list-components/ResultItem'
import RelationRow from '@/components/RelationRow'
import SearchBar from '@/components/SearchBar'
export default {
  components: {
    ResultItem,
    RelationRow,
    SearchBar
  },
  mounted(){
    this.initialize()
  },
  data(){
    return {
      user: Auth.user(),
      userRelationBookmarks: [],
      filterKeyword: '',
      isLoading: false
    }
  },
  methods: {
    initialize(){
      this.search()
    },
    filterSearch(keyword){ // just filter the array instead of searching through api
      this.filterKeyword = keyword
    },
    search(search = null){
      this.isLoading = true
      this.userRelationBookmarks = []
      let param = {
        select: {
          relation: {
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
              user: {
                select: {
                ...(['id', 'username'])
                }
              },
              ...(['id', 'logic_tree_id', 'statement_id', 'user_id', 'created_at', 'updated_at', 'published_at'])
            },
            
          },
          
          ...(['user_id', 'relation_id', 'sub_relation_id'])
        },
        condition: [{
          column: 'user_id',
          value: this.user['id']
        }]
      }
      if(search && search !== ''){
        param['condition'].push({
          column: 'statement.text',
          clause: 'like',
          value: '%' + search + '%'
        })
      }
      UserRelationBookmarkAPI.retrieve(param).then(result => {
        if(result['data']){
          this.userRelationBookmarks = result['data']
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    clearSearch(){
      this.filterKeyword = ''
      this.$refs.searchBar._clear()
    }
  },
  computed: {
    filteredBookmarks(){
      if(this.filterKeyword !== ''){
        return this.userRelationBookmarks.filter(bookmark => {
          return bookmark['relation']
            && bookmark['relation']['statement']
            && bookmark['relation']['statement']['text']
            && (bookmark['relation']['statement']['text']).indexOf(this.filterKeyword) !== -1
        })
      }else{
        return this.userRelationBookmarks
      }
    }
  }
}
</script>
