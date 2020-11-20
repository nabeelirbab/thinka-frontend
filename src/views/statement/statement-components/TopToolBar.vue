<template>
  <div class="bg-info">
    <div class="d-flex container px-2 align-items-center">
      <div class="flex-fill">
        <button v-if="!showSearchText && searchText === ''" @click="showSearchText = true" class="btn btn-info btn-square border-none"><fa icon="search" /></button>
        <div v-else class="input-group input-group-sm ">
          <div class="input-group-preppend rounded-l-oval" >
            <span v-if="isLoading" class="input-group-text rounded-l-oval border-r-none pl-3 pr-0 bg-white border-0" style="font-size: 1.02em;"><fa icon="spinner" spin /></span>
            <button v-else-if="searchText !== ''" @click="clearSearchText" class="rounded-l-oval border-r-none btn bg-white text-danger pl-3 pr-0" type="button" style="height:2.31em;"><fa icon="trash" /></button>
            <span v-else class="input-group-text rounded-l-oval border-r-none pl-3 pr-0 bg-white border-none border-0" style="font-size: 1.02em;"><fa icon="search" /></span>
          </div>
          <input ref="searchText" v-model="searchText" @keyup="typing" @focusout="searchText === '' ? showSearchText = false : null"  class="form-control rounded-r-oval border-0 shadow-none" placeholder="Enter search criteria">
        </div>
        
      </div>
      <button @click="goBack" :disabled="backHistory.length <= 1" class="chevron-circle-button btn-info btn-square btn py-1 px-1">
        <div><fa icon="chevron-left" /></div>
      </button>
      <button @click="goForward" :disabled="!forwardHistory.length" class="chevron-circle-button btn-info btn-square btn py-1 px-1">
        <div><fa icon="chevron-right" /></div>
      </button>
      <div>
        <button class="btn btn-info btn-square"><fa icon="ellipsis-v" /></button>
      </div>
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
      statementTextFilter: GlobalData.statementTextFilter,
      backHistory: GlobalData.backHistory,
      forwardHistory: GlobalData.forwardHistory
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
    },
    goBack(){ // go back history
      this.isGoingBack = true
      this.forwardHistory.unshift(this.backHistory.pop())
      const relationId = this.backHistory.pop()
      this.$router.push('/branch/' + relationId)
    },
    goForward(){
      this.isGoingForward = true
      const relationId = this.forwardHistory.shift()
      this.$router.push('/branch/' + relationId)
    }
  },
  watch: {
    showSearchText(){
      if(this.showSearchText === true){
        setTimeout(() => {
          this.$refs.searchText.focus()
        }, 800)
      }
    },
    relationId: {
      handler(newData, oldData){
        console.log(newData, oldData)
        if(newData){
          if(this.forwardHistory.length && !this.isGoingBack && !this.isGoingForward){
            this.forwardHistory = []
          }
          this.backHistory.push(newData)
        }
        this.isGoingBack = false
        this.isGoingForward = false
      },
      immediate: true
    },
  },
  computed: {
    relationId(){
      return this.$route.params.relationId * 1
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