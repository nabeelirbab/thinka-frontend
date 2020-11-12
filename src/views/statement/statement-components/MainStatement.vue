<template>
  <div class="">
    <!-- <div class="mb-2">
      <div v-if="parentStatement" class="text-nowrap text-truncate">Go to <router-link :to="'/statement/' + parentStatement['id']" class="font-italic" >{{parentStatement ? parentStatement['text'] : 'Root Statement'}}</router-link></div>
    </div> -->
    <!-- <div class="d-flex justify-content-between mb-2">
      <div class="">
        <NoProfile :name="statement['user']['name']" />
        <label class="mb-0 pl-1">{{statement['user']['name']}}</label>
      </div>
      <small class="text-nowrap pt-2">{{statement['created_at']}}</small>
      
    </div> -->
    <div v-show="isSticky" ref="dummyStatementBox" class="bg-dark text-white" :style="{'height':statementTextHeight + 'px'}"></div>
    <div ref="mainStatementBox" @click="statementClicked" :class="(isSticky ? 'mainStatement fixed-top' : '')" class="limitBoxborder bg-primary text-white px-3 pb-3 pt-3 statement-radius" :style="stickySeeMore === true ? 'max-height:'+stickStatementHeightLimit+'px!important' : ''">
      <div class="d-flex justify-content-between">
      </div>
      <div class=" font-weight-bold text-white pr-2">
        <div class="d-flex align-items-center">
          <div class="text-warning font-weight-bold pr-1" ><h6>*</h6></div>
          <div ref="actualStatementTextDiv" class="text limitText flex-fill" :style="stickySeeMore === true ? 'max-height: ' + (stickStatementHeightLimit - 32 - 21) + 'px!important;' : ''">
            <!-- 111aaaaaaaaaaa asdasdas dasd asda -->
            <!-- 222aaaaaaaaaaa asdasdas dasd asdas asdasjdoi1jsad aoidj -->
            <!-- 333aaaaaaaaaaa asdasdas dasd asdas asdasjdoijsad aoidjaosdj oiasjdoqwheqwoieh aaaas -->
            {{statement['text']}} {{statement['id']}}
          </div>
          <div>
            <div v-if="selectedStatementId === statementId || parentStatementId" @click.stop class="px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px!important; width:35px!important">
              <CTPoints v-if="selectedStatementId === statementId" :points="ctPoints" class="ml-auto" />
              <router-link v-else-if="parentStatementId" :to="'/statement/' + logicTreeId + '/'+ parentStatementId" class="text-primary"><fa icon="undo-alt" /></router-link>
            </div>
          </div>
        </div>
        <div v-if="isSticky && stickySeeMore !== null" class="w-100 text-center c-pointer hover-underline ">
          <span v-if="stickySeeMore === true"  @click="stickySeeMore = false">Show more <fa icon="chevron-down" /></span>
          <span v-else @click="stickySeeMore = true">Show less <fa icon="chevron-up" /></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CTPoints from '@/components/CTPoints'
import GlobalData from '../global-data'
// import NoProfile from '@/components/NoProfile'
export default {
  components: {
    CTPoints,
    // NoProfile
  },
  props: {
    statement: Object,
    logicTreeId: Number
  },
  mounted(){
    window.addEventListener('scroll', this.isScrolling);
  },
  beforeUnmount(){
    window.removeEventListener('scroll', this.isScrolling);
  },
  data(){
    return {
      selectedStatementId: GlobalData.selectedStatementId,
      showCTOpinion: GlobalData.showCTOpinion,
      isSticky: false,
      stickySeeMore: null,
      stickStatementHeightLimit: 0,
      statementTextHeight: 0,
      isScrollingTimeout: null
    }
  },
  methods: {
    statementClicked(){
      this.selectedStatementId = this.selectedStatementId === this.statementId ? null : this.statementId
    },
    isScrolling(){
      const headerHeight = 60
      const allowance = 60
      this.isSticky = (headerHeight + this.statementTextHeight + allowance) <= window.pageYOffset
    },
  },
  watch: {
    selectedStatementId(){
      this.showCTOpinion = this.selectedStatementId === this.statementId
    },
    isSticky(newData){
      this.stickySeeMore = null
      this.stickStatementHeightLimit = window.innerHeight * 0.15
      if(this.stickStatementHeightLimit < 85){
        this.stickStatementHeightLimit = 85
      }
      if(newData){
        this.stickySeeMore = this.statementTextHeight > this.stickStatementHeightLimit ? true : null
      }
    },
    statementId: {
      handler: function(){
        setTimeout(() => {
          this.statementTextHeight = (this.$refs.mainStatementBox).offsetHeight
        }, 500)
      },
      immediate: true
    }
  },
  computed: {
    statementId(){
      return typeof this.statement['id'] !== 'undefined' && this.statement['id'] ? this.statement['id'] : null
    },
    parentStatementId(){
      return typeof this.statement['relation'] !== 'undefined' && this.statement['relation'] ? this.statement['relation']['statement_id_1'] : null
    },
    ctPoints(){
      return typeof this.statement['ct_points'] !== 'undefined' ? this.statement['ct_points'] : '00'
    }
  }
}
</script>
<style>
.mainStatement.fixed-top{
  margin-top: 63px;
  margin-left: 4px;
  margin-right: 4px;
  
}
.mainStatement.limitBox {
  /* max-height: 15vh!important; */
  overflow: hidden;
}
.mainStatement.fixed-top .limitText{
  overflow: hidden
}
</style>
