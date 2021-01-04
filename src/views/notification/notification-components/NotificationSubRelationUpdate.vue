<template>
  <div  class="d-flex">
    <div class='pr-1'>
      <fa icon="user-circle" class="text-secondary" style="font-size:2em" />
    </div>
    <div class="flex-fill" style="min-width:0">
      
      <div class="d-flex">
        <div class="font-weight-bold flex-fill">{{notificationRelationUpdate['user']['username']}}</div>
        <div class="float-right">{{formatDate(datetime)}}</div>
      </div>
      <div v-if="notificationRelationUpdate['sub_relation']" class="d-flex">
        <fa icon="quote-left" class="text-secondary text-sm mr-1" />
        <div @click="readNotification" class="font-italic text-truncate c-pointer" style="min-width:0">
          {{notificationRelationUpdate['sub_relation']['statement']['text']}}
        </div>
        <fa icon="quote-right" class="text-secondary text-sm ml-1" />
      </div>
      <div class="text-break">
        {{notificationRelationUpdate['message']}}
      </div>
      <div v-for="notificationSubRelationUpdateUserRelation in notificationRelationUpdate['notification_sub_relation_update_user_relations']" class="text-truncate text-sm pl-1">
        <fa icon="level-up-alt" rotation="90" /> {{notificationSubRelationUpdateUserRelation['relation']['statement']['text']}}
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
        this.$router.push('/branch/' + this.notificationRelationUpdate['sub_relation_id'] + '/t/' + this.toKebabCase((this.notificationRelationUpdate['sub_relation']['statement']['text']).slice(0, 30)))
      })
    }
  }
}
</script>