<template>
  <div class="bg-info">
    <div class="d-flex container px-2 align-items-center">
      <div class="flex-fill">
        <button v-if="!showSearchText && searchText === ''" @click="showSearchText = true" class="btn btn-square border-none shadow-none text-white py-1 icon-size"><fa icon="search" /></button>
        <div v-else class="input-group input-group-sm ">
          <div class="input-group-preppend rounded-l-oval" >
            <span v-if="isLoading" class="input-group-text rounded-l-oval border-r-none pl-3 pr-0 bg-white border-0" style="font-size: 1.02em;"><fa icon="spinner" spin /></span>
            <button v-else-if="searchText !== ''" @click="clearSearchText" class="rounded-l-oval border-r-none btn bg-white text-danger pl-3 pr-0" type="button" style="height:2.31em;"><fa icon="trash" /></button>
            <span v-else class="input-group-text rounded-l-oval border-r-none pl-3 pr-0 bg-white border-none border-0" style="font-size: 1.02em;"><fa icon="search" /></span>
          </div>
          <input ref="searchText" v-model="searchText" @keyup="typing" @focusout="searchText === '' ? showSearchText = false : null"  class="form-control rounded-r-oval border-0 shadow-none" placeholder="Enter search criteria">
        </div>
      </div>
      <button @click="goBack" :disabled="backHistory.length <= 1" class="chevron-circle-button shadow-none btn-square btn py-1 px-1">
        <div><fa icon="chevron-left" /></div>
      </button>
      <button @click="goForward" :disabled="!forwardHistory.length" class="chevron-circle-button shadow-none btn-square btn py-1 px-1">
        <div><fa icon="chevron-right" /></div>
      </button>
      <div>
        <button @click="bookmark" :class="rootBookmarkId ? 'text-warning' : ''" :disabled="isBookmarkLoading" class="btn icon-size py-1 text-white btn-square"><fa icon="bookmark" /></button>
      </div>
      <div>
        <button class="btn icon-size py-1 text-white btn-square"><fa icon="ellipsis-v" /></button>
      </div>
    </div>
  </div>
</template>
<script>
import GlobalData from '@/views/statement/global-data'
import UserRelationBookmarkAPI from '@/api/user-relation-bookmark'
export default {
  props: {
    mainRelation: {
      type: Object,
      required: true
    },
    statementId: Number,
    parentRelationId: Number,
    selectedStatementId: {
      type: Number,
      default: 0
    }
  },
  mounted(){
    // if(this.backHistory.length && this.backHistory[0] !== this.relationId){
    //   this.backHistory = [this.relationId]
    //   localStorage.setItem('back_history', JSON.stringify(this.backHistory))
    // }
  },
  data(){
    return {
      showSearchText: false,
      isLoading: false,
      searchText: '',
      typingTimeout: 0,
      statementTextFilter: GlobalData.statementTextFilter,
      backHistory: GlobalData.backHistory,
      forwardHistory: GlobalData.forwardHistory,
      isBookmarkLoading: true,
      rootBookmarkId: null
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
      this.statementTextFilter = this.searchText
      this.isLoading = false
    },
    goBack(){ // go back history
      this.isGoingBack = true
      this.forwardHistory.unshift(this.backHistory.pop())
      const relationId = this.backHistory.pop()
      localStorage.setItem('back_history', JSON.stringify(this.backHistory))
      this.$router.push('/branch/' + relationId)
    },
    goForward(){
      this.isGoingForward = true
      const relationId = this.forwardHistory.shift()
      this.$router.push('/branch/' + relationId)
    },
    bookmark(){
      this.isBookmarkLoading = true
      if(!this.rootBookmarkId){
        const param = {
          relation_id: this.mainRelation['id']
        }
        UserRelationBookmarkAPI.create(param).then(result => {
          console.log('bookmark', result)
          if(result['data']){
            this.rootBookmarkId = result['data']['id']
          }
          this.isBookmarkLoading = false
        }).catch(() => {
          this.isBookmarkLoading = false
        })
      }else{
        UserRelationBookmarkAPI.delete({ id: this.rootBookmarkId}).then(result => {
          console.log('delete bookmark', result)
          if(result['data']['id']){
            this.rootBookmarkId = null
          }
          this.isBookmarkLoading = false
        }).catch(() => {
          this.isBookmarkLoading = false
        })
      }
    }
  },
  watch: {
    mainRelation: {
      handler(mainRelation){
        this.rootBookmarkId = null
        if(mainRelation && typeof mainRelation['user_relation_bookmarks'] !== 'undefined'){
          mainRelation['user_relation_bookmarks'].forEach(userRelationBookmark => {
            if(userRelationBookmark['sub_relation_id'] === null){
              this.rootBookmarkId = userRelationBookmark['id']
            }
          })
        }
        this.isBookmarkLoading = false
      },
      immediate: true
    },
    showSearchText(){
      if(this.showSearchText === true){
        setTimeout(() => {
          this.$refs.searchText.focus()
        }, 800)
      }
    },
    relationId: {
      handler(newData){
        if(!isNaN(newData)){
          if(this.forwardHistory.length && !this.isGoingBack && !this.isGoingForward){
            this.forwardHistory = []
          }
          if(this.backHistory.length === 0 && localStorage.getItem('back_history')){
            this.backHistory = JSON.parse(localStorage.getItem('back_history'))
          }
          if(!this.backHistory.length || this.backHistory[this.backHistory.length - 1] !== newData){
            this.backHistory.push(newData)
          }
          localStorage.setItem('back_history', JSON.stringify(this.backHistory))
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
    padding-top:3px;
  }
  .icon-size {
    font-size:1.3em
  }
</style>