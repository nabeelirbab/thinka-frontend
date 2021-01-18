<template>
  <div>
    <div :class="typedText === '' ? 'invisible' : '' " class="d-md-flex text-sm">
      <div>Suggestions: </div>
      <div class="flex-fill mx-1">
        <span v-if="typedText === null || typedText === ''" class="text-secondary text-italic">Nothing to suggest</span>
        <fa v-else-if="isLoadingSuggestion" icon="spinner" spin />
        <span v-else-if="!suggestions.length">No suggestions found</span>
        <template v-else >
          <template v-for="(suggestion, index) in suggestions" :key="'sugges' + suggestion['id']"> 
            <div v-if="(selectedSuggestionId === null && joinedSuggestionId === null) || selectedSuggestionId === suggestion['id'] || joinedSuggestionId === suggestion['id']" :class="index !== suggestions.length - 1 ? 'border-bottom ' : ''" class="d-flex align-items-center" style="min-width: 0">
              <div>
                <div v-if="suggestion['logic_tree']" class="text-sm text-break"><fa icon="tree" /> {{suggestion['logic_tree']['name']}}</div>
                <div :class="selectedSuggestionId ? 'font-weight-bold' : ''" class="mr-1 text-break">{{suggestion['statement']['text']}}</div>
              </div>
              <div class="pl-2">
                <template v-if="!joinedSuggestionId">
                  <span v-if="!selectedSuggestionId" @click="selectSuggestion(suggestion)" class="c-pointer text-info text-hover-underline"><fa icon="clipboard" /> Select</span>
                  <span v-else @click="selectSuggestion(null)" class="c-pointer text-danger text-hover-underline">Unselect</span>
                </template>
                <template v-if="!noJoin &&!selectedSuggestionId && suggestion['parent_relation_id'] === null && suggestion['user_id'] * 1 === user['id'] * 1 && suggestion['logic_tree_id'] !== logicTreeId">
                  <span v-if="!joinedSuggestionId" @click="joinSuggestion(suggestion)" class="c-pointer text-info text-hover-underline ml-1"><fa icon="paste" /> Join</span>
                  <span v-else @click="joinSuggestion(null)" class="c-pointer text-danger text-hover-underline ml-1">Cancel Joining</span>
                </template>
              </div>
            </div>
          </template>
          <div v-if="hasMoreSuggestions" class="border-top ">
            <span @click="showMore" class="text-info text-hover-underline c-pointer" >Show more...</span>
          </div>
        </template>
      </div>
    </div>
    <modal ref="moreSuggestionModal" title="Statement Suggestions">
      <div v-if="isLoadingSuggestion">
        Please wait... <fa icon="spinner" spin />
      </div> 
      <div v-else>
        <template v-for="(suggestion, index) in moreSuggestions" :key="'suggesMORE' + suggestion['id']"> 
          <div  :class="index !== moreSuggestions.length - 1 ? 'border-bottom' : ''" class="py-1 text-break d-flex align-items-center" style="min-width: 0">
            <div>
              <div v-if="suggestion['logic_tree']" class="text-sm"><fa icon="tree" /> {{suggestion['logic_tree']['name']}}</div>
              <span :class="selectedSuggestionId === suggestion['id'] ? 'font-weight-bold' : ''" class="mr-1">{{suggestion['statement']['text']}}</span>
            </div>
            <div class="pl-2">
                <template v-if="!joinedSuggestionId">
                  <span v-if="!selectedSuggestionId" @click="selectSuggestion(suggestion, true)" class="c-pointer text-info text-hover-underline"><fa icon="clipboard" /> Select</span>
                  <span v-else @click="selectSuggestion(null, true)" class="c-pointer text-danger text-hover-underline">Unselect</span>
                </template>
                <template v-if="!noJoin &&!selectedSuggestionId && suggestion['parent_relation_id'] === null && suggestion['user_id'] * 1 === user['id'] * 1 && suggestion['logic_tree_id'] !== logicTreeId">
                  <span v-if="!joinedSuggestionId" @click="joinSuggestion(suggestion, true)" class="c-pointer text-info text-hover-underline ml-1"><fa icon="paste" /> Join</span>
                  <span v-else @click="joinSuggestion(null, true)" class="c-pointer text-danger text-hover-underline ml-1">Cancel Joining</span>
                </template>
              </div>
          </div>
        </template>
      </div>

    </modal>
  </div>
</template>
<script>
/* This component is used by different modules */
import Modal from '@/components/bootstrap/Modal'
import RelationAPI from '@/api/relation'
import Auth from '@/core/auth'
export default {
  components: {
    Modal
  },
  props: {
    logicTreeId: {
      type: Number,
      required: true
    },
    noJoin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'join'],
  data(){
    return {
      user: Auth.user(),
      suggestions: [],
      moreSuggestions: [],
      isLoadingSuggestion: false,
      suggestionTimeout: null,
      typedText: '',
      selectedSuggestionId: null,
      joinedSuggestionId: null,
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
      this.selectedSuggestionId = null
      this.joinedSuggestionId = null
    },
    _stopSuggesting(){
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
          ...(['user_id', 'relation_type_id', 'parent_relation_id', 'logic_tree_id'])
        },
        sort: [{
          column: 'statement.text',
          order: 'desc'
        }],
        condition: [{
          column: 'statement.text',
          clause: 'like_alphanumeric_only',
          value: '%' + (this.typedText) + '%'
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
      this.selectedSuggestionId = selectedStatement ? selectedStatement['id'] : null
      if(selectedStatement && fromMoreSuggestion && this.findArrayIndex(selectedStatement['id'], this.suggestions, 'id') === -1){
        this.suggestions.unshift(selectedStatement)
      }
      this.$emit('select', selectedStatement)
      this.$emit('join', null)
    },
    joinSuggestion(selectedRelation, fromMoreSuggestion = false){
      this.joinedSuggestionId = selectedRelation ? selectedRelation['id'] : null
      if(selectedRelation && fromMoreSuggestion && this.findArrayIndex(selectedRelation['id'], this.suggestions, 'id') === -1){
        this.suggestions.unshift(selectedRelation)
      }
      this.$emit('join', selectedRelation)
      this.$emit('select', null)
    }
  }
}
</script>