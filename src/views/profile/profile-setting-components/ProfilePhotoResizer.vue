<template>
  <div>
    <modal ref="modal" :closeable="false">
      <vue-cropper v-if="hasFile" :key="reRenderCounter"
        ref="cropper"
        :src="imageSource"
        alt="Source Image"
        :aspectRatio="1"
        :rotatable="false"
        :scalable="false"
        :zoomOnWheel="false"
        :movable="false"
        :zoomable="false"
        :minContainerWidth="imageElementDimension.width"
        :minContainerHeight="imageElementDimension.height"
        :minCropBoxWidth="50"
        :minCropBoxHeight="50"
      >
      </vue-cropper>
      <div class="mt-2 ">
        <div v-if="isLoading">
          Uploading <fa icon="spinner" spin />
        </div>
        <template v-else>
          <button @click="save" class="btn btn-success mr-1">Crop & Save Photo</button>
          <button @click="cancel" class="btn btn-outline-secondary">Cancel</button>
        </template>
      </div>
    </modal>
  </div>
</template>
<script>
import Modal from '@/components/bootstrap/Modal'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import globals from './profile-photo-globals'
import UserAPI from '@/api/user'
import API from '@/core/api'
export default {
  components: {
    Modal,
    VueCropper
  },
  mounted(){
    
    window.onresize = () => {
      this.init()
      this.resizeImage()
    }
  },
  data(){
    return {
      ...globals,
      isLoading: false,
      imageElementDimension: {
        width: 100,
        height: 100
      },
      maxViewerDimension: {
        width: null,
        height: null,
      },
      reRenderCounter: 0,
      api: new API()
    }
  },
  methods: {
    _open(){
      this.$refs.modal._open()
      setTimeout(() => {
        this.init()
        this.resizeImage()
      }, 400)
    },
    save(){
      this.isLoading = true
      this.$refs.cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      }).toBlob((blob) => {
        let param = {
          is_request: true,
          cropped_picture: {
            size: blob.size, // kb?
            type: 'png'
          }
        }
        if(this.fileInputElement.files.length){
          UserAPI.post('/change-profile-photo', param).then(response => {
            if(response['data']){
              this.uploadPhoto(response['data']['upload_ticket']['upload_location'], response['data']['upload_ticket']['upload_ticket_id'], blob)
            }else{
              this.isLoading = false
            }
          })
        }
      })
    },
    uploadPhoto(fileServerLocation, uploadTicketId, imageBlob){
      let form = new FormData()
      form.append('upload_ticket_id', uploadTicketId)
      form.append('files[]', imageBlob, 'cropped_image.png')
      this.api.fileUpload(fileServerLocation, form).then(response => {
        console.log('fileUploadResponse', response)
        if(response['data'].length){
          this.updateUserProfilePhoto(response['data'][0]['name'])
        }else{
          this.isLoading = false
        }
      })
    },
    updateUserProfilePhoto(profilePhotoFileName){
      UserAPI.post('/change-profile-photo', {file_name: profilePhotoFileName}).then(response => {
        console.log('updateUserProfilePhoto', response)
        if(response['data']){
          this.$emit('save', profilePhotoFileName)
          this.cancel()
        }
        this.isLoading = false
      })
    },
    cancel(){
      this.$refs.modal._close()
      this.imageSource = null
    },
    init(){
      // this.maxViewerDimension.height = $(this.$refs.modal).find('.modal-dialog').css('max-height').replace('px', '') * 1
      // this.maxViewerDimension.width = $(this.$refs.modal).find('.modal-dialog').css('max-width').replace('px', '') * 1
      // this.windowDimension.width = window.innerWidth
      // this.windowDimension.height = window.innerHeight
    },
    resizeImage(){
      this.isLoading = true
      let natWidth = this.imageNaturalDimension.width
      let natHeight = this.imageNaturalDimension.height
      if(natWidth < 230){ // set the min width
        natHeight = 230 * (natHeight / natWidth)
        natWidth = 230
      }
      this.imageElementDimension.width = natWidth
      this.imageElementDimension.height = natHeight

      if(natWidth > this.maxViewerDimension.width){
        this.imageElementDimension.height = (this.maxViewerDimension.width * (natHeight / natWidth))
        this.imageElementDimension.width = (this.maxViewerDimension.width)
      }
      if(this.imageElementDimension.height > this.maxViewerDimension.height){
        let ratio = (this.imageElementDimension.width / this.imageElementDimension.height)
        this.imageElementDimension.height = this.maxViewerDimension.height
        this.imageElementDimension.width = (this.maxViewerDimension.height * ratio)
      }

      this.reRenderCounter = this.reRenderCounter + 1
      this.isLoading = false
    }
  }
}
</script>