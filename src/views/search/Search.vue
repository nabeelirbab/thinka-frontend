<template>
  <div class="container pt-4 height-max bg-white">
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
  },
  data(){
    return {
      isLoading: false
    }
  },
  methods: {
    search(searchForm){
      this.$refs.resultList._search(searchForm)
    }
  }
}
</script>
