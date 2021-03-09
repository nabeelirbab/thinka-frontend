<template>
  <div class="">
    <RelationRow 
      :relation="relation"
    />
  </div>
</template>
<script>
import RelationRow from '@/components/RelationRow'
import CTPoints from '@/components/CTPoints'
export default {
  components: {
    CTPoints,
    RelationRow
  },
  props: {
    relation: {
      type:Object,
      required: true
    },
  },
  computed: {
    statement(){
      return this.relation && this.relation['statement'] ? this.relation['statement'] : null
    },
    parentStatement(){
      return this.relation && this.relation['parent_relation'] && this.relation['parent_relation']['statement'] ? this.relation['parent_relation']['statement'] : null
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
<style>
.hover-border-dark:hover {
  background-color: whitesmoke;
  /* border: 1px solid!important */
}
</style>
