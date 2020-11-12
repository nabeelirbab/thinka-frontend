<template>
  <div class="border rounded px-3 py-2 mb-2 ">
    <div class="d-flex justify-content-between">
      <small class="text-nowrap text-truncate">{{parentStatement ? parentStatement['text'] : 'Root Statement'}}</small>
      <small class="text-nowrap">{{formatDate(statement['created_at'])}}</small>
    </div>
    <div class="d-flex justify-content-between">
      <div>
        <router-link :to="'/statement/' + logicTreeId + '/' + statement['id']" class="font-weight-bold text-dark text-justify pr-2 mb-2">{{statement['text']}}</router-link>
        <p v-if="statement['synopsis'] && statement['synopsis'] !== ''">{{statement['synopsis']}}</p>
        <p v-if="statement['comment'] && statement['comment'] !== ''" class="text-secondary">{{statement['comment']}}</p>
      </div>
      <CTPoints :points="statement['ct_points']" />
    </div>
    <div>
      <div>
        <small class="badge badge-pill badge-primary mr-1 text-nowrap">Created by <strong>{{statement['user'] ? statement['user']['name'] : null}}</strong></small>
        <small class="badge badge-pill badge-success text-nowrap"><strong>{{subscribers.length}}</strong> Subscribers</small>
      </div>
    </div>
  </div>
</template>
<script>
import CTPoints from '@/components/CTPoints'
export default {
  components: {
    CTPoints
  },
  props: {
    statement: {
      type:Object,
      required: true
    },
  },
  computed: {
    parentStatement(){
      return typeof this.statement['relation'] !== 'undefined' && this.statement['relation'] && this.statement['relation']['statement_1'] ? this.statement['relation']['statement_1'] : null
    },
    logicTreeId(){
      if(this.statement['relation'] && typeof this.statement['relation']['logic_tree_id'] !== 'undefined'){
        return this.statement['relation']['logic_tree_id']
      }else if(this.statement['logic_tree']){
        return this.statement['logic_tree']['id']
      }else{
        return null
      }
    },
    subscribers(){
      return typeof this.statement['subscribers'] === 'undefined' ? [] : this.statement['subscribers']
    }
  }
}
</script>
