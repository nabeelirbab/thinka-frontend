<template>
  <div class="px-2 px-md-4 py-2">
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
      <textarea v-model="statement.text" placeholder="Write your statement here" class="form-control mb-2"></textarea>
      <textarea v-model="statement.synopsis" placeholder="Synopsis" class="form-control mb-2" rows="1"></textarea>
      <textarea v-model="statement.comment" placeholder="Comment" class="form-control mb-2" rows="1"></textarea>
      <div class="text-right">
        <div class="form-check form-check-inline c-pointer">
          <input v-model="statement.is_public" class="form-check-input " type="checkbox">
          <label class="form-check-label" for="inlineCheckbox1">Make Public</label>
        </div>
        <button @click="save" :disabled="statement.text === '' || statement.statement_type_id === '0'" class="btn btn-success"><fa icon="save" /> Save</button>
      </div>
    </div>
  </div>
</template>
<script>
import StatementAPI from '@/api/statement'
import StatementTypeAPI from '@/api/statement-type'
export default {
  mounted(){
    this.initialize()
  },
  data(){
    return {
      statementTypes: [],
      statement: {
        relation: {
          relation_type_id: 11, // Fact
          relevance_window: 0,
        },
        statement_type_id: '0',
        logic_tree: {
          name: '',
          is_public: false,
        },
        text: '',
        synopsis: '',
        comment: '',
        is_public: false
      },
      isLoading: false
    }
  },
  methods: {
    save(){
      this.isLoading = true
      this.statement['relation']['is_public'] = this.statement.is_public
      this.statement['logic_tree']['is_public'] = this.statement.is_public
      this.statement['logic_tree']['name'] = this.statement.text
      StatementAPI.create(this.statement).then(result => {
        if(result['data']){
          console.log('success', result['data'])
          this.$router.push('/branch/' + result['data']['relation']['id'])
        }
        this.isLoading = false
      })
    },
    initialize(){
      const param = {
        select: ['description', 'explaination']
      }
      StatementTypeAPI.retrieve(param).then(result => {
        console.log(result)
        this.statementTypes = result['data']
      })
    }
  }
}
</script>
