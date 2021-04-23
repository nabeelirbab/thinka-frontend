<template>
  <div >
    <div :class="typedText === '' ? 'invisible' : '' " class="d-md-flex text-sm">
      <div>Suggestions: </div>
      <div class="flex-fill mx-1">
        <span v-if="typedText === null || typedText === ''" class="text-secondary text-italic">Nothing to suggest</span>
        <fa v-else-if="isLoadingSuggestion" icon="spinner" spin />
        <span v-else-if="!suggestions.length">No suggestions found</span>
        <template v-else >
          <SuggestionList
            @join-suggestion="joinSuggestion($event)"
            @select-suggestion="selectSuggestion($event)"
            @link-suggestion="linkSuggestion($event)"
            :suggestions="suggestions"
            :selected-suggestion-id="selectedSuggestionId"
            :joined-suggestion-id="joinedSuggestionId"
            :linked-suggestion-id="linkedSuggestionId"
            :no-join="noJoin"
            :no-link="noLink"
            :logic-tree-id="logicTreeId"
          />
          <div v-if="hasMoreSuggestions" class="border-top ">
            <span @click="showMore" class="text-info text-hover-underline c-pointer" >Show more...</span>
          </div>
        </template>
      </div>
    </div>
    <modal ref="moreSuggestionModal" title="Statement Suggestions" class="text-dark" >
      <div v-if="isLoadingSuggestion">
        Please wait... <fa icon="spinner" spin />
      </div>
      <div v-else>
        <SuggestionList
          @join-suggestion="joinSuggestion($event, true)"
          @select-suggestion="selectSuggestion($event, true)"
          @link-suggestion="linkSuggestion($event, true)"
          :suggestions="moreSuggestions"
          :selected-suggestion-id="selectedSuggestionId"
          :joined-suggestion-id="joinedSuggestionId"
          :linked-suggestion-id="linkedSuggestionId"
          :no-join="noJoin"
          :no-link="noLink"
          :logic-tree-id="logicTreeId"
        />
        <!-- <template v-for="(suggestion, index) in moreSuggestions" :key="'suggesMORE' + suggestion['id']">
          <div  :class="index !== moreSuggestions.length - 1 ? 'border-bottom' : ''" class="py-1 text-break d-flex align-items-center text-dark" style="min-width: 0">
            <div class="d-flex">
              <div class="p-1">
                  <template v-if="!joinedSuggestionId">
                    <span v-if="!selectedSuggestionId" @click="selectSuggestion(suggestion, true)" class="c-pointer text-info text-hover-underline" title="Use this statement"><fa icon="file" /> </span>
                    <span v-else @click="selectSuggestion(null, true)" class="c-pointer text-danger text-hover-underline">Unselect</span>
                  </template>
                  <template v-if="!noJoin &&!selectedSuggestionId && suggestion['parent_relation_id'] === null && suggestion['user_id'] * 1 === user['id'] * 1 && suggestion['logic_tree_id'] !== logicTreeId">
                    <span v-if="!joinedSuggestionId" @click="joinSuggestion(suggestion, true)" class="c-pointer text-info text-hover-underline ml-1" title="Join this Relation"><fa icon="project-diagram" /> </span>
                    <span v-else @click="joinSuggestion(null, true)" class="c-pointer text-danger text-hover-underline ml-1">Cancel Joining</span>
                  </template>
                </div>
              <span :class="selectedSuggestionId === suggestion['id'] ? 'font-weight-bold' : ''" class="p-1 mr-1 text-dark">{{suggestion['statement']['text']}}</span>
            </div>
          </div>
        </template> -->
      </div>

    </modal>
  </div>
