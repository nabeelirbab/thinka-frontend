<template>
  <div :class="isPositiveStatement ? 'positive-statement' : 'negative-statement'" class="d-flex align-items-center statement-radius mb-1 border-width border-dark p-2 px-2" :style="{'padding-left': (((level - 1) * 20) + 8)+ 'px!important'}">
    <div>
      <select v-model="statement.relation.relation_type_id" class="border border-danger rounded bg-transparent text-danger font-weight-bold">
        <template v-for="relationType in relationTypes" :key="'relationType' + relationType['id']">
          <option :value="relationType['id']">{{relationType['symbol']}}</option>
        </template>
        <!-- <option value="2">+</option>
        <option value="1">-</option>
        <option value="4">&</option>
        <option value="12">^</option>
        <option value="13">*</option> -->
      </select>
    </div>
    <textarea v-model="statement.text" class="w-100 bg-transparent border-0 ml-2" :placeholder="'Type your statement here...'" rows="2"></textarea>
    <div class="mx-2">
      <button @click="save" :disabled="statement.text.length < 3" class="btn btn-success "><fa icon="save" /></button>
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
      isLoading: false,
      statement: {
        relation: {
          relation_type_id: '2',
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
      })
    },
    reset(){
      this.statement['text'] = ''
      this.statement['relation']['relation_type_id'] = '2'
    }
  },
  computed: {
    relationTypes(){
      return RelationTypeAPI.cachedData.values && typeof RelationTypeAPI.cachedData.values['data'] ? RelationTypeAPI.cachedData.values['data'] : []
    }
  }
}
</script>
<style scoped>
textarea:focus {
  border: none!important
}
</style>