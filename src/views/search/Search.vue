<template>
  <div class="container pt-4">
    <SearchBox @search="search" :is-loading="isLoading"/>
    <ResultList ref="resultList" @is-loading="isLoading = $event" />
  </div>
</template>
<script>
import SearchBox from './search-components/SearchBox'
import ResultList from './search-components/ResultList'
export default {
  components: {
    SearchBox,
    ResultList
  },
  mounted(){
    this.$refs.resultList._search()
  },
  data(){
    return {
      isLoading: false
    }
  },
  methods: {
    search(searchForm){
      console.log('searching', searchForm)
      this.$refs.resultList._search(searchForm)
    }
  }
}
</script>
