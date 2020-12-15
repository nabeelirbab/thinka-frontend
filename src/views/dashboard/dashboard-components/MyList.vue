<template>
  <div class="border rounded">
    <h5 class="py-3 px-4 mb-0 bg-whitesmoke"><fa icon="list" /> My Trees</h5>
    <div class="p-4" style="overflow-y:auto; height: 50vh">
      <div v-if="isLoading" class="text-center">Please wait... <fa icon="spinner" spin /></div>
      <div >
        <div v-for="(trend, index) in trending" :key="'trendinag' + index" class="d-flex mb-2 border-bottom">
          <div class="flex-fill text-break">
            <small>{{formatDate(trend['updated_at'])}}</small>{{"   "}}
            <fa v-if="trend['published_at']" icon="sun" /><fa v-else icon="briefcase" /><br />
            <router-link :to="'/branch/' + trend['id']">{{trend['text']}} <small>#{{trend['id']}}</small></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RelationAPI from '@/api/relation'
export default {
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
      RelationAPI.post('/my-list').then(result => {
        console.log('result', result)
        if(result['data']){
          this.trending = result['data']
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
