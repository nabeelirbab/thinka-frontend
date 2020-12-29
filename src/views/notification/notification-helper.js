import NotificationUserAPI from '@/api/notification-user'
import QuickHelper from '@/helpers/quick-helper'
export default {
  readNotification: (notificationUserId) => {
    const param = {
      id_list: typeof notificationUserId === 'object' ? notificationUserId : [notificationUserId],
      status: 2
    }
    const notificationUserIndex = QuickHelper.methods.findArrayIndex(notificationUserId, NotificationUserAPI.notificationUsers.value, 'id')
    if(notificationUserIndex !== -1){
      NotificationUserAPI.notificationUsers.value[notificationUserIndex]['status'] = 2
    }
    return NotificationUserAPI.post('/change-status', param)
  }
}