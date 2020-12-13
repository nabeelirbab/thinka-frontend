<template>
  <modal ref="modal" title="Context Lock" :closeable="!isLoading">
    <div>
      <div v-if="!selectedStatementData || (selectedStatementId * 1 === mainRelationData['id'])">
        <fa icon="exclamation-triangle" /> Please select the sub context you want to lock
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
// import UserRelationSettingAPI from '@/api/user-relation-setting'
export default {
  components: {
    Modal
  },
  data(){
    return {
      ...GlobackData,
      isLoading: false
    }
  },
  methods: {
    _open(){
      this.$refs.modal._open()
    },
    lockContext(){
      // UserRelationSettingAPI.
    }
  }
}
</script>