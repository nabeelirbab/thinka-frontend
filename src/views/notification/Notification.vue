<template>
  <div class="container">
    <div class="mt-4 shadow-sm rounded bg-white">
      <div class="border-bottom px-3 py-3 d-flex align-items-center">
        <h6 class="text-primary mb-0 flex-fill text-uppercase d-flex align-items-center">
          <fa icon="bell" class="mr-2 text-lg" /> You have {{notifications.length ? notifications.length : 'no'}} notifications.
        </h6>
      </div>
      <div>
        <template v-for="notification in notifications">
          <div :class="notification['status'] * 1 === 2 ? 'bg-whitesmoke' : ''" class="border-bottom p-3 d-flex">
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
    console.log('mounted')
    if(this.notifications.length === 0){
      NotificationUserAPI.checkNotification()
    }
    // setInterval(() => {
    //   this.setStatusToNotified()
    // }, 2000)
  },
  data(){
    return {
      notifications: NotificationUserAPI.notificationUsers
    }
  },
  methods: {
    setStatusToNotified(){
      const param = {
        id_list: this.toSeenNotification,
        status: 1
      }
      NotificationUserAPI.post('/change-status', param)
    }
  },
  watch: {
    toSeenNotification: {
      handler(toSeenNotification){
        if(toSeenNotification.length){
          this.setStatusToNotified()
        }
        console.log('watching', toSeenNotification)
      },
      immediate: true
    }
  },
  computed: {
    toSeenNotification(){
      let idList = []
      console.log('notifications', this.notifications)
      this.notifications.forEach(notification => {
        if(notification['status'] * 1 === 0){
          idList.push(notification['id'])
          notification['status'] = 1
        }
      })
      return idList
    }
  }
}
</script>
