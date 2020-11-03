<template>
  <div>
    <div class="mb-2">
      <div v-if="parentStatement" class="text-nowrap text-truncate">Go to <router-link :to="'/statement/' + parentStatement['id']" class="font-italic" >{{parentStatement ? parentStatement['text'] : 'Root Statement'}}</router-link></div>
    </div>
    <div class="d-flex justify-content-between mb-2">
      <div class="">
        <NoProfile :name="statement['user']['name']" />
        <label class="mb-0 pl-1">{{statement['user']['name']}}</label>
      </div>
      <small class="text-nowrap pt-2">{{statement['created_at']}}</small>
      <CTPoints :points="statement['ct_points']" size="lg" />
    </div>
    <div class="border bg-primary text-white px-3 pb-3 pt-3">
      <div class="d-flex justify-content-between">
      </div>
      <div class="font-weight-bold text-white text-justify pr-2">
        <span class="text-warning font-weight-bold" style="font-size:1.5em">*</span> {{statement['text']}}
      </div>
    </div>
  </div>
</template>
<script>
import CTPoints from '@/components/CTPoints'
import NoProfile from '@/components/NoProfile'
export default {
  components: {
    CTPoints,
    NoProfile
  },
  props: {
    statement: Object
  },
  computed: {
    parentStatement(){
      return typeof this.statement['statement'] !== 'undefined' && this.statement['statement'] ? this.statement['statement'] : null
    }
  }
}
</script>