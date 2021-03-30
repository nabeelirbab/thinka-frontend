<template>
  <div>
    <div class="d-flex text-light">
      <div class='pr-1'>
        <fa icon="user-circle" class="text-light" style="font-size:40px" />
      </div>
      <span class="font-weight-bold flex-fill">{{toPascal(username)}}</span>
      <!-- <small class="float-right">{{formatDate(datetime)}}</small> -->
      <small class="float-right">{{timeSince(createdAt + ' UTC', 259200000)}}</small>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    }
  }
}
</script>