<template>
  <modal ref="modal" v-if="selectedStatementData && user" :closeable="isLoading">
    <template v-if="user['id'] === selectedStatementData['user_id']">
      <h5><fa icon="exclamation-triangle" /> You are about to delete this statement</h5>
      <p>You can never access this statement relation once deleted.</p>
      <div class="text-center border border-warning rounded p-2 mb-2">
        <div><button @click="deleteStatement('partial')" :disabled="isLoading" class="btn btn-warning">Partial Delete</button> <br/> <small>Keep the statements below and make them into root statements</small></div>
        <div><button @click="deleteStatement('all')" :disabled="isLoading" class="btn btn-danger">Delete All</button> <br/><small>This statement and below will be deleted</small></div>
      </div>
      <div v-if="!isLoading" @click="close" class="text-center"><button class="btn btn-outline-dark">I changed my mind</button> </div>
    </template>
    <template v-else >
      <h5>You are not allowed</h5>
      <p>You need to be the author of this statement to delete it</p>
      <div class="text-center">
        <button v-if="!isLoading" @click="close" class="btn btn-outline-dark">Okay</button>
      </div>
    </template>
    <div v-if="isDeleted" class="text-center text-success">
      <fa icon="check"/> Statement Successfully Deleted
      <div>
       <router-link v-if="isDeleted === 'go_to_parent'" @click="close" :to="'/branch/' + mainRelationData['parent_relation_id']" class="btn btn-outline-dark"><fa icon="undo-alt"/> Go to Parent Statement</router-link>
       <router-link v-if="isDeleted === 'go_to_search'" @click="close" to="/search" class="btn btn-outline-dark">Okay</router-link>
      </div>
    </div>
    <div v-else-if="isLoading" class="text-center">Please wait... <fa icon="spinner" spin /></div>
  </modal>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
import Auth from '@/core/auth'
import GlobalData from '../../global-data'
import RelationAPI from '@/api/relation'
export default {
  components: {
    Modal
  },
  data(){
    return {
      isLoading: false,
      user: Auth.user(),
      ...GlobalData,
      isDeleted: false
    }
  },
  methods: {
    _open(){
      this.isLoading = false
      this.isDeleted = false
      this.$refs.modal._open()
    },
    close(){
      this.$refs.modal._close()
    },
    deleteStatement(type){
      this.isLoading = true
      RelationAPI.post('/delete-' + type, {id: this.selectedStatementId}).then(result => {
        if(result['data']){
          if(this.mainRelationData['id'] * 1 === this.selectedStatementId * 1){ // main statement is being deleted
            if(this.mainRelationData['parent_relation_id']){ // if main statement has parent statement
              this.isDeleted = 'go_to_parent'
            }else{
              this.isDeleted = 'go_to_search'
            }
          }else{
            this.deletedRelationId = this.selectedStatementId
            setTimeout(() => {
              this.$refs.modal._close()
            }, 700)
          }
        }
      }).catch(error => {
        this.isLoading = false
        console.error(error)
      })
    },
  }
}
</script>