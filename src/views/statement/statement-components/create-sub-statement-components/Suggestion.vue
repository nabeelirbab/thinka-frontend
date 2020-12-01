<template>
  <div>
    <div :class="typedText === '' ? 'invisible' : '' " class="d-flex text-sm">
      <div>Suggestions: </div>
      <div class="flex-fill mx-1">
        <span v-if="typedText === null || typedText === ''" class="text-secondary text-italic">Nothing to suggest</span>
        <fa v-else-if="isLoadingSuggestion" icon="spinner" spin />
        <span v-else-if="!suggestions.length">No suggestions found</span>
        <template v-else v-for="suggestion in suggestions" :key="'sugges' + suggestion['id']">
          <div v-if="selectedSuggestionId === null || selectedSuggestionId === suggestion['id']">
            <span :class="selectedSuggestionId ? 'font-weight-bold' : ''" class="mr-1">{{suggestion['text']}}</span>
            <span v-if="!selectedSuggestionId" @click="selectSuggestion(suggestion)" class="c-pointer text-info text-hover-underline">Select</span>
            <span v-else @click="selectSuggestion(null)" class="c-pointer text-danger text-hover-underline">Unselect</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import StatementAPI from '@/api/statement'
export default {
  emits: ['select'],
  data(){
    return {
      suggestions: [],
      isLoadingSuggestion: false,
      suggestionTimeout: null,
      typedText: '',
      selectedSuggestionId: null
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
      this.suggestions = []
      this.isLoadingSuggestion = false
      this.typedText = ''
      this.selectedSuggestionId = null
    },
    getSuggestions(){
      this.suggestions = []
      const param = {
        limit: 3,
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
      StatementAPI.retrieve(param).then(result => {
        if(result['data']){
          this.suggestions = result['data']
        }else{
          this.suggestions = []
        }
        this.isLoadingSuggestion = false
      }).catch(error => {
        console.error(error)
        this.isLoadingSuggestion = false
      })
    },
    selectSuggestion(selectedStatement){
      this.selectedSuggestionId = selectedStatement ? selectedStatement['id'] : null
      this.$emit('select', selectedStatement)
    }
  }
}
</script>