<template>
  <div :class="isPositiveStatement ? 'positive-statement' : 'negative-statement'" class="d-flex align-items-center statement-radius mb-1 border-width border-dark p-2 px-2" :style-d="{'padding-left': (((level - 1) * 20) + 8)+ 'px!important'}">
    <!-- <div v-if="isSupport === null" class="w-100 text-center">
      <button @click="isSupport = true" class="btn btn btn-outline-dark mx-1 my-1"><fa icon="plus" /> Support</button> or
      <button @click="isSupport = false" class="btn btn btn-outline-dark mx-1 my-1"><fa icon="minus" /> Rebut</button>
    </div> -->
    <div class="flex-fill px-2">
      <select v-model="statement.relation.relation_type_id" class="border border-danger rounded bg-transparent text-danger font-weight-bold mb-1">
        <template v-for="relationType in relationTypes" :key="'relationType' + relationType['id']">
          <option :value="relationType['id']">{{relationType['symbol']}} {{relationType['description']}}</option>
        </template>
      </select>
      <textarea v-model="statement.text" class="w-100 bg-transparent border-0" :placeholder="'Type your statement here...'" rows="2"></textarea>
    </div>
    <div class="mx-2">
      <button @click="save" :disabled="statement.text.length < 3 || isLoading" class="btn btn-success"><fa :icon="isLoading ? 'spinner' : 'save'" :spin="isLoading" /></button>
    </div>
  </div>
</template>
<script>
import StatementAPI from '@/api/statement'
import RelationTypeAPI from '@/api/relation-type'
export default {
  props: {
    isPositiveStatement: Boolean,
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
  data(){
    return {
      isSupport: null,
      isLoading: false,
      statement: {
        relation: {
          relation_type_id: this.isPositiveStatement ? '2' : '1',
          relevance_window: this.isPositiveStatement ? 0 : 1,
          relevance_row: 0,
          logic_tree_id: this.logicTreeId,
          statement_id_1: this.statementId
        },
        statement_type_id: 1,
        text: ''
      }
    }
  },
  methods: {
    save(){
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
          console.log('newSubStatement', newSubStatement)
          this.$emit('save', JSON.parse(JSON.stringify(newSubStatement)))
          this.reset()
        }
        this.isLoading = false
        this.isSupport = null
      })
    },
    reset(){
      this.statement['text'] = ''
      this.statement['relation']['relation_type_id'] = '2'
    }
  },
  watch: {
    'statement.relation.relation_type_id'(newData){
      const selectedRelationTypeIndex = this.findArrayIndex(newData, this.relationTypes, 'id')
      this.statement.relation.relevance_row = selectedRelationTypeIndex >= 0 ? this.relationTypes[selectedRelationTypeIndex]['relevance'] : -1
    }
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