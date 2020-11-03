<template>
  <div class="mb-2">
    <div class="border border-secondary rounded px-3 py-2 mb-2">
      <div class="d-flex justify-content-between mb-1">
        <div>
          <small class="badge badge-pill badge-primary mr-1 text-nowrap">By <strong>{{statement['user'] ? statement['user']['name'] : null}}</strong></small>
          <small class="badge badge-pill badge-secondary">Level {{level}}</small>
        </div>
        <small class="text-nowrap">{{statement['created_at']}}</small>
      </div>
      <div class="d-flex justify-content-between">
        <router-link :to="'/statement/' + statement['id']" tag="div" class="font-weight-bold text-dark text-justify pr-2 mb-1">{{statement['text']}}</router-link>
        <CTPoints :points="statement['ct_points']" />
      </div>
      <div class="d-flex justify-content-between">
        <div>
          <small class="badge badge-pill  text-nowrap"><strong>{{statement['subscribers'].length}}</strong> Subscribers</small>
        </div>
        <AddStatementOption size="compact" class="text-right" />
      </div>
    </div>
    <div class="pl-4">
        <template v-for="(children, index) in statement['children']" :key="'children' + index">
          <SubStatement :statement="children" :level="level + 1" />
        </template>
      </div>
  </div>
</template>
<script>
import CTPoints from '@/components/CTPoints'
import SubStatement from './SubStatement'
import AddStatementOption from './AddStatementOption'
export default {
  name: 'SubStatement',
  components: {
    CTPoints,
    AddStatementOption,
    SubStatement
  },
  props: {
    level: Number,
    statement: {
      type: Object,
      required: true
    }
  },
  computed: {
    parentStatement(){
      return typeof this.statement['statement'] !== 'undefined' && this.statement['statement'] ? this.statement['statement'] : null
    }
  }
}
</script>