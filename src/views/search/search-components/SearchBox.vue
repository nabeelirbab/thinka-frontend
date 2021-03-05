<template>
  <div class="">
    
    <div class="input-group btn-shadow rounded-oval mb-2">
      <input
        ref="searchInput"
        v-model="searchForm.statementText"
        @keydown.esc="_clearSearch" 
        @keypress.enter="search" 
        type="text" class="form-control rounded-l-oval" placeholder="Type statement keywords..."
      >
      <div class="input-group-append">
        <!-- <button @click="clearSearch" class="border"><fa icon="trash" /></button> -->
        <button @click="search" :disabled="isLoading" class="btn btn-primary rounded-r-oval" type="button" id="button-addon2"><fa icon="search" /> Search</button>
      </div>
    </div>
    <div v-if="user" class="text-center text-white ">
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
export default {
  components: {
    CustomCheckbox
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
          this.$refs.searchInput.focus()
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
