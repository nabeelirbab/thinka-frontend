<template>
  <div class="d-flex w-100 bg-info px-2 align-items-center">
    <div class="flex-fill">
      <button v-if="!showSearchText && searchText === ''" @click="showSearchText = true" class="btn btn-info btn-square border-none"><fa icon="search" /></button>
      <div v-else class="input-group input-group-sm ">
        <input ref="searchText" v-model="searchText" @keyup="typing" @focusout="searchText === '' ? showSearchText = false : null"  class="form-control rounded-l-oval border-0 shadow-none" placeholder="Type Statement Keywork">
        <div class="input-group-append rounded-r-oval">
          <span v-if="isLoading" class="input-group-text rounded-r-oval px-3 bg-white"><fa icon="spinner" spin /></span>
          <button v-else-if="searchText !== ''" @click="clearSearchText" class="rounded-r-oval btn bg-white btn-sm text-danger px-3" type="button" style="height:2.53em; font-size:0.8em"><fa icon="trash" /></button>
          <span v-else class="input-group-text rounded-r-oval px-3 bg-white" id="basic-addon2"><fa icon="search" /></span>
        </div>
      </div>
      
    </div>
    <router-link :to="'/branch/'+ parentRelationId" :class="parentRelationId ? '' : 'disabled'" class="chevron-circle-button btn-info btn-square btn py-1 px-1">
      <div><fa icon="chevron-left" /></div>
    </router-link>
    <router-link :to="'/branch/'+ selectedStatementId" :class="(!(selectedStatementId > 0) || statementId === selectedStatementId) ? 'disabled' : ''" class="chevron-circle-button btn-info btn-square btn py-1 px-1">
      <div><fa icon="chevron-right" /></div>
    </router-link>
    <div>
      <button class="btn btn-info btn-square"><fa icon="ellipsis-v" /></button>
    </div>
  </div>
</template>
<script>
import GlobalData from '@/views/statement/global-data'
export default {
  props: {
    statementId: Number,
    parentRelationId: Number,
    selectedStatementId: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      showSearchText: false,
      isLoading: false,
      searchText: '',
      typingTimeout: 0,
      statementTextFilter: GlobalData.statementTextFilter
    }
  },
  methods: {
    clearSearchText(){
      this.searchText = ''
      this.typing()
    },
    typing(){
      this.isLoading = true
      clearTimeout(this.typingTimeout)
      this.typingTimeout = setTimeout(() => {
        this.search()
      }, 750)
    },
    search(){
      console.log('searching now')
      this.statementTextFilter = this.searchText
      this.isLoading = false
    }
  },
  watch: {
    showSearchText(){
      if(this.showSearchText === true){
        setTimeout(() => {
          this.$refs.searchText.focus()
        }, 800)
      }
    }
  }
}
</script>
<style scoped>
  /* .chevron-circle-button {
    background: transparent;
    border:none
  } */
  .chevron-circle-button div{
    text-align: center;
    vertical-align: middle;
    border-radius: 50%;
    height:2.2em!important;
    width:2.2em!important;
    padding: 0px;
    color: white;
    border: 2px white solid;
    padding-top:5px;
  }
</style>