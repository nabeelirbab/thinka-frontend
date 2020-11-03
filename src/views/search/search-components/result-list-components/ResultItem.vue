<template>
  <div class="border rounded px-3 py-2 mb-2 ">
    <div class="d-flex justify-content-between">
      <small class="text-nowrap text-truncate">{{parentStatement ? parentStatement['text'] : 'Root Statement'}}</small>
      <small class="text-nowrap">{{statement['created_at']}}</small>
    </div>
    <div class="d-flex justify-content-between">
      <router-link :to="'/statement/' + statement['id']" tag="div" class="font-weight-bold text-dark text-justify pr-2 mb-1">{{statement['text']}}</router-link>
      <CTPoints :points="statement['ct_points']" />
    </div>
    <div>
      <div>
        <small class="badge badge-pill badge-primary mr-1 text-nowrap">Created by <strong>{{statement['user'] ? statement['user']['name'] : null}}</strong></small>
        <small class="badge badge-pill badge-success text-nowrap"><strong>{{statement['subscribers'].length}}</strong> Subscribers</small>
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
    statement: Object,
    
  },
  computed: {
    parentStatement(){
      return typeof this.statement['statement'] !== 'undefined' && this.statement['statement'] ? this.statement['statement'] : null
    }
  }
}
</script>
