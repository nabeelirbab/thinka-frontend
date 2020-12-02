<template>
  <div class="container pt-4 bg-white height-max">
    <h5>These are your bookmarked statements</h5>
    <div>
      <div v-if="isLoading">Please wait... <fa icon="spinner" /></div>
      <div v-else-if="userRelationBookmarks.length">
        <template v-for="userRelationBookmark in userRelationBookmarks" :key="'asd' + userRelationBookmark['id']">
          <div v-if="userRelationBookmark['relation']" class="mb-2">
            <!-- <router-link :to="'/branch/' + userRelationBookmark['relation']['id']" class="text-dark">{{userRelationBookmark['relation']['statement']['text']}}</router-link> -->
            <ResultItem :relation="userRelationBookmark['relation']" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import UserRelationBookmarkAPI from '@/api/user-relation-bookmark'
import Auth from '@/core/auth'
import ResultItem from '@/views/search/search-components/result-list-components/ResultItem'
export default {
  components: {
    ResultItem
  },
  mounted(){
    this.initialize()
  },
  data(){
    return {
      user: Auth.user(),
      userRelationBookmarks: [],
      isLoading: false
    }
  },
  methods: {
    initialize(){
      this.isLoading = true
      this.userRelationBookmarks = []
      const param = {
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
              ...(['id', 'logic_tree_id', 'statement_id'])
            }
          },
          ...(['user_id', 'relation_id', 'sub_relation_id'])
        },
        condition: [{
          column: 'user_id',
          value: this.user['id']
        }]
      }
      UserRelationBookmarkAPI.retrieve(param).then(result => {
        console.log('result', result)
        if(result['data']){
          this.userRelationBookmarks = result['data']
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
