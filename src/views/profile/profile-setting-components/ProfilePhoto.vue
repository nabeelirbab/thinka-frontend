<template>
  <div class="text-center">
    <div >
      <img :src="currentProfilePhoto" class="border rounded p-2 mb-2" style="width: 200px; height: 200px" />
    </div>
    <button @click="uploadPhoto" class="btn btn-sm btn-info">Change Photo</button>
    <input ref="fileInput" @change="fileInputChanged" type="file" accept=".png, .jpg, .jpeg" style="display:none" />
    <ProfilePhotoResizer
      ref="resizer"
      @save="profilePhotoChanged"
    />
  </div>
</template>
<script>
import ProfilePhotoResizer from './ProfilePhotoResizer'
import globals from './profile-photo-globals'
import FileServerHelper from '@/helpers/file-server'
import UserAuth from '@/core/auth'
export default {
  components: {
    ProfilePhotoResizer
  },
  mounted(){
    let superThis = this
    this.imageReader.onload = function(){
      superThis.imageNaturalDimension.width = this.naturalWidth
      superThis.imageNaturalDimension.height = this.naturalHeight
      superThis.openResizer()
      superThis.imageSource = superThis.imageReader.src
    }
    this.fileInputElement = this.$refs.fileInput
    this.profilePhoto = this.user['user_profile_photo']
  },
  data(){
    return {
      ...globals,
      profilePhoto: null,
      noProfilePhoto: require('@/assets/images/profile-photo.png'),
      imageReader: new Image(),
      user: UserAuth.user()
    }
  },
  methods: {
    uploadPhoto(){
      this.$refs.fileInput.value = ''
      this.$refs.fileInput.click()
    },
    openResizer(){
      this.$refs.resizer._open()
    },
    fileInputChanged(inputEvent){
      let input = inputEvent.target
      if (input.files && input.files[0]) {
        let reader = new FileReader()
        reader.onload = (e) => {
          this.imageReader.src = e.target.result
          this.hasFile = true
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    profilePhotoChanged(filename){
      this.profilePhoto = filename
      this.user['user_profile_photo'] = filename
    }
  },
  computed: {
    currentProfilePhoto(){
      console.log(FileServerHelper.url(this.profilePhoto))
      return this.profilePhoto ? FileServerHelper.url(this.profilePhoto) : this.noProfilePhoto
    }
  }
}
</script>