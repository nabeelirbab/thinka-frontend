<template>
  <div class="">
    <SearchBar ref="searchBar" v-model="searchForm.statementText" @search="search" :init_focus="true" />
    <div v-if="user" class="text-center text-white mt-2">
      <div  class="form-check d-flex align-items-center justify-content-center">
        <CustomCheckbox
          v-model="searchForm.mineOnly"
          class="mr-2 text-xl"
        />
        <label @click="searchForm.mineOnly = !searchForm.mineOnly" class="form-check-label c-pointer" >Show My Statements Only</label>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
import CustomCheckbox from '@/components/CustomCheckbox'
import SearchBar from '@/components/SearchBar'
export default {
  components: {
    CustomCheckbox,
    SearchBar
  },
  emits: ['search'],
  props: {
    isLoading: Boolean
  },
  mounted(){
  },
  data(){
    return {
      searchForm: {
        statementText: '',
        mineOnly: false,
      },
      user: Auth.user()
    }
  },
  methods: {
    initialize(){
      let previousSearchFilter
      try {
        previousSearchFilter = JSON.parse(localStorage.getItem('search_page_filter'));
      } catch (exception) {
        previousSearchFilter = null;
      }
      if(previousSearchFilter){
        this.searchForm = previousSearchFilter
        if(typeof this.$refs.searchInput !== 'undefined' && this.$refs.searchInput){
          this.$refs.searchBar.focus()
        }
      }else{
        this.search()
      }
    },
    search(){
      this.$emit('search', this.searchForm)
    },
    _clearSearch(){
      this.searchForm['statementText'] = ''
      this.searchForm['mineOnly'] = false
      this.search()
      this.$refs.searchBar.focus()
    }
  },
  watch: {
    routeParamKeyword: {
      handler(routeParamKeyword){
        // console.log('routeParamKeyword', routeParamKeyword)
        if(routeParamKeyword){
          setTimeout(() => {
            this.searchForm['statementText'] = routeParamKeyword
            this.search()
          }, 250)
        }else{
          setTimeout(() => {
            this.initialize()
          }, 300)
        }
      },
      immediate: true
    }
  },
  computed: {
    routeParamKeyword(){
      return typeof this.$route.params.keyword !== 'undefined' ? (this.$route.params.keyword).replace(/-/g, ' ') : null
    }
  }
}
</script>
