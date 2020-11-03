<template>
  <div class="container pt-4">
    <SearchBox />
    <ResultList />
  </div>
</template>
<script>
import SearchBox from './search-components/SearchBox'
import ResultList from './search-components/ResultList'
export default {
  components: {
    SearchBox,
    ResultList
  }
}
</script>
