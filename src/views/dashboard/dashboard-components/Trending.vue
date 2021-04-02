<template>
  <div >
    <div v-if="isLoading" class="text-center">Please wait... <fa icon="spinner" spin /></div>
    <div style="overflow-y:auto; height: 50vh">
      <div v-for="(trend) in trending" class="d-flex ">
        <RelationRow :relation="trend" />
      </div>
    </div>
  </div>
</template>
<script>
import RelationAPI from '@/api/relation'
import RelationRow from '@/components/RelationRow'
export default {
  components: {
    RelationRow
  },
  mounted(){
    this.getTrending();
  },
  data(){
    return {
      isLoading: true,
      trending: []
    }
  },
  methods: {
    getTrending(){
      this.trending = []
      this.isLoading = true
      const param = {
        select: {
          statement: {
            select: ['text', 'statement_type_id']
          },
          user: {
            select: {
            ...(['id', 'username'])
            }
          },
          ...(['id', 'parent_relation_id', 'statement_id', 'user_id', 'created_at', 'updated_at'])
        },
        sort: [{
          column: 'updated_at',
          order: 'desc'
        }],
        condition: [{
          column: 'published_at',
          clause: '!=',
          value: null
        }, {
          column: 'parent_relation_id',
          value: null
        }, {
          column: 'virtual_relation_id',
          value: null
        }],
        limit: 10
      }
      RelationAPI.retrieve(param).then(result => {
        if(result['data']){
          this.trending = result['data']
        }
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
