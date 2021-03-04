<template>
  <!-- <div class="border rounded"> -->
    <!-- <h5 class="py-3 px-4 mb-0 bg-whitesmoke"><fa icon="chart-line" /> Trending</h5> -->
    <div >
      <!-- <p class="card-text">The list below shows the most active conclusions</p> -->
      <div v-if="isLoading" class="text-center">Please wait... <fa icon="spinner" spin /></div>
      <div style="overflow-y:auto; height: 50vh">
        <div v-for="(trend) in trending" class="d-flex p-2 px-3 border-bottom">
          <RelationRow :relation="trend" />
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>
<script>
import RelationAPI from '@/api/relation'
import RelationRow from './RelationRow'
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
