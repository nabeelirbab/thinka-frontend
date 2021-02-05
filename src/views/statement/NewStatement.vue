<template>
  <div class="container bg-white height-max pt-4">
    <h5>Create New statement</h5>
    <div class="bg-primary text-white px-2 pb-3 pt-3 statement-radius">
      <!-- <input v-model="statement.logic_tree.name" placeholder="Logic Tree Name" class="form-control mb-2" /> -->
      <div class="mb-2">
        <select v-model="statement.statement_type_id" class="form-control">
          <option value="0">Please select</option>
          <template v-for="(statementType, index) in statementTypes" :key="'statementId' + index">
            <option :value="statementType['id']">{{statementType['description']}} </option>
          </template>
        </select>
        <small v-if="statement.statement_type_id * 1"><fa icon="info-circle" /> {{statementTypes[findArrayIndex(statement.statement_type_id, statementTypes, 'id')]['explaination']}}</small>
        <small v-else>Please select a statement type</small>
      </div>
      
      <textarea
        ref="statementText"
        @keydown="isTextTyping" 
        v-model="statement.text" 
        placeholder="Write your statement here" 
        class="form-control mb-2" 
        style="height: calc(100vh - 520px); min-height: 250px"
      ></textarea>
      <Suggestion ref="suggestion" 
        @select="sugestionSelected" 
        :logic-tree-id="null"
        :no-join="true"
        class="mb-2"
      />
      <div class="mb-2">
        <select v-model="statement.scope_id" class="form-control">
          <option value="0">Please select</option>
          <template v-for="(scope, index) in scopes" :key="'statementId' + index">
            <option :value="scope['id']">{{scope['description']}} </option>
          </template>
        </select>
      </div>
      <div class="mb-2">
        <select v-model="statement.context_id" class="form-control text-capitalize">
          <option value="0">Please select</option>
          <template v-for="context in contexts">
            <option :value="context['id']">{{context['description']}}</option>
          </template>
        </select>
      </div>

      <!-- <textarea v-model="statement.synopsis" placeholder="Synopsis" class="form-control mb-2" rows="1"></textarea>
      <textarea v-model="statement.comment" placeholder="Comment" class="form-control mb-2" rows="1"></textarea> -->
      <div class="text-right">
        <!-- <div class="form-check form-check-inline c-pointer">
          <input v-model="statement.published_at" class="form-check-input " type="checkbox">
          <label class="form-check-label" for="inlineCheckbox1">Make Public</label>
        </div> -->
        <button @click="save" :disabled="statement.text === '' || statement.statement_type_id === '0' || statement.scope_id === '0' || statement.context === ''" class="btn btn-success"><fa icon="save" /> Save</button>
      </div>
    </div>
    <Prompt ref="prompt"></Prompt>
  </div>
</template>
<script>
import StatementAPI from '@/api/statement'
import StatementTypeAPI from '@/api/statement-type'
import ScopeAPI from '@/api/scope'
import ContextAPI from '@/api/context'
import Prompt from '@/components/Prompt'
import Suggestion from '@/views/statement/statement-components/create-sub-statement-components/Suggestion'
export default {
  components: {
    Prompt,
    Suggestion
  },
  mounted(){
    this.initialize()
  },
  data(){
    return {
      statementTypes: [],
      scopes: [],
      contexts: [],
      isSuggestionSelected: false,
      statement: {
        relation: {
          relation_type_id: 11, // Fact
          relevance_window: 0,
        },
        statement_type_id: '0',
        logic_tree: {
          name: '',
        },
        text: '',
        scope_id: '0',
        context_id: 1,
        // synopsis: '',
        // comment: '',
        id: null,
      },
      isLoading: false
    }
  },
  methods: {
    save(){
      this.isLoading = true
      this.statement['logic_tree']['name'] = this.statement.text
      
      StatementAPI.create(this.statement).then(result => {
        if(result['data']){
          console.log('success', result['data'])
          this.$router.push('/branch/' + result['data']['relation']['id'] + '/t/' + this.toKebabCase(this.statement['text'].slice(0, 30)))
        }
        this.isLoading = false
      }).catch(errorResult => {
        if(typeof errorResult.response.status !== 'undefined'){
          if(errorResult.response.status === 422){ // unprocessible entity
            let responseError = errorResult.response.data.error
            console.log(responseError, responseError['code'])
            if(responseError['code'] * 1 === 4){ // statement already existed error
              this.existingStatementPrompt(responseError['message']['statement'])
            }
          }
        }else{
          this.isLoading = false
          console.error('Error on create new', errorResult)
        }
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
    initialize(){
      const param = {
        select: ['description', 'explaination']
      }
      StatementTypeAPI.retrieve(param).then(result => {
        this.statementTypes = result['data']
      })
      this.scopes = ScopeAPI.cachedData.value ? ScopeAPI.cachedData.value['data'] : []
      this.contexts = ContextAPI.cachedData.value ? ContextAPI.cachedData.value['data'] : []
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
        this.statement['id'] = null
        // if(this.relation['statement_id'])
        // this.isSuggestionSelected = false
        // this.statement['text'] = ''
      }
    },
  }
}
</script>
