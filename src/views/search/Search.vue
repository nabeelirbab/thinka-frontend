<template>
  <div>
    <div class="image-background p-4 mb-4">
      <div class="container px-4">
        <SearchBox ref="searchBox" @search="search" :is-loading="isLoading"/>
      </div>
    </div>
    <div class="container py-2">
      <ResultList ref="resultList" @is-loading="isLoading = $event" @clear-search="clearSearch" />
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
