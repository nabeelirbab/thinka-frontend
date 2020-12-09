<template>
  <div class="">
    <div v-show="isSticky" ref="dummyStatementBox" class="bg-dark text-white" :style="{'height':statementTextHeight + 'px'}"></div>
    <div ref="mainStatementBox" @click="_statementClicked" :class="(isSticky ? 'mainStatement fixed-top' : '') + ' ' + (isSelected ? 'border border-dark border-width' : '')" class="limitBoxborder bg-primary text-white px-3 pb-3 pt-3 statement-radius" :style="stickySeeMore === true ? 'max-height:'+stickStatementHeightLimit+'px!important' : ''" v-bind:title="titleIds">
      <div class="d-flex justify-content-between">
      </div>
      <div class=" font-weight-bold text-white pr-2">
        <div >
          <div v-if="!isEditing" class="d-flex align-items-center text-break">
            <div class="text-warning font-weight-bold pr-1" ><h6>*</h6></div>
            <div ref="actualStatementTextDiv" class="text limitText flex-fill" :style="stickySeeMore === true ? 'max-height: ' + (stickStatementHeightLimit - 32 - 21) + 'px!important;' : ''">
              <fa v-if="parentRelationId" icon="tree"/> <fa v-else icon="tree"/> {{statement ? statement['text'] : 'No Text'}} ({{parentRelationId}}) [{{relation['id']}}]
            </div>
            <div>
              <div v-if="selectedStatementId === relation['id']" class="d-flex">
                <CircleLabel>
                  <CTPoints :points="ctPoints * 1" class="text-dark" />
                </CircleLabel>
                <CircleIconButton v-if="relation && !relation['is_public']" @click.stop="isEditing = true" icon="edit" button-class="btn-light bg-whitesmoke text-primary ml-1" />
              </div>
              <div v-else-if="parentRelationId" @click.stop class="px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px!important; width:35px!important">
                <router-link :to="'/branch/'+ parentRelationId" class="text-primary"><fa icon="undo-alt" /></router-link>
              </div>
            </div>
          </div>
          <CreateSubStatement v-if="isEditing" :is-main-statement="true" :relation="relation" :mode="'update'" @save="statementEdited" @cancel="isEditing = false" :logic-tree-id="logicTreeId" :parent-relation-id="relation['parent_relation_id']"  />
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
import CreateSubStatement from './CreateSubStatement'
import CircleIconButton from '@/components/CircleIconButton'
import CircleLabel from '@/components/CircleLabel'
// import NoProfile from '@/components/NoProfile'
export default {
  components: {
    CTPoints,
    CreateSubStatement,
    CircleIconButton,
    CircleLabel
    // NoProfile
  },
  props: {
    relation: Object,
    logicTreeId: Number
  },
  emits: ['height-changed'],
  mounted(){
    window.addEventListener('scroll', this.isScrolling);
  },
  beforeUnmount(){
    window.removeEventListener('scroll', this.isScrolling);
  },
  data(){
    return {
      selectedStatementId: GlobalData.selectedStatementId,
      selectedStatementData: GlobalData.selectedStatementData,
      showCTOpinion: GlobalData.showCTOpinion,
      isSticky: false,
      stickySeeMore: null,
      stickStatementHeightLimit: 0,
      statementTextHeight: 0,
      isScrollingTimeout: null,
      isEditing: false
    }
  },
  methods: {
    _statementClicked(){
      this.selectedStatementId = this.selectedStatementId === this.relation['id'] ? null : this.relation['id']
      this.selectedStatementData = this.relation
    },
    statementEdited(event){
      this.isEditing = false
      this.$emit('updated', event)
    },
    isScrolling(){
      const headerHeight = 60
      const allowance = 60
      this.isSticky = (headerHeight + this.statementTextHeight + allowance) <= window.pageYOffset
    },
  },
  watch: {
    selectedStatementId(){
      this.showCTOpinion = this.selectedStatementId === this.relation['id']
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
        this.selectedStatementId = null
      },
      immediate: true
    },
    statementTextHeight(){
      this.$emit('height-changed', this.statementTextHeight)
    }
  },
  computed: {
    isSelected(){
      return this.relation && this.selectedStatementId === this.relation['id']
    },
    statement(){
      return this.relation && this.relation['statement'] ? this.relation['statement'] : null
    },
    statementId(){
      return this.statement && typeof this.statement['id'] !== 'undefined' && this.statement['id'] ? this.statement['id'] : null
    },
    parentRelationId(){
      return this.relation['parent_relation_id']
    },
    ctPoints(){
      return typeof this.statement['ct_points'] !== 'undefined' ? this.statement['ct_points'] : '00'
    },
    titleIds(){
        return '('+this.relation['parent_relation_id']+') [' + this.relation['id'] + ']'
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
