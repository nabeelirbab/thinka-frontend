<template>
  <div class="bg-info">
    <div class="d-flex container px-2 align-items-center">
      <div class="flex-fill">
        <button v-if="!showSearchText && searchText === ''" @click="showSearchText = true" class="btn btn-square border-none shadow-none text-white py-1 icon-size" title="Search this tree."><fa icon="search" /></button>
        <div v-else class="input-group input-group-sm ">
          <div class="input-group-preppend rounded-l-oval" >
            <span v-if="isLoading" class="input-group-text rounded-l-oval border-r-none pl-3 pr-0 bg-white border-0" style="font-size: 1.02em;"><fa icon="spinner" spin /></span>
            <button v-else-if="searchText !== ''" @click="clearSearchText" class="rounded-l-oval border-r-none btn bg-white text-danger pl-3 pr-0 pt-1" type="button" style="height:2.31em;" title="Clear search text."><fa icon="trash" /></button>
            <span v-else class="input-group-text rounded-l-oval border-r-none pl-3 pr-0 bg-white border-none border-0" style="font-size: 1.02em;"><fa icon="search" /></span>
          </div>
          <input ref="searchText" v-model="searchText" @keydown.esc="blurSearch" @keypress.enter="searchText === '' ? showSearchText = false : null" @keyup="typing" @focusout="searchText === '' ? showSearchText = false : null"  class="form-control rounded-r-oval border-0 shadow-none" placeholder="Enter search criteria">
        </div>
      </div>
      <button @click="goBack" :disabled="backHistory.length <= 1" class="chevron-circle-button shadow-none btn-square btn py-1 px-1" title="Back.">
        <div ><fa icon="chevron-left" /></div>
      </button>
      <button @click="goForward" :disabled="!forwardHistory.length" class="chevron-circle-button shadow-none btn-square btn py-1 px-1" title="Forward.">
        <div><fa icon="chevron-right" /></div>
      </button>
      <div>
        <button @click="bookmark" :class="rootBookmarkId ? 'text-primary' : ''" :disabled="isBookmarkLoading" class="btn icon-size py-1 text-white btn-square px-2 shadow-none" title="Bookmark"><fa v-if="!isBookmarkLoading" icon="bookmark" /><fa v-else icon="spinner" spin /></button>
      </div>
      <div>
        <button v-if="mainRelation" @click="(user && relationUserId !== user['id']) ? nonAuthorPublish() : publish()" :class="mainRelation['is_public'] ? 'text-warning' : ''" :disabled="isPublishing" class="btn icon-size py-1 text-white btn-square px-2 shadow-none" title="Make this public"><fa v-if="!isPublishing" icon="sun" /><fa v-else icon="spinner" spin /> </button>
      </div>
      <div>
        <button class="btn icon-size py-1 text-white btn-square px-2" title="More tree options."><fa icon="ellipsis-v" /></button>
      </div>
    </div>
  </div>
  <LogInModal ref="logInModal" />
  <Prompt ref="prompt" />
</template>
<script>
import Auth from '@/core/auth'
import GlobalData from '@/views/statement/global-data'
import UserRelationBookmarkAPI from '@/api/user-relation-bookmark'
import RelationAPI from '@/api/relation'
import LogInModal from '@/components/login/LogInModal'
import Prompt from '@/components/Prompt'
export default {
  components: {
    LogInModal,
    Prompt
  },
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
    },
    subRelationIds: Array
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
      rootBookmarkId: null,
      authenicationStatus: Auth.status(),
      user: Auth.user(),
      isPublishing: false
    }
  },
  methods: {
    clearSearchText(){
      this.searchText = ''
      this.typing()
    },
    blurSearch(){
      this.showSearchText = false
      this.clearSearchText()
    },
    typing(e = null){
      if(e && (e.keyCode === 27 || e.key === 'Escape')){
        return true
      }
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
    nonAuthorPublish(){
      this.$refs.prompt._open(
        'Only the original author can publish or unpublish a tree.',
        [],
        'Publish Not Available'
      )
      this.isPublishing = false
    },
    publish(){
      if(this.user){
        this.proceedToPublish()
      }else{
        this.isPublishing = true
        this.$refs.logInModal._open(() => {
          this.isPublishing = true
          setTimeout(() => {
            if(this.user['id'] * 1 === this.relationUserId){
              this.proceedToPublish()
            }else{
              this.nonAuthorPublish()
            }
          }, 1000)
          
        })
      }
    },
    proceedToPublish(){
      this.isPublishing = true
      const publishMessage = `
        <p>So you're ready to publish, well done! Currently this tree is private and so it can still be modified. Once published you will not be able to change your tree. So if you continue all the statements and logic will be fixed and will be visible to anyone.</p>
        <p>Are you sure you want to publish this tree now?</p>
      `
      const unpublishMessage = '<p>Unpublishing the tree will make it private and there can no longer be seen by other users</p>Are you sure you want to unplish this tree?'
      this.$refs.prompt._open(
        this.mainRelation['is_public'] ? unpublishMessage: publishMessage,
        [{
          label: this.mainRelation['is_public'] ? 'Unpublish': 'Publish',
          class: this.mainRelation['is_public'] ? 'btn-danger' : 'btn-success',
          callback: () => {
            const param = {
              id: this.mainRelation['id'],
              is_public: !this.mainRelation['is_public'],
              sub_relations: this.subRelationIds
            }
            RelationAPI.post('/publish', param).then(result => {
              if(result['data']){
                location.reload()
              }
            }).catch(error => {
              console.error(error)
              this.isPublishing = false
            })
          }
        }, {
          label: 'No',
          class: 'btn-outline-dark',
          callback: () => {
            this.isPublishing = false
          }
        }],
        this.mainRelation['is_public'] ? 'Unpblishing Tree...' : 'Publishing Tree...'
      )
    },
    bookmark(){
      this.isBookmarkLoading = true
      if(this.authenicationStatus === 'unauthenticated'){
        this.$refs.logInModal._open(() => {
          this.isBookmarkLoading = true
          UserRelationBookmarkAPI.checkIfBookmarked(this.mainRelation['id']).then(result => {
            if(result){
              this.rootBookmarkId = result
              this.isBookmarkLoading = false
            }else{
              UserRelationBookmarkAPI.toggleBookmark(this.rootBookmarkId, this.mainRelation['id']).then(result => {
                this.rootBookmarkId = result
              }).finally(() => {
                this.isBookmarkLoading = false
              })
            }
          }).catch(error => {
            console.log(error)
            this.isBookmarkLoading = false
          })
        })
        this.isBookmarkLoading = false
      }else {
        this.isBookmarkLoading = true
        UserRelationBookmarkAPI.toggleBookmark(this.rootBookmarkId, this.mainRelation['id']).then(result => {
          this.rootBookmarkId = result
        }).finally(() => {
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
    },
    relationUserId(){
      return typeof this.mainRelation['user_id'] !== 'undefined' ? this.mainRelation['user_id'] : null
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
