
import { ref } from 'vue'
import API from '@/core/api'
import Auth from '@/core/auth'
class NotificationUser extends API {
  apiName = 'notification-user'
  notificationUsers = ref([])
  lastDatetimeChecked = null
  checkNotication(){
    const refreshTime = 17000 //check notification every 17 seconds
    if(Auth.user){
      this.retrieveNotification().finally(() => {
        setTimeout(() => {
          this.checkNotication()
        }, refreshTime)
      })
    }else{
      setTimeout(() => {
        this.checkNotication()
      }, refreshTime)
    }
  }
  retrieveNotification(){
    let param = {
      select: {
        ...(['notification_id', 'user_id', 'status', 'created_at']),
        notification: {
          select: {
            ...(['id', 'type']),
            notification_relation_update: {
              select: {
                ...(['id', 'notification_id', 'relation_id', 'user_id', 'message']),
                relation: {
                  select: {
                    ...(['statement_id']),
                    statement: {
                      select: ['text'],
                      with_trash: true
                    }
                  },
                  with_trash: true
                },
                user: {
                  select: {
                    ...(['id']),
                    user_basic_information: {
                      select: ['user_id', 'first_name', 'last_name']
                    }
                  }
                }
              }
            },
            notification_statement_update: {
              select: {
                ...(['id', 'notification_id', 'statement_id', 'relation_id', 'user_id', 'message']),
                relation: {
                  select: {
                    ...(['id']),
                    
                  },
                  with_trash: true
                },
                statement: {
                  select: ['statement_id', 'text'],
                  with_trash: true
                },
                user: {
                  select: {
                    ...(['id']),
                    user_basic_information: {
                      select: ['user_id', 'first_name', 'last_name']
                    }
                  }
                }
              }
            }
          }
        }
      },
      sort: [{
        column: 'created_at',
        order: 'desc'
      }],
      condition: []
    }
    if(this.lastDatetimeChecked){
      param['condition'].push({
        column: 'created_at',
        clause: '>',
        value: this.lastDatetimeChecked
      })
    }else{
      param['limit'] = 30
    }
    return this.retrieve(param).then(result => {
      if(result['data'] && result['data'].length){
        this.notificationUsers.value = result['data'].concat(this.notificationUsers.value)
        this.lastDatetimeChecked = result['data'][0]['created_at']
      }
    })
  }
}
export default new NotificationUser()
