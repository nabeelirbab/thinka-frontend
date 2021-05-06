<template>
  <button v-if="hasButton" @click="_open" class="btn btn-primary">Log In</button>
  <modal ref='modal' title="Log In">
    <div class="text-left">
      <div v-if="message" class="mb-3"><fa icon="info-circle" class="text-info" /> {{message}}</div>
      <LogInForm @login="logInSuccess" @go-to-registration="close" />
    </div>
  </modal>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
import LogInForm from './LogInForm'
export default {
  components: {
    Modal,
    LogInForm
  },
  props: {
    refreshOnLogIn: {
      type: Boolean,
      default: true
    },
    hasButton: {
      type: Boolean,
      default: false
    },
    message: String
  },
  data(){
    return {
      logInSuccessCallback: null
    }
  },
  methods: {
    _open(callback = null){
      this.$refs.modal._open()
      this.logInSuccessCallback = callback
    },
    close(){
      this.$refs.modal._close()
    },
    logInSuccess(){
      if(this.refreshOnLogIn && typeof this.logInSuccessCallback !== 'function'){
        location.reload()
      }else{
        this.$refs.modal._close()
        this.logInSuccessCallback()
      }
    }
  }
}
</script>