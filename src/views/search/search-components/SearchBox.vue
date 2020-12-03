<template>
  <div class="mb-3">
    <div>
      <div @click="searchForm.mineOnly = !searchForm.mineOnly" class="form-check c-pointer">
        <input  v-model="searchForm.mineOnly" type="checkbox" class="form-check-input" >
        <label class="form-check-label" >Show My Statements Only</label>
      </div>
    </div>
    <div class="input-group ">
      <input @keypress.enter="search" v-model="searchForm.statementText" type="text" class="form-control" placeholder="Type statement keywords...">
      <div class="input-group-append">
        <button @click="search" :disabled="isLoading" class="btn btn-outline-secondary" type="button" id="button-addon2"><fa icon="search" /> Search</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  emits: ['search'],
  props: {
    isLoading: Boolean
  },
  mounted(){
    let previousSearchFilter
    try {
      previousSearchFilter = JSON.parse(localStorage.getItem('search_page_filter'));
    } catch (exception) {
      previousSearchFilter = null;
    }
    if(previousSearchFilter){
      this.searchForm = previousSearchFilter
    }
    this.search()
  },
  data(){
    return {
      searchForm: {
        statementText: '',
        mineOnly: false
      }
    }
  },
  methods: {
    search(){
      this.$emit('search', this.searchForm)
    }
  }
}
</script>
