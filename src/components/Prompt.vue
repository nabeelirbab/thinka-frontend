<template>
  <modal ref='modal' :closeable="false">
    <div class="text-left">
      <h5 class="mb-3">{{title}}</h5>
      <div v-html="message" class="mb-2"></div>
      <div class="text-center">
        <template v-if="!actions.length">
          <button @click="actionChoosen(null)" class="btn btn-outline-dark mx-1">Okay</button>
        </template>
        <template v-for="(action, index) in actions" :key="'asd' + index">
          <button @click="actionChoosen(action)" :class="typeof action['class'] !== 'undefined' ? action['class'] : 'btn-outline-dark'" class="btn mx-1">{{action['label']}}</button>
        </template>
      </div>
    </div>
  </modal>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
export default {
  components: {
    Modal,
  },
  props: {
  },
  data(){
    return {
      title: null,
      message: '',
      actions: [],
    }
  },
  methods: {
    _open(message, actions, title = null){
      this.message = message
      this.title = title
      this.actions = actions
      this.$refs.modal._open()
    },
    logInSuccess(){
      if(this.refreshOnLogIn){
        location.reload()
      }
    },
    actionChoosen(action){
      this.$refs.modal._close()
      if(action && typeof action['callback'] === 'function'){
        action['callback']()
      }
    }
  }
}
</script>