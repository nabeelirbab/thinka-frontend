<template>
  <div >
    <div class="fixed-bottom" >
      <div 
        :class="isPositiveStatement ? 'positive-statement' : (isPositiveStatement === false && !isMainStatement ? 'negative-statement' : 'text-white')" 
        class="bg-white shadow-sm align-items-center statement-radius border-width border-dark p-3 w-100" 
        style="position:static"
      >
        <div class="">
          <select 
            v-if="!(isMainStatement && relation['parent_relation_id'] === null && relation['virtual_relation_id'] === null)" 
            v-model="statement.relation.relation_type_id"
            :disabled="isLoading"
            class="border-primary text-primary border rounded font-weight-bold mb-1"
            style="padding:0.16em;"
          >
            <option value="0" default >Please Select</option>
            <template v-for="relationType in relationTypesDropDown" :key="'relationType' + relationType['id']">
              <option :value="relationType['id']">{{relationType['symbol']}} {{relationType['description']}}</option>
            </template>
          </select>
        </div>
        <div class="pt-2">
          <div v-if="toJoinRelation">
            {{toJoinRelation['statement']['text']}}
          </div>
          <div v-else-if="toLinkRelation">
            {{toLinkRelation['statement']['text']}}
          </div>
          <textarea v-else ref="statementText" v-model="statement.text" @keydown="isTextTyping" @keypress.enter="enterPressed" :disabled="isLoading || (statement['id'] && mode === 'create')" class="bg-transparent border-0" :placeholder="'Type your statement here...'"   style="min-width: 100%;" rows="3"></textarea>
          <Suggestion ref="suggestion" 
            @select="sugestionSelected" 
            @join="suggestionJoined"
            @link="suggestionLinked"
            :logic-tree-id="logicTreeId"
            :no-join="mode !== 'create'"
            :no-link="mode !== 'create'"
          />
        </div>
        <select 
          v-if="isMainStatement && relation['parent_relation_id'] === null && relation['virtual_relation_id'] === null" 
          v-model="statement.context_id"
          :disabled="isLoading" 
          class="border rounded font-weight-bold my-1 text-white bg-transparent text-capitalize"
        >
          <option default class="text-dark">Please Select</option>
          <template v-for="context in contexts">
            <option :value="context['id']" class="text-dark">{{context['description']}}</option>
          </template>
        </select>
        <div class="text-right">
          <button @click="save" :disabled="!canSave" class="btn btn-primary py-1">
            <fa v-if="isSuccess" icon="check" />
            <fa v-else-if="isLoading" icon="spinner" spin />
            <span v-else><fa  icon="save" /> Save</span>
          </button>
          <button @click="cancel" :disabled="isLoading" class="btn btn-outline-dark py-1 px-2 px-3 ml-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <Prompt ref="prompt"></Prompt>
  </div>
