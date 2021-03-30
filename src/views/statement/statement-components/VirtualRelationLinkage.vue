<template>
  <modal ref="modal" @close="close" title="Linkages">
    <div v-if="isLoading" class="text-center">
      Please wait... <fa icon="spinner" spin />
    </div>
    <div v-else-if="relations.length === 0" class="text-center">
      No linkages found on this linked statement aside from this statement
    </div>
    <div v-else>
      This relation has been used by the statements below:
      <template v-for="relation in relations">
        <RelationRow @link-clicked="linkClicked" :relation="relation['parent_relation']" />
      </template>
    </div>
  </modal>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
import RelationRow from '@/components/RelationRow'
import GlobalData from '../global-data'
import RelationAPI from '@/api/relation'
export default {
  components: {
    Modal,
    RelationRow
  },
  mounted(){
  },
  data(){
    return {
      ...GlobalData,
      relations: [],
      isLoading: false
    }
  },
  methods: {
    open(){
      this.relations = []
      this.$refs.modal._open()
      this.isLoading = true
      const param = {
        select: {
          root_parent_relation: {
            select: {
              ...(['id', 'logic_tree_id', 'statement_id'])
            }
          },
          parent_relation: {
            select: {
              statement: {
                select: ['text', 'statement_type_id']
              },
              user: {
                select: {
                ...(['id', 'username'])
                }
              },
              ...(['id', 'user_id', 'logic_tree_id', 'statement_id', 'created_at', 'updated_at', 'published_at'])
            }
          },
          ...(['id', 'parent_relation_id', 'virtual_relation_id', 'statement_id', 'user_id', 'created_at', 'updated_at', 'published_at'])
        },
        sort: [{
          column: 'updated_at',
          order: 'desc'
        }],
        condition: [{
          column: 'virtual_relation_id',
          value: this.selectedStatementData['virtual_relation']['id']
        }, {
          column: 'id',
          clause: '!=',
          value: this.selectedStatementData['id']
        }],
        limit: 10
      }
      RelationAPI.retrieve(param).then(result => {
        console.log(result['data'])
        if(result['data']){
          this.relations = result['data']
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    linkClicked(){
      this.$refs.modal._close()
    },
    close(){ // modal is close event
      console.log('closed')
      this.showVirtualRelationLinkages = false
    }
  },
  watch: {
    showVirtualRelationLinkages: {
      handler(showVirtualRelationLinkages){
        if(showVirtualRelationLinkages){
          this.open()
        }
      },
      immediate: true
    }
  }
}
</script>