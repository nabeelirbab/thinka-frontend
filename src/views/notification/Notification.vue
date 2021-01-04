<template>
  <div class="container pt-4 bg-white height-max">
    <h5>You have {{notifications.length ? notifications.length : 'no'}} notification</h5>
    <div>
      <template v-for="notification in notifications" :key="'notif' + notification['id']">
        <div :class="notification['status'] * 1 === 2 ? 'bg-whitesmoke' : ''" class="border shadow-sm mb-2 rounded p-2">
          <NotificationRelationUpdate
            v-if="notification['notification']['type'] * 1=== 2"
            :notification-user-id="notification['id']"
            :datetime="notification['created_at']"
            :notification-relation-update="notification['notification']['notification_relation_update']"
          />
          <NotificationStatementUpdate
            v-if="notification['notification']['type'] * 1=== 3"
            :datetime="notification['created_at']"
            :notification-statement-update="notification['notification']['notification_statement_update']"
          />
          <NotificationSubRelationUpdate
            v-if="notification['notification']['type'] * 1 === 4"
            :notification-user-id="notification['id']"
            :datetime="notification['created_at']"
            :notification-relation-update="notification['notification']['notification_sub_relation_update']"
          />
        </div>
      </template>

    </div>
  </div>
</template>
<script>
import NotificationUserAPI from '@/api/notification-user'
import NotificationRelationUpdate from './notification-components/NotificationRelationUpdate'
import NotificationSubRelationUpdate from './notification-components/NotificationSubRelationUpdate'
import NotificationStatementUpdate from './notification-components/NotificationStatementUpdate'
export default {
  components: {
    NotificationRelationUpdate,
    NotificationStatementUpdate,
    NotificationSubRelationUpdate
  },
  mounted(){
    if(this.notifications.length === 0){
      NotificationUserAPI.checkNotification()
    }else{
      setTimeout(() => {
        this.setStatusToNotified()
      }, 2000)
    }
  },
  data(){
    return {
      notifications: NotificationUserAPI.notificationUsers
    }
  },
  methods: {
    setStatusToNotified(){
      let idList = []
      this.notifications.forEach(notification => {
        if(notification['status'] * 1 === 0){
          idList.push(notification['id'])
          notification['status'] = 1
        }
      })
      const param = {
        id_list: idList,
        status: 1
      }
      NotificationUserAPI.post('/change-status', param)
    }
  }
}
</script>