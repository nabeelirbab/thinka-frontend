<template>
  <div class="container">
    <small class="float-right">{{timeSince(datetime)}}</small>
    <div style="min-width:0">
      <div class="d-flex">
        <div class='pr-1'>
          <fa icon="user-circle" class="text-secondary" style="font-size:2em" />
        </div>
        <span class="font-weight-bold">{{toPascal(notificationRelationUpdate['user']['username'])}}</span>
        <small class="float-right">{{formatDate(datetime)}}</small>
      </div>
      <div v-if="notificationRelationUpdate['relation']" class="d-flex">
        <fa icon="quote-left" class="text-secondary text-sm mr-1" />
        <div @click="readNotification" class="font-italic text-truncate c-pointer" style="min-width:0">
          {{notificationRelationUpdate['relation']['statement']['text']}}
        </div>
        <fa icon="quote-right" class="text-secondary text-sm ml-1" />
      </div>
      <div class="text-break">
        {{notificationRelationUpdate['message']}}
      </div>
    </div>
  </div>
</template>
<script>
import NotificationHelper from '../notification-helper'
export default {
  props: {
    notificationUserId: Number,
    notificationRelationUpdate: {
      type: Object,
      required: true
    },
    datetime: String
  },
  methods: {
    readNotification(){
      NotificationHelper.readNotification(this.notificationUserId).then(() => {
        this.$router.push('/branch/' + this.notificationRelationUpdate['relation_id'] + '/t/' + this.toKebabCase((this.notificationRelationUpdate['relation']['statement']['text']).slice(0, 30)))
      })
    }
  }
}
</script>
