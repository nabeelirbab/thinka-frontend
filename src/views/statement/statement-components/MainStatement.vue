<template>
  <div class="">
    <div v-show="isSticky" ref="dummyStatementBox" class="bg-dark text-white" :style="{'height':statementTextHeight + 'px'}"></div>
    <div ref="mainStatementBox"  :class="(isSticky ? 'mainStatement fixed-top' : '') + ' ' + (isSelected ? 'border border-dark border-width' : '')" class="limitBoxborder bg-primary text-white px-2 pb-2 pt-2 statement-radius" :style="stickySeeMore === true ? 'max-height:'+stickStatementHeightLimit+'px!important' : ''" v-bind:title="titleIds">
      <div class="d-flex justify-content-between">
      </div>
      <div class=" font-weight-bold text-white">
        <div >
          <div v-if="!isEditing" @click="_statementClicked" class="d-flex align-items-center text-break">
            <div ref="actualStatementTextDiv" class="text-break limitText flex-fill statementTextContainer" :style="stickySeeMore === true ? 'max-height: ' + (stickStatementHeightLimit - 32 - 21) + 'px!important;' : ''">
              <div class="d-flex text-left mb-1" style="font-size:0.9em"  >
                  <div class="column mr-2 ml-0" style="padding-left: 1em; text-indent: -0.9em;">
                    <span>
                  <fa v-if="parentRelationId" icon="leaf"/> <fa v-else icon="tree"/></span></div>
                  <div class="column text-break"><TextDisplayer :text="statement ? statement['text'] : 'No Text'" text-class="text-white" /></div>
              </div>
            </div>
            <div class="">
              <div v-if="selectedStatementId === relation['id']" class="d-flex ml-1">
                <CircleLabel>
                  <CTPoints :points="ctPoints * 1" class="text-dark" />
                </CircleLabel>
                <!-- <CircleIconButton v-if="relation && !relation['published_at']" @click.stop="isEditing = true" icon="edit" button-class="btn-light bg-whitesmoke text-primary ml-1" /> -->
              </div>
              <div v-else-if="parentRelationId" @click.stop class="ml-1 px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center text-center" style="height:35px!important; width:35px!important">
                <router-link :to="'/branch/'+ parentRelationId + '/t/' + toKebabCase(parentRelation['statement']['text']).slice(0, 30)" class="text-primary"><fa icon="undo-alt" /></router-link>
              </div>
            </div>
          </div>
          <CreateSubStatement v-if="isEditing" :is-main-statement="true" :relation="relation" :mode="'update'" @save="statementEdited" @cancel="editSelectedStatement = false" :logic-tree-id="logicTreeId" :parent-relation-id="relation['parent_relation_id']"  />
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
import RelationTypeAPI from '@/api/relation-type'
import TextDisplayer from '@/components/TextDisplayer'
// import NoProfile from '@/components/NoProfile'
export default {
  components: {
    CTPoints,
    CreateSubStatement,
    CircleIconButton,
    CircleLabel,
    TextDisplayer
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
      ...GlobalData,
      isSticky: false,
      stickySeeMore: null,
      stickStatementHeightLimit: 0,
      statementTextHeight: 0,
      isScrollingTimeout: null,
      relationTypes: RelationTypeAPI.cachedData && RelationTypeAPI.cachedData.value ? RelationTypeAPI.cachedData.value['data'] : []
    }
  },
  methods: {
    _statementClicked(){
      if(this.selectedStatementId === this.relation['id']){
        this.selectedStatementId =  null
        this.selectedStatementData = null
      }else{
        this.selectedStatementId = this.relation['id']
        this.selectedStatementData = this.relation
      }
    },
    statementEdited(event){
      this.editSelectedStatement = false
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
    isEditing(){
      return this.isActive && this.editSelectedStatement
    },
    isActive(){
      return this.relation && this.relation['id'] * 1 === this.selectedStatementId * 1
    },
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
    parentRelation(){
      return this.relation['parent_relation']
    },
    ctPoints(){
      return typeof this.statement['ct_points'] !== 'undefined' ? this.statement['ct_points'] : '00'
    },
    titleIds(){
        return '('+this.relation['parent_relation_id']+') [' + this.relation['id'] + ']'
    },
    relationTypeSymbol(){
      const relationTypeId = this.relation['relation_type_id']
      const relationTypeIndex = this.findArrayIndex(relationTypeId * 1, this.relationTypes, 'id')
      if(relationTypeIndex >= 0){
        return this.relationTypes[relationTypeIndex]['symbol']
      }else{
        return '??'
      }
    },
  }
}
</script>
<style scoped>
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
