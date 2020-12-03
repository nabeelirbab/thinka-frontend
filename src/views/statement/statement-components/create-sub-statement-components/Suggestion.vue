<template>
  <div>
    <div :class="typedText === '' ? 'invisible' : '' " class="d-flex text-sm">
      <div>Suggestions: </div>
      <div class="flex-fill mx-1">
        <span v-if="typedText === null || typedText === ''" class="text-secondary text-italic">Nothing to suggest</span>
        <fa v-else-if="isLoadingSuggestion" icon="spinner" spin />
        <span v-else-if="!suggestions.length">No suggestions found</span>
        <template v-else >
          <template v-for="(suggestion, index) in suggestions" :key="'sugges' + suggestion['id']"> 
            <div v-if="selectedSuggestionId === null || selectedSuggestionId === suggestion['id']" :class="index !== suggestions.length - 1 ? 'border-bottom ' : ''">
              <span :class="selectedSuggestionId ? 'font-weight-bold' : ''" class="mr-1">{{suggestion['text']}}</span>
              <span v-if="!selectedSuggestionId" @click="selectSuggestion(suggestion)" class="c-pointer text-info text-hover-underline">Select</span>
              <span v-else @click="selectSuggestion(null)" class="c-pointer text-danger text-hover-underline">Unselect</span>
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
          <div  :class="index !== moreSuggestions.length - 1 ? 'border-bottom' : ''" class="py-1">
            <span :class="selectedSuggestionId === suggestion['id'] ? 'font-weight-bold' : ''" class="mr-1">{{suggestion['text']}}</span>
            <span v-if="selectedSuggestionId !== suggestion['id']" @click="selectSuggestion(suggestion, true)" class="c-pointer text-info text-hover-underline">Select</span>
            <span v-else @click="selectSuggestion(null)" class="c-pointer text-danger text-hover-underline">Unselect</span>
          </div>
        </template>
      </div>

    </modal>
  </div>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
import StatementAPI from '@/api/statement'
export default {
  components: {
    Modal
  },
  emits: ['select'],
  data(){
    return {
      suggestions: [],
      moreSuggestions: [],
      isLoadingSuggestion: false,
      suggestionTimeout: null,
      typedText: '',
      selectedSuggestionId: null,
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
        select: ['text'],
        sort: [{
          column: 'text',
          order: 'desc'
        }],
        condition: [{
          column: 'text',
          clause: 'like',
          value: '%' + this.typedText + '%'
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
      StatementAPI.retrieve(param).then(result => {
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
      if(fromMoreSuggestion && this.findArrayIndex(selectedStatement['id'], this.suggestions, 'id') === -1){
        this.suggestions.unshift(selectedStatement)
      }
      this.$emit('select', selectedStatement)
    }
  }
}
</script>