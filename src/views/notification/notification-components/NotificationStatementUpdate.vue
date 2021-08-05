<template>
  <div class="w-100">
    <NotificationHead
      :username="notificationStatementUpdate['user']['username']"
      :userProfilePhoto="notificationStatementUpdate['user']['user_profile_photo']"
      :created-at="datetime"
    />
    <div style="min-width:0">
      <div v-if="notificationStatementUpdate['statement']" class="d-flex">
        <fa icon="quote-left" class="text-secondary text-sm mr-1" />
        <div class="font-italic text-truncate px-1" style="min-width:0">
          {{notificationStatementUpdate['statement']['text']}}
        </div>
        <fa icon="quote-right" class="text-secondary text-sm ml-1" />
      </div>
      <div class="text-break bg-light p-1 rounded text-sm px-3 d-flex align-items-center">
        {{notificationStatementUpdate['message']}}
      </div>
    </div>
  </div>
</template>
<script>
import NotificationHead from './NotificationHead'
export default {
  components: {
    NotificationHead
  },
  props: {
    notificationStatementUpdate: {
      type: Object,
      required: true
    },
    datetime: String
  }
}
</script>
<style>

</style>
