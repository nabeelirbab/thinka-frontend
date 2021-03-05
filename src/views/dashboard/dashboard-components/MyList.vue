<template>
  <div class="p-0">
    <!-- <h5 class="py-3 px-4 mb-0 bg-whitesmoke"><fa icon="list" /> My Trees</h5> -->
    <div class="p-0" style="overflow-y:auto; height: 50vh">
      <div v-if="isLoading" class="text-center">Please wait... <fa icon="spinner" spin /></div>
      <div >
        <div v-for="(trend) in relations" class="border-bottom p-2 px-3">
          <RelationRow
            :relation="trend"
            :root-parent-statement-text="trend['root_parent_statement_text']"
          />
          <!-- <div class="flex-fill text-break">
            <small>{{timeSince(trend['updated_at'])}}</small>{{"   "}}
            <span  style="color: gray"><fa v-if="trend['published_at']" icon="sun" /><fa v-else icon="briefcase" /></span><br />
            <router-link :to="'/branch/' + trend['id'] + '/t/' + toKebabCase(trend['text']).slice(0,30)">{{trend['text']}}</router-link>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RelationAPI from '@/api/relation'
import RelationRow from '@/components/RelationRow'
import Auth from '@/core/auth'
export default {
  components: {
    RelationRow
  },
  mounted(){
    this.getMyTree()
  },
  data(){
    return {
      isLoading: true,
      relations: [],
      user: Auth.user()
    }
  },
  methods: {
    getMyTree(){
      this.relations = []
      this.isLoading = true
      const param = {
        select: {
          statement: {
            select: ['text', 'statement_type_id']
          },
          root_parent_relation: {
            select: {
              ...(['id', 'logic_tree_id', 'statement_id'])
            }
          },
          parent_relation: {
            select: {
              statement: {
                select: ['text', 'statement_type_id']
              },
              ...(['id', 'logic_tree_id', 'statement_id'])
            }
          },
          ...(['id', 'parent_relation_id', 'statement_id', 'created_at', 'updated_at', 'published_at'])
        },
        sort: [{
          column: 'updated_at',
          order: 'desc'
        }],
        condition: [{
          column: 'user_id',
          value: this.user.id
        }],
        limit: 10
      }
      RelationAPI.retrieve(param).then(result => {
        console.log('result', result)
        if(result['data']){
          this.relations = result['data']
        }
      }).finally(() => {
        this.isLoading = false
      })
    }
    // getTrending(){
    //   this.relations = []
    //   this.isLoading = true
    //   RelationAPI.post('/my-list').then(result => {
    //     if(result['data']){
    //       this.relations = result['data']
    //     }
    //     this.isLoading = false
    //   }).catch(() => {
    //     this.isLoading = false
    //   })
    // }
  }
}
</script>
<style scoped>
</style>