</template>
<script>
/* This component is used by different modules */
import Modal from '@/components/bootstrap/Modal'
import RelationAPI from '@/api/relation'
import Auth from '@/core/auth'
import SuggestionList from './SuggestionList'
export default {
  components: {
    Modal,
    SuggestionList
  },
  props: {
    logicTreeId: {
      type: [Number, Object],
    },
    noJoin: {
      type: Boolean,
      default: false
    },
    noLink: { // no virtual linking of relation
      type: Boolean,
      default: true
    },

  },
  emits: ['select', 'join', 'link'],
  data(){
    return {
      user: Auth.user(),
      suggestions: [],
      moreSuggestions: [],
      isLoadingSuggestion: false,
      suggestionTimeout: null,
      typedText: '',
      selectedSuggestionId: 0,
      joinedSuggestionId: 0,
      linkedSuggestionId: 0,
      hasMoreSuggestions: false,
    }
  },
  methods: {
    _isTextTyping(text){
      if(this.typedText === text){
        return false
      }else if(text.length < 3){
        this.typedText = text
        return false
      }
      this.typedText = text
      this.isLoadingSuggestion = true
      clearTimeout(this.suggestionTimeout)
      this.suggestions = []
      this.suggestionTimeout = setTimeout(() => {
        this.getSuggestions()
      }, 1000) // show suggestion every 1.5 seconds
    },
    _reset(){
      clearTimeout(this.suggestionTimeout)
      this.suggestions = []
      this.isLoadingSuggestion = false
      this.typedText = ''
      this.selectedSuggestionId = 0
      this.joinedSuggestionId = 0
      this.linkedSuggestionId = 0
    },
    _stopSuggesting(){
      this.isLoadingSuggestion = false
      clearTimeout(this.suggestionTimeout)
    },
    showMore(){
      this.isLoadingSuggestion = true
      this.$refs.moreSuggestionModal._open()
      this.getSuggestions(true)
    },
    getSuggestions(more = false){
      let param = {
        select: {
          logic_tree: {
            select: ['name', 'statement_id']
          },
          statement: {
            select: {
              ...(['text', 'statement_type_id'])
            }
          },
          ...(['user_id', 'relation_type_id', 'parent_relation_id', 'logic_tree_id', 'published_at'])
        },
        sort: [{
          column: 'statement.text',
          order: 'desc'
        }],
        condition: [{
          column: 'statement.text',
          clause: 'like',
          value: '%' + (this.typedText) + '%'
        // }, {
        //   column: 'published_at',
        //   clause: '!=',
        //   value: null
        }]
      }
      if(!more){
        this.suggestions = []
        this.hasMoreSuggestions = false
        param['offset'] = 0
        param['limit'] = 3
      }else{
        this.moreSuggestions = []
        param['offset'] = 0
        param['limit'] = 20
      }
      RelationAPI.retrieve(param).then(result => {
        if(result['data']){
          if(!more){
            this.suggestions = result['data']
            if(result['additional_data']['total_result'] * 1 > 3){
              this.hasMoreSuggestions = true
            }
          }else{
            this.moreSuggestions = result['data']
          }
        }
        this.isLoadingSuggestion = false
      }).catch(error => {
        console.error(error)
        this.isLoadingSuggestion = false
      })
    },
    selectSuggestion(selectedStatement, fromMoreSuggestion = false){
      this.selectedSuggestionId = selectedStatement ? selectedStatement['id'] : 0
      if(selectedStatement && fromMoreSuggestion && this.findArrayIndex(selectedStatement['id'], this.suggestions, 'id') === -1){
        this.suggestions.unshift(selectedStatement)
      }
      this.$emit('select', selectedStatement)
      this.$emit('link', null)
      this.$emit('join', null)
    },
    joinSuggestion(selectedRelation, fromMoreSuggestion = false){
      this.joinedSuggestionId = selectedRelation ? selectedRelation['id'] : 0
      if(selectedRelation && fromMoreSuggestion && this.findArrayIndex(selectedRelation['id'], this.suggestions, 'id') === -1){
        this.suggestions.unshift(selectedRelation)
      }
      this.$emit('join', selectedRelation)
      this.$emit('link', null)
      this.$emit('select', null)
    },
    linkSuggestion(selectedRelation, fromMoreSuggestion = false){
      this.linkedSuggestionId = selectedRelation ? selectedRelation['id'] : 0
      if(selectedRelation && fromMoreSuggestion && this.findArrayIndex(selectedRelation['id'], this.suggestions, 'id') === -1){
        this.suggestions.unshift(selectedRelation)
      }
      this.$emit('link', selectedRelation)
      this.$emit('join', null)
      this.$emit('select', null)
    }
  }
}
</script>
