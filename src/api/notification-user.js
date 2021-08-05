
import { ref } from 'vue'
import API from '@/core/api'
import Auth from '@/core/auth'
class NotificationUser extends API {
  apiName = 'notification-user'
  notificationUsers = ref([])
  lastDatetimeChecked = null
  refreshSetTimeoutId = null
  checkNotification(){
    clearTimeout(this.refreshSetTimeoutId)
    const refreshTime = 17000 //check notification every 17 seconds
    if(Auth.user().value){
      this.retrieveNotification().finally(() => {
        this.refreshSetTimeoutId = setTimeout(() => {
          this.checkNotification()
        }, refreshTime)
      })
    }else{
      this.refreshSetTimeoutId = setTimeout(() => {
        this.checkNotification()
      }, refreshTime)
    }
  }
  retrieveNotification(){
    let userAuth = Auth.user().value
    let userTemplate = {
      select: {
        ...(['id', 'username']),
        user_basic_information: {
          select: ['user_id', 'first_name', 'last_name']
        },
        user_profile_photo: {
          select: ['user_id', 'file_name']
        }
      }
    }
    let param = {
      select: {
        ...(['notification_id', 'user_id', 'status', 'created_at']),
        notification: {
          select: {
            ...(['id', 'type']),
            notification_relation_update: {
              select: {
                ...(['id', 'notification_id', 'relation_id', 'user_id', 'message', 'type']),
                relation: {
                  select: {
                    ...(['statement_id', 'virtual_relation_id']),
                    statement: {
                      select: ['text'],
                      with_trash: true
                    },
                    virtual_relation: {
                      select: {
                        ...(['id', 'statement_id']),
                        statement: {
                          select: ['text'],
                          with_trash: true
                        }
                      }
                    }
                  },
                  with_trash: true
                },
                user: userTemplate
              }
            },
            notification_sub_relation_update: {
              select: {
                ...(['id', 'sub_relation_id', 'notification_id', 'user_id', 'message']),
                sub_relation: {
                  select: {
                    ...(['statement_id']),
                    statement: {
                      select: ['text'],
                      with_trash: true
                    }
                  },
                  with_trash: true
                },
                notification_sub_relation_update_user_relations:{
                  select: {
                    ...(['notification_sub_relation_update_id', 'user_id', 'relation_id']),
                    relation: {
                      select: {
                        ...(['statement_id']),
                        statement: {
                          select: ['text'],
                          with_trash: true
                        }
                      }
                    }
                  },
                  condition: [{
                    column: 'user_id',
                    value: userAuth['id']
                  }]
                },
                user: userTemplate
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
                user: userTemplate
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
