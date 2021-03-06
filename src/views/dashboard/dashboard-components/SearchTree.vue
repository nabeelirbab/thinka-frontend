<template>
  <div class="mb-3">
    <SearchBar @search="search" />
  </div>
</template>
<script>
import SearchBar from '@/components/SearchBar'
export default {
  components: {
    SearchBar
  },
  data(){
    return {
    }
  },
  methods: {
    search(keyword){
      this.$router.push('/search/' + this.toKebabCase(keyword))
    },
  },
  
}
</script>