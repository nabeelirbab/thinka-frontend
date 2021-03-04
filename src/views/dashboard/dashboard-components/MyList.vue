<template>
  <div class="p-0">
    <!-- <h5 class="py-3 px-4 mb-0 bg-whitesmoke"><fa icon="list" /> My Trees</h5> -->
    <div class="p-0" style="overflow-y:auto; height: 50vh">
      <div v-if="isLoading" class="text-center">Please wait... <fa icon="spinner" spin /></div>
      <div >
        <div v-for="(trend) in trending" class="border-bottom p-2 px-3">
          <RelationRow
            :relation="trend"
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
import RelationRow from './RelationRow'
export default {
  components: {
    RelationRow
  },
  mounted(){
    this.getTrending()
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
