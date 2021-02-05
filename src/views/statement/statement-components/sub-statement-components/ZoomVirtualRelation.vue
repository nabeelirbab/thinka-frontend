<template>
  <CircleIconButton @click="attempZoomVirtualRelation" icon="share-square" button-class="btn-light bg-whitesmoke text-primary" />
  <Prompt ref="prompt" />
</template>
<script>
import CircleIconButton from '@/components/CircleIconButton'
import Prompt from '@/components/Prompt'
export default {
  components: {
    CircleIconButton,
    Prompt
  },
  props: {
    relation: Object
  },
  methods: {
    attempZoomVirtualRelation(){
      console.log('attempting')
      this.$refs.prompt._open('Are you sure you want to open the linked relation?', [{
        label: 'Yes, open in new window',
        class: 'btn btn-info',
        callback: () => {
          console.log('this.baseURL', this.baseURL)
          window.open(this.baseURL('/branch/' + this.relation['id'] + '/t/' + this.toKebabCase(this.statementText.slice(0, 30))))
        }
      }, {
        label: 'No'
      }])
    }
  },
  computed: {
    statementText(){
      // if(typeof this.relation === 'undefined'){
      //   return ''
      // }else if(this.relation['statement']){
      //   return this.relation['statement']['text']
      // }else if(this.relation['virtual_relation'] && typeof this.relation['virtual_relation']['statement'] !== 'undefined'){
      //   return this.relation['virtual_relation']['statement']['text']
      // }else{
      //   console.log('relation', this.relation['virtual_relation'])
      //   return ''
      // }
      return this.relation && this.relation['statement'] && typeof this.relation['statement'] !== 'undefined' ? this.relation['statement']['text'] : 'ERROR: Statement text not found. #'
    }
  }
}
</script>