<template>
  <div>
    <div class="image-background px-4 pt-4 pb-3 mb-0 mb-md-3">
      <div class="container px-4">
        <SearchBox ref="searchBox" @search="search" :is-loading="isLoading"/>
      </div>
    </div>
    <div class="container pb-2 px-0">
      <ResultList 
        ref="resultList" 
        @is-loading="isLoading = $event" 
        @clear-search="clearSearch"
        class="mb-4 bg-white rounded-md shadow-md-light"
      />
    </div>
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
  },
  data(){
    return {
      isLoading: false
    }
  },
  methods: {
    search(searchForm){
      this.$refs.resultList._search(searchForm)
    },
    clearSearch(){
      this.$refs.searchBox._clearSearch()
    }
  }
}
</script>
