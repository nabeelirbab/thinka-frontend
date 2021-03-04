<template>
  <div class="mb-3">
    <div v-if="user">
      <div @click="searchForm.mineOnly = !searchForm.mineOnly" class="form-check c-pointer">
        <input  v-model="searchForm.mineOnly" type="checkbox" class="form-check-input" >
        <label class="form-check-label" >Show My Statements Only</label>
      </div>
    </div>
    <div class="input-group ">
      <input ref="searchInput" @keydown.esc="clearSearch" @keypress.enter="search" v-model="searchForm.statementText" type="text" class="form-control" placeholder="Type statement keywords...">
      <div class="input-group-append">
        <button @click="clearSearch" class="border"><fa icon="trash" /></button>
        <button @click="search" :disabled="isLoading" class="btn btn-outline-secondary" type="button" id="button-addon2"><fa icon="search" /> Search</button>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
export default {
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
          this.$refs.searchInput.focus()
        }
      }else{
        this.search()
      }
    },
    search(){
      console.log('searching')
      this.$emit('search', this.searchForm)
    },
    clearSearch(){
      this.searchForm['statementText'] = ''
      this.searchForm['mineOnly'] = false
      this.search()
    }
  },
  watch: {
    isLoading(isLoading){
      if(!isLoading){
        this.$refs.searchInput.focus()
      }
    },
    routeParamKeyword: {
      handler(routeParamKeyword){
        console.log('routeParamKeyword', routeParamKeyword)
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
