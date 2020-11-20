<template>
  <div class="border rounded px-3 py-2 mb-2 ">
    <div class="d-flex justify-content-between">
      <small class="text-nowrap text-truncate">{{parentStatement ? parentStatement['text'] : 'Root Statement'}}</small>
      <small class="text-nowrap">{{formatDate(statement['created_at'])}}</small>
    </div>
    <div class="d-flex justify-content-between">
      <div>
        <router-link :to="'/branch/' + relation['id']" class="font-weight-bold text-dark text-justify pr-2 mb-2">{{statement['text']}}</router-link>
        <p v-if="statement['synopsis'] && statement['synopsis'] !== ''" class="mb-0">{{statement['synopsis']}}</p>
        <p v-if="statement['comment'] && statement['comment'] !== ''" class="text-secondary mb-1">{{statement['comment']}}</p>
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
    relation: {
      type:Object,
      required: true
    },
  },
  computed: {
    statement(){
      return this.relation['statement']
    },
    parentStatement(){
      return this.relation['parent_relation'] && this.relation['parent_relation']['statement'] ? this.relation['parent_relation']['statement'] : null
    },
    logicTreeId(){
      if(this.relation && typeof this.relation['logic_tree_id'] !== 'undefined'){
        return this.relation['logic_tree_id']
      }else if(this.relation['logic_tree']){
        return this.relation['logic_tree']['id']
      }else{
        return null
      }
    },
    subscribers(){
      return 1 // typeof this.statement['subscribers'] === 'undefined' ? [] : this.statement['subscribers']
    }
  }
}
</script>