</template>
<script>
import StatementAPI from '@/api/statement'
import RelationAPI from '@/api/relation'
import RelationTypeAPI from '@/api/relation-type'
import Suggestion from './create-sub-statement-components/Suggestion'
import GlobalData from '../global-data'
import Prompt from '@/components/Prompt'
import ContextAPI from '@/api/context'
export default {
  components: {
    Suggestion,
    Prompt
  },
  props: {
    isPositiveStatement: Boolean,
    isMainStatement: {
      type: Boolean,
      default: false
    },
    parentRelationId: Number,
    parentRelation: Object,
    level: Number,
    logicTreeId: {
      type: Number,
      required: true
    },
    relationId: Number,
    relation: Object,
    mode: {
      type: String,
      default: 'create'
    }
  },
  emits: {
    save: null,
    cancel: null
  },
  mounted(){
    this.$refs.statementText.focus()
    this.hideToolbarDialog()
  },
  setup(){
    return {
      ...GlobalData
    }
  },
  data(){
    return {
      isLoading: false,
      isSuggestionSelected: false,
      toJoinRelation: null,
      toLinkRelation: null,
      isSuccess: false,
      statement: {
        relation: {
          id: null,
          parent_relation_id: this.parentRelationId,
          relation_type_id: this.isPositiveStatement ? '2' : '1',
          relevance_window: this.isPositiveStatement ? 0 : 1,
          relevance_row: 0,
          logic_tree_id: this.logicTreeId,
        },
        id: null,
        statement_type_id: 1,
        text: '',
        context_id: 1
      },

    }
  },
  methods: {
    autogrow(element){
      element.style.height = "5px";
      element.style.height = (element.scrollHeight)+"px";
    },
    cancel(){
      this.$emit('cancel')
    },
    enterPressed(e){
      if(!e.shiftKey && e.keyCode === 13){ // 13 is enter
        this.save()
      }
    },
    isTextTyping(e){
      if(e.keyCode !== 13){
        setTimeout(() => {
          this.$refs.suggestion._isTextTyping(this.$refs.statementText.value)
        }, 200)
      }
    },
    sugestionSelected(selectedSuggestion){
      if(selectedSuggestion){ // suggestiong selected
        this.isSuggestionSelected = true
        this.statement['id'] = selectedSuggestion['statement']['id']
        this.statement['text'] = selectedSuggestion['statement']['text']
      }else{
        if(this.relation){
          this.statement['id'] = this.relation['statement']['id']
          this.statement['text'] = this.relation['statement']['text']
        }else{
          this.statement['id'] = null
        }
        // if(this.relation['statement_id'])
        // this.isSuggestionSelected = false
        // this.statement['text'] = ''
      }
    },
    suggestionJoined(relation){
      this.toJoinRelation = relation
    },
    suggestionLinked(relation){
      this.toLinkRelation = relation
    },
    save(){
      this.$refs.suggestion._stopSuggesting()
      this.isSuccess = false
      this.isLoading = true
      const param = {
        ...this.statement,
      }
      if(this.mode === 'create'){
        if(this.toJoinRelation){
          this.joinRelation(JSON.parse(JSON.stringify(param)))
        }else if(this.toLinkRelation){
          this.linkRelation(JSON.parse(JSON.stringify(param)))
        }else{
          this.createStatement(JSON.parse(JSON.stringify(param)))
        }
      }else{
        this.updateStatement(JSON.parse(JSON.stringify(param)))
      }
    },
    joinRelation(){
      const selectedRelationType = this.relationTypes[(this.findArrayIndex(this.statement['relation']['relation_type_id'], this.relationTypes, 'id'))]
      let relevanceWindow = this.determineRelevanceWindow(selectedRelationType)
      RelationAPI.post('/join', {
        parent_relation_id: this.parentRelationId,
        relation_id: this.toJoinRelation['id'],
        relevance_window: relevanceWindow,
        relation_type_id: this.statement['relation']['relation_type_id'],
        impact_amount: (typeof selectedRelationType !== 'undefined') ? selectedRelationType['default_impact'] : 0,
      }).then(result => {
        if(result){
          this.$emit('save', {
            ...this.toJoinRelation,
            retrieve_relations: true, // retrieve the relation's tree on success
            relevance_window: relevanceWindow,
          })
          this.isSuccess = true
            setTimeout(() => {
              this.reset()
          }, 600)
        }else{
          this.isLoading = false
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    determineRelevanceWindow(relationType){
      let relevanceWindow = 0
      if(relationType['default_impact'] * 1 === 0){
        relevanceWindow = this.isPositiveStatement ? 0 : 1
      }else{
        relevanceWindow = relationType['default_impact'] * 1 === 1 ? 0 : 1
      }
      return relevanceWindow
    },
    linkRelation(){
      const selectedRelationType = this.relationTypes[(this.findArrayIndex(this.statement['relation']['relation_type_id'], this.relationTypes, 'id'))]
      let relevanceWindow = this.determineRelevanceWindow(selectedRelationType)
      const param = {
        ...this.statement['relation'],
        impact_amount: (typeof selectedRelationType !== 'undefined') ? selectedRelationType['default_impact'] : 0,
        parent_relation_id: this.parentRelationId,
        is_published: this.parentRelation['published_at'] ? true : false,
        virtual_relation_id: this.toLinkRelation['id'],
      }
      RelationAPI.post('/link', param).then(result => {
        console.log('link', {
              ...this.statement['relation'],
              statement: this.statement
            })
        if(result['data']){
          this.$emit('save', {
            virtual_relation: {
              ...this.statement['relation'],
              statement: this.statement
            },
            parent_relation_id: this.parentRelationId,
            virtual_relation_id: this.toLinkRelation['id'],
            id: result['data']['id'],
            retrieve_relations: true, // retrieve the relation's tree on success
            relevance_window: relevanceWindow,
          })
          this.isSuccess = true
            setTimeout(() => {
              this.reset()
          }, 600)
        }else{
          this.isLoading = false
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    createStatement(param){
      const selectedRelation = this.relationTypes[(this.findArrayIndex(param['relation']['relation_type_id'], this.relationTypes, 'id'))]
      param['relation']['impact_amount'] = (typeof selectedRelation !== 'undefined') ? selectedRelation['default_impact'] : 0
      StatementAPI.create(param).then(result => {
        if(result['data']){
          console.log('new', result['data'])
          let newSubStatement = param
          newSubStatement['id'] = result['data']['id']
          newSubStatement['created_at'] = result['data']['created_at']
          newSubStatement['relation']['id'] = result['data']['relation']['id']
          this.$emit('save', newSubStatement)
          this.isSuccess = true
          setTimeout(() => {
            this.reset()
          }, 600)
        }else{
          this.isLoading = false
        }
      }).catch(errorResult => {
        if(typeof errorResult.response !== 'undefined' && typeof errorResult.response.status !== 'undefined'){
          if(errorResult.response.status === 422){ // unprocessible entity
            let responseError = errorResult.response.data.error
            console.log(responseError, responseError['code'])
            if(responseError['code'] * 1 === 4){ // statement already existed error
              this.existingStatementPrompt(responseError['message']['statement'])
            }
          }
        }else{
          console.error('Error on create new', errorResult)
          this.isLoading = false
        }
        
      })
    },
    updateStatement(param){
      if(this.isSuggestionSelected){
        param['old_statement_id'] = this.relation['statement']['id']
      }
      StatementAPI.post('/update-relation', param).then(result => {
        if(result['data']){
          let newSubStatement = param
          newSubStatement['id'] = result['data']['id']
          this.isSuccess = true
          setTimeout(() => {
            this.$emit('save', newSubStatement)
          }, 400)
        }
        this.isLoading = false
      }).catch(() => {
        this.
        isLoading = false
      })
    },
    existingStatementPrompt(existingStatement){
      this.$refs.prompt._open(
        `<p>The statement you are trying to create already existed. You can revise your statement and be more specific or use the existing statement.</p>
          <p class="font-italic"> ${existingStatement['text']} </p>`,
        [{
          label: 'Ok',
          callback: () => {
            this.statement['id'] = existingStatement['id']
            this.save()
          }
        }, {
          label: 'I\'ll revise my statement',
          callback: () => {
            this.isLoading = false
          }
        }]
      )
    },
    reset(){
      this.isSuccess = false
      this.isLoading = false
      this.isSuggestionSelected = null
      this.toJoinRelation = null
      this.toLinkRelation = null
      this.statement['id'] = null
      this.statement['text'] = ''
      this.statement['relation']['relation_type_id'] = '2'
      setTimeout(() => {
        if(this.$refs.suggestion){
          this.$refs.suggestion._reset()
        }
        if(this.$refs.statementText){
          this.$refs.statementText.focus()
        }
      }, 200)
    }
  },
  watch: {
    'statement.relation.relation_type_id'(newData){
      const selectedRelationTypeIndex = this.findArrayIndex(newData, this.relationTypes, 'id')
      this.statement.relation.relevance_row = selectedRelationTypeIndex >= 0 ? this.relationTypes[selectedRelationTypeIndex]['relevance'] : -1
    },
    relation: {
      handler(relation){
        if(relation){
          this.statement['id'] = relation['statement']['id']
          this.statement['statement_type_id'] = relation['statement']['statement_type_id']
          this.statement['text'] = relation['statement']['text']
          this.statement['context_id'] = relation['statement']['context_id']
          this.statement['relation']['id'] = relation['id']
          this.statement['relation']['parent_relation_id'] = relation['parent_relation_id']
          this.statement['relation']['relation_type_id'] = relation['relation_type_id']
          this.statement['relation']['relevance_window'] = relation['relevance_window']
          this.statement['relation']['relevance_row'] = relation['relevance_row']
          this.statement['relation']['logic_tree_id'] = relation['logic_tree_id']
          this.statement['relation']['published_at'] = relation['published_at']
        }
      },
      immediate: true
    }
  },
  computed: {
    relationTypes(){
      return RelationTypeAPI.cachedData && RelationTypeAPI.cachedData.value ? RelationTypeAPI.cachedData.value['data'] : []
    },
    relationTypesDropDown(){
      const selectedRelationType = this.relationTypes[(this.findArrayIndex(this.statement['relation']['relation_type_id'], this.relationTypes, 'id'))]
      let relevanceWindow = this.determineRelevanceWindow(selectedRelationType)
      console.log(relevanceWindow)
      
      let relationTypesDropDown = []      
      RelationTypeAPI.cachedData.value['data'].forEach(relationType => {
        if(relationType['default_impact'] == 0 || 
            (relevanceWindow === 0 && relationType['default_impact'] == 1) || 
            (relevanceWindow === 1 && relationType['default_impact'] == -1)){
          relationTypesDropDown.push(relationType)
        }
      })
      
      return  relationTypesDropDown
    },
    contexts(){
      return ContextAPI.cachedData.value ? ContextAPI.cachedData.value['data'] : []
    },
    canSave(){
      return typeof this.statement !== 'undefined'
        && this.statement
        && this.statement['relation']
        && this.statement.text.length >= 3
        && (this.statement['relation']['relation_type_id'] * 1 !== 0 || this.statement['relation']['parent_relation_id'] * 1 === 0)
        && !this.isLoading
    }
  }
}
</script>
<style scoped>
textarea:focus {
  border: none!important
}
</style>
