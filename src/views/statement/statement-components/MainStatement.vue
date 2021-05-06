<template>
  <div class="">
    <div v-show="isSticky" ref="dummyStatementBox" class="bg-dark text-white" :style="{'height':statementTextHeight + 'px'}"></div>
    <div>
      <div class="d-flex  justify-content-center" >
        <div :title="userFollowingNames" class="text-nowrap text-center px-1 "><fa icon="users" /> {{Object.keys(userFollowing).length}}</div>
        <Opinions
          @click="opinionSummaryClicked"
          :user-opinions="userOpinions"
          :is-horizontal="true"
          :user-opinion-type="userOpinionType"
        />
      </div>
    </div>
    <div
      ref="mainStatementBox" 
      :class="(isSticky ? 'mainStatement fixed-top' : '') + ' ' + (isSelected ? 'border border-dark border-width' : '')" 
      :title="titleIds"
      :style="stickySeeMore === true ? 'max-height:'+stickStatementHeightLimit+'px!important' : ''" 
      class="limitBoxborder bg-success shadow-sm px-2 py-1 mb-2 statement-radius" 
    >
      <div>
        <div >
          <div v-if="!isEditing"  class="d-flex align-items-center text-break">
            <div @click="_statementClicked" class="d-flex flex-fill ">
              <div ref="actualStatementTextDiv" class="text-break limitText flex-fill statementTextContainer" :style="stickySeeMore === true ? 'max-height: ' + (stickStatementHeightLimit - 32 - 21) + 'px!important;' : ''">
                <div class="d-flex text-left mb-1 pt-1 text-white"  >
                  <div class="column mr-2 ml-0" style="padding-left: 0.1em; ">
                    <span>
                      <fa v-if="parentRelationId" icon="leaf"/> <fa v-else icon="tree"/>
                    </span>
                  </div>
                  <div class="column text-break hyphens-auto">
                    <TextDisplayer :text="statement ? statement['text'] : 'No Text'" />
                  </div>
                </div>
              </div>
              <div class="d-flex align-items-center justify-content-center text-center">
                <OpinionIcon v-if="selectedStatementId !== relation['id']" :type="relationOpinionType" class="mr-1 text-white" />
                <div v-if="selectedStatementId === relation['id']" class=" ml-1">
                  <!-- <CircleLabel>
                    <CTPoints :points="ctPoints * 1" class="text-dark" />
                  </CircleLabel> -->
                  <!-- <CircleIconButton v-if="relation && !relation['published_at']" @click.stop="isEditing = true" icon="edit" button-class="btn-light bg-whitesmoke text-primary ml-1" /> -->
                </div>
                <div
                  v-else-if="parentRelationId" 
                  @click.stop 
                  class="ml-1 px-1 bg-whitesmoke rounded-circle d-flex align-items-center justify-content-center" 
                  style="height:35px!important; width:35px!important"
                >
                  <router-link :to="'/branch/'+ (contextRootRelationId ? (contextRootRelationId + '/t/context-locked') : parentRelationId + '/t/' + toKebabCase((parentRelation['statement']['text']).slice(0, 30)))" class="text-primary">
                    <fa icon="undo-alt" />
                  </router-link>
                </div>
              </div>
            </div>
            <div v-if="isActive && !enableDragging" class="align-self-center">
              <div class="dropdown show">
                <button class="border-0 rounded bg-transparent text-white" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More options.">
                  <fa icon="ellipsis-v" />
                </button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
                  <button 
                    @click="showVirtualRelationLinkages = true" 
                    class="dropdown-item"
                  >
                    <fa icon="tree" /> Parent links
                  </button>
                  <button 
                    @click="showScope = !showScope"
                    class="dropdown-item"
                  >
                    <fa icon="edit" /> Scope
                  </button>
                  <button 
                    @click="editSelectedStatement = true" 
                    :disabled="user === null || isPublished || !isAuthor"
                    class="dropdown-item"
                  >
                    <fa icon="edit" /> Edit
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
          <CreateSubStatement
            v-if="isEditing"
            @save="statementEdited"
            @cancel="editSelectedStatement = false"
            :is-main-statement="true" 
            :relation="relation" 
            :mode="'update'" 
             :logic-tree-id="logicTreeId" :parent-relation-id="relation['parent_relation_id']"
          />
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
import OpinionIcon from '@/views/statement/statement-components/sub-statement-components/OpinionIcon'
import Opinions from '@/views/statement/statement-components/sub-statement-components/Opinions'
import Auth from '@/core/auth'
// import NoProfile from '@/components/NoProfile' 
export default {
  components: {
    CTPoints,
    CreateSubStatement,
    CircleIconButton,
    CircleLabel,
    TextDisplayer,
    OpinionIcon,
    Opinions
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
      user: Auth.user(),
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
    opinionSummaryClicked(){
      if(this.selectedStatementId === this.relation['id'] && this.relation['parent_relation_id']){
        this.showImpactOpinionDialog = !this.showImpactOpinionDialog
      }else{
        this.showImpactOpinionDialog = false
        this._statementClicked()
      }
    }
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
          if(this.$refs.mainStatementBox){
            this.statementTextHeight = (this.$refs.mainStatementBox).offsetHeight
          }
        }, 700)
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
    isPublished(){
      return this.relation && this.relation['published_at']
    },
    isAuthor(){
      return this.relation && this.user && this.relation['user_id'] === this.user['id']
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
    relationOpinionType(){
      return this.relation === null || typeof this.relation['user_opinion'] === 'undefined' || this.relation['user_opinion'] === null ? -1 : this.relation['user_opinion']['type']
    },
    ctPoints(){
      return this.statement && typeof this.statement['ct_points'] !== 'undefined' ? this.statement['ct_points'] : '00'
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
    userOpinions(){
      return typeof this.relation['user_opinions'] === 'object' ? this.relation['user_opinions'] : []
    },
    userOpinionType(){
      let userOpinionType = -1
      if(this.relation && typeof this.relation['user_opinion'] !== 'undefined'){
        // if(this.relationData['virtual_relation_id']){
        //   userOpinionType = this.relationData['virtual_relation'] && this.relationData['virtual_relation']['user_opinion'] ? this.relationData['virtual_relation']['user_opinion']['type'] : 0
        if(this.relation['user_opinion']){
          userOpinionType = this.relation['user_opinion']['type']
        }
      }
      return userOpinionType
    },
    contextRootRelationId(){
      const hasContext = typeof this.relation !== 'undefined' && typeof this.relation['user_relation_context_locks'] !== 'undefined' && this.relation['user_relation_context_locks'].length
      return hasContext ? this.relation['user_relation_context_locks'][0]['root_relation_id'] : null
      // return typeof this.$route.params.rootRelationId !== 'undefined' ? this.$route.params.rootRelationId * 1 : null
    },
    userFollowingNames(){
      let names = ''
      for(let userId in this.userFollowing){
        if(names !== ''){
          names += ', '
        }
        if(typeof this.userFollowing[userId]['username'] !== 'undefined'){
            names += this.userFollowing[userId]['username']
        }else if(typeof this.userFollowing[userId]['user'] !== 'undefined' && this.userFollowing[userId]['user']){
            names += this.userFollowing[userId]['user']['username'] + '(b)'
        }else{
          names += 'unknown-user-' + userId
        }
      }
      return names
    }
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
