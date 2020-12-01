<template>
  <div>
    <div ref="modal" class="modal fade" tabindex="-1" role="dialog" :data-keyboard="closeable"  :data-backdrop="!closeable ? 'static' : true" aria-hidden="true" >
      <div v-bind:class="'modal-' + size" class="modal-dialog" role="document" :style="paddingTop ? {'padding-top': paddingTop} : {}">
        <div class="modal-content">
          <div v-if="title" class="modal-header">
            <template v-if="newLayout">-
              <div class="card-header py-1 px-2 bg-whitesmoke border-0 rounded w-100 d-flex align-items-stretch">
                <div class="w-90">
                  <span class="font-weight-bold"><fa v-if="icon" :icon="icon" />{{title}}</span>
                </div>
                <div class="w-10">
                  <button v-if="closeable" class="btn btn-sm text-secondary float-right py-0" data-dismiss="modal" aria-label="Close">
                    <fa icon="times"/>
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <h5 class="modal-title"><fa v-if="icon" :color="iconColor" :icon="icon" /> {{title}} </h5>
              <button v-if="closeable" type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </template>
          </div>
          <div  class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const $ = require('jquery')
// window.jQuery = window.$
export default {
  props: {
    iconColor: String,
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md'
    },
    closeable: {
      type: Boolean,
      default: true
    },
    bgTransparent: {
      type: Boolean,
      default: false
    },
    newLayout: {
      type: Boolean,
      default: false
    },
    paddingTop: String
  },
  mounted(){
    this._close()
  },
  methods: {
    _open(){
      let modalElement = $(this.$refs.modal)
      if(this.closeable){
        modalElement.modal('show')
      }else{
        modalElement.modal({ backdrop: 'static', keyboard: false })
      }
      if(this.bgTransparent){
        $(modalElement.data('bs.modal')._backdrop).css('background-color', 'transparent')
      }
    },
    _close(){
      $(this.$refs.modal).modal('hide')
      if(($(this.$refs.modal).data('bs.modal') || {})._isShown){
        setTimeout(() => {
          this._close()
        }, 200)
      }
      return true
    }
  }
}
</script>
<style scoped>
/* .modal-backdrop {
   background-color: transparent;
} */
.w-90 {
  width: 90%;
}
.w-10 {
  width: 10%;
}
</style>
