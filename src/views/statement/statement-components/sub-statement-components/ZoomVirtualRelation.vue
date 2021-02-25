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
      this.$router.push('/branch/' + this.relation['virtual_relation_id'] + '/t/' + this.toKebabCase(this.statementText.slice(0, 30)))
      // this.$refs.prompt._open('Are you sure you want to open the linked relation?', [{
      //   label: 'Open',
      //   class: 'btn btn-info',
      //   callback: () => {
      //     console.log('this.baseURL', this.baseURL)
      //     this.$route.push('/branch/' + this.relation['virtual_relation_id'] + '/t/' + this.toKebabCase(this.statementText.slice(0, 30)))
      //   }
      // }, {
      //   label: 'Open in new window',
      //   class: 'btn btn-outline-info',
      //   callback: () => {
      //     console.log('this.baseURL', this.baseURL)
      //     window.open(this.baseURL('/branch/' + this.relation['virtual_relation_id'] + '/t/' + this.toKebabCase(this.statementText.slice(0, 30))))
      //   }
      // }, {
      //   class: 'btn btn-outline-secondary',
      //   label: 'No'
      // }])
    }
  },
  computed: {
    statementText(){
      return this.relation && this.relation['virtual_relation'] && typeof this.relation['virtual_relation']['statement'] !== 'undefined' ? this.relation['virtual_relation']['statement']['text'] : 'ERROR: Statement text not found. #'
    }
  }
}
</script>