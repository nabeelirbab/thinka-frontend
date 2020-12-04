<template>
  <div :class="isPositiveStatement ? 'positive-statement' : 'negative-statement'" class="d-flex align-items-center statement-radius mb-1 border-width border-dark p-2" :style="{'padding-left': (((level - 1) * 20) + 8)+ 'px!important'}">
    <div class="flex-fill ">
      <div class="mb-1">
        <select v-model="statement.relation.relation_type_id" :disabled="isLoading" class="border border-danger rounded bg-transparent text-danger font-weight-bold mb-1">
          <template v-for="relationType in relationTypes" :key="'relationType' + relationType['id']">
            <option :value="relationType['id']">{{relationType['symbol']}} {{relationType['description']}}</option>
          </template>
        </select>
        <button @click="save" :disabled="statement.text.length < 3 || isLoading" class="btn btn-success py-1 float-right">
          <fa v-if="isSuccess" icon="check" />
          <fa v-else-if="isLoading" icon="spinner" spin />
          <fa v-else icon="save" /> Save
        </button>
      </div>
      <textarea ref="statementText" v-model="statement.text" @keydown="isTextTyping" @keypress.enter="enterPressed" :disabled="isLoading || statement['id']" class="w-100 bg-transparent border-0" :placeholder="'Type your statement here...'" rows="2"></textarea>
      <Suggestion ref="suggestion" @select="sugestionSelected" />
    </div>
    
  </div>
</template>
<script>
import StatementAPI from '@/api/statement'
import RelationTypeAPI from '@/api/relation-type'
import Suggestion from './create-sub-statement-components/Suggestion'
export default {
  components: {
    Suggestion
  },
  props: {
    isPositiveStatement: Boolean,
    parentRelationId: Number,
    level: Number,
    logicTreeId: {
      type: Number,
      required: true
    },
    statementId: {
      type: Number,
      required: true
    }
  },
  emits: {
    save: null
  },
  mounted(){
    console.log('mounted')
    this.$refs.statementText.focus()
  },
  data(){
    return {
      isLoading: false,
      isSuccess: false,
      statement: {
        relation: {
          parent_relation_id: this.parentRelationId,
          relation_type_id: this.isPositiveStatement ? '2' : '1',
          relevance_window: this.isPositiveStatement ? 0 : 1,
          relevance_row: 0,
          logic_tree_id: this.logicTreeId,
          is_public: true
        },
        id: null,
        statement_type_id: 1,
        text: ''
      },
      
    }
  },
  methods: {
    test(e){
      console.log(e)
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
      if(selectedSuggestion){
        this.statement['id'] = selectedSuggestion['id']
        this.statement['text'] = selectedSuggestion['text']
      }else{
        this.statement['id'] = null
        // this.statement['text'] = ''
      }
    },
    save(){
      this.$refs.suggestion._stopSuggesting()
      this.isSuccess = false
      this.isLoading = true
      const param = {
        ...this.statement,
        is_public: true
      }
      StatementAPI.create(param).then(result => {
        if(result['data']){
          // this.$router.push('/statement/' + result['data']['id'])
          let newSubStatement = JSON.parse(JSON.stringify(param))
          newSubStatement['id'] = result['data']['id']
          newSubStatement['relation']['id'] = result['data']['relation']['id']
          this.$emit('save', JSON.parse(JSON.stringify(newSubStatement)))
          this.isSuccess = true
          setTimeout(() => {
            this.reset()
          }, 600)
        }else{
          this.isLoading = false
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    reset(){
      this.isSuccess = false
      this.isLoading = false
      this.statement['id'] = null
      this.statement['text'] = ''
      this.statement['relation']['relation_type_id'] = '2'
      this.$refs.suggestion._reset()
      setTimeout(() => {
        this.$refs.statementText.focus()
      }, 200)
    }
  },
  watch: {
    'statement.relation.relation_type_id'(newData){
      const selectedRelationTypeIndex = this.findArrayIndex(newData, this.relationTypes, 'id')
      this.statement.relation.relevance_row = selectedRelationTypeIndex >= 0 ? this.relationTypes[selectedRelationTypeIndex]['relevance'] : -1
    },
    // 'statement.text'(){
    //   this.$refs.suggestion._isTextTyping(this.$refs.statementText.value)
    // }
  },
  computed: {
    relationTypes(){
      return RelationTypeAPI.cachedData.value && typeof RelationTypeAPI.cachedData.value['data'] ? RelationTypeAPI.cachedData.value['data'] : []
    }
  }
}
</script>
<style scoped>
textarea:focus {
  border: none!important
}
</style>