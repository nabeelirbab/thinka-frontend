<template>
  <modal ref='modal' :closeable="false">
    <div class="text-left">
      <h5 class="mb-2">{{title}}</h5>
      <div v-html="message" class="mb-2"></div>
      <div v-if="actions" class="text-center">
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
    _open(message, actions = [], title = null){
      /**
       * Actions has the following field for each buttons:
       * label:string - label for the button. e.g. Proceed
       * class: string - class to be used for the button. e.g. btn btn-success
       * callback: function - function called after the button is pressed
       * close_on_click: function - close the modal when the action is clicked. Default: true
       */
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
      if(action === null){
        this.$refs.modal._close()
      }else if(action){
        if(typeof action['close_on_click'] === 'undefined' || action['close_on_click']){
          this.$refs.modal._close()
        }
        if(typeof action['callback'] === 'function'){
          action['callback']()
        }
      }
      
    }
  }
}
</script>