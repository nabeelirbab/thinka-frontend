<template>
  <div class="w-100">
    <NotificationHead
      :username="notificationRelationUpdate['user']['username']"
      :userProfilePhoto="notificationRelationUpdate['user']['user_profile_photo']"
      :created-at="datetime"
    />
    <div style="min-width:0">
      <div v-if="notificationRelationUpdate['sub_relation']" class="d-flex">
        <fa icon="quote-left" class="text-secondary text-sm mr-1" />
        <div @click="readNotification" class="font-italic text-truncate c-pointer px-1" style="min-width:0">
          {{notificationRelationUpdate['sub_relation']['statement'] ? notificationRelationUpdate['sub_relation']['statement']['text'] : 'Error: No Text'}}
        </div>
        <fa icon="quote-right" class="text-secondary text-sm ml-1" />
      </div>
      <div class="text-break">
        {{notificationRelationUpdate['message']}}
      </div>
      <!-- <div v-for="notificationSubRelationUpdateUserRelation in notificationRelationUpdate['notification_sub_relation_update_user_relations']" class="text-truncate text-sm pl-1">
        <fa icon="level-up-alt" rotation="90" /> {{notificationSubRelationUpdateUserRelation['relation']['statement'] ? notificationSubRelationUpdateUserRelation['relation']['statement']['text'] : 'No Statement'}}
      </div> -->
    </div>
  </div>
</template>
<script>
import NotificationHead from './NotificationHead'
import NotificationHelper from '../notification-helper'
export default {
  components: {
    NotificationHead
  },
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