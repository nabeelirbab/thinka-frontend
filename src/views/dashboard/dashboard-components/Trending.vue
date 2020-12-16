<template>
  <div class="border rounded">
    <h5 class="py-3 px-4 mb-0 bg-whitesmoke"><fa icon="chart-line" /> Trending</h5>
    <div class="p-4">
      <p class="card-text">The list below shows the most active conclusions</p>
      <div v-if="isLoading" class="text-center">Please wait... <fa icon="spinner" spin /></div>
      <div >
        <div v-for="(trend, index) in trending" :key="'trendinag' + index" class="d-flex mb-2 border-bottom">
          <div class="flex-fill text-break">
            <small>{{formatDate(trend['updated_at'])}}</small> <br />
            <router-link :to="'/branch/' + trend['id'] + '/t/' + toKebabCase(trend['text']).slice(0,30)">{{trend['text']}}</router-link>
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
      RelationAPI.post('/trending').then(result => {
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