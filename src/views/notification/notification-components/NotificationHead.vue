<template>
  <div>
    <div class="d-flex align-items-center text-light mb-1">
      <div class='pr-1'>
        <img v-if="profilePhoto" :src="profilePhoto" class="rounded-circle" style="width: 40px;" />
        <fa v-else icon="user-circle" class="text-light" style="font-size:40px" />
      </div>
      <span class="font-weight-bold flex-fill">{{toPascal(username)}}</span>
      <!-- <small class="float-right">{{formatDate(datetime)}}</small> -->
      <small class="float-right">{{timeSince(createdAt + ' UTC', 259200000)}}</small>
    </div>
  </div>
</template>
<script>
import FileServerHelper from '@/helpers/file-server'
export default {
  props: {
    username: {
      type: String,
      required: true
    },
    userProfilePhoto: Object,
    createdAt: {
      type: String,
      required: true
    }
  },
  computed: {
    profilePhoto(){
      return (typeof this.userProfilePhoto !== 'undefined' && this.userProfilePhoto) ? FileServerHelper.url(this.userProfilePhoto['file_name']) : null
    }
  }
}
</script>