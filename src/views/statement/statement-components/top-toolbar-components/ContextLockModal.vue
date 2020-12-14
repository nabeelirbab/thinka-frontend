<template>
  <modal ref="modal" title="Context Lock" :closeable="!isLoading">
    <div>
      <div v-if="!selectedStatementData || (selectedStatementId * 1 === mainRelationData['id'])">
        <fa icon="exclamation-triangle" /> Please select the sub context you want to lock
      </div>
      <div v-else-if="userRelationContextLockId" class="text-center">
        <div>Do you want to remove the context locking?</div>
        <button v-if="!isLoading" @click="removeContextLock" class="btn btn-outline-danger">Remove Context Locking</button>
        <span v-else>Please wait... <fa icon="spinner" spin /></span>
      </div>
      <div v-else>
        <p>Locking the context means that the sub statement can only be viewed under the main statement (blue bubble)</p>
        <div class="text-center">
          <button v-if="!isLoading" @click="lockContext" class="btn btn-outline-primary">Lock the Selected Statement</button>
          <span v-else>Please wait... <fa icon="spinner" spin /></span>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
import GlobackData from '@/views/statement/global-data'
import UserRelationContextLockAPI from '@/api/user-relation-context-lock'
export default {
  components: {
    Modal
  },
  data(){
    return {
      ...GlobackData,
      userRelationContextLockId: null,
      userRelationContextLockIndex: null,
      isLoading: false
    }
  },
  methods: {
    _open(){
      this.userRelationContextLockId = null
      this.$refs.modal._open()
      if(this.selectedStatementData && this.selectedStatementData && this.selectedStatementData['user_relation_context_locks'].length){
        for(let x = 0; x < this.selectedStatementData['user_relation_context_locks'].length; x++){
          if(this.selectedStatementData['user_relation_context_locks'][x]['root_relation_id'] * 1 === this.mainRelationData['id'] * 1){
            this.userRelationContextLockId = this.selectedStatementData['user_relation_context_locks'][x]['id']
            this.userRelationContextLockIndex = x // used for delete
            break;
          }
        }
      }
    },
    lockContext(){
      this.isLoading = true
      const param = {
        relation_id: this.selectedStatementId,
        root_relation_id: this.mainRelationData['id'],

      }
      UserRelationContextLockAPI.create(param).then(result => {
        if(result['data']){
          this.userRelationContextLockId = result['data']['id']
          this.selectedStatementData['user_relation_context_locks'].push({
            id: result['data']['id'],
            relation_id: this.selectedStatementId,
            root_relation_id: this.mainRelationData['id']
          })
        }
        this.isLoading = false
      }).catch(error => {
        console.error(error)
        this.isLoading = false
      })
    },
    removeContextLock(){
      this.isLoading = true
      UserRelationContextLockAPI.delete({ id: this.userRelationContextLockId }).then(result => {
        console.log(result)
        this.userRelationContextLockId = null
        this.selectedStatementData['user_relation_context_locks'].splice(this.userRelationContextLockIndex, 1)
        this._open()
        this.isLoading = false
      })
    }
  }
}
</script>