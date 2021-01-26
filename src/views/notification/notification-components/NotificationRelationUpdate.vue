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
      <div  class="text-break">
        <template v-if="notificationRelationUpdate['type'] === 2">
          <div v-html="parsedNotificationMessage"></div>
        </template>
        <span v-else>
          {{notificationRelationUpdate['message']}}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import NotificationHelper from '../notification-helper'
import OpinionHelper from '@/helpers/opinion'
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
  },
  computed: {
    parsedNotificationMessage(){
      if(typeof this.notificationRelationUpdate['type'] === 'undefined'){
        return ''
      }
      switch(this.notificationRelationUpdate['type'] * 1){
        case 2: { // opinion
          const message = JSON.parse(this.notificationRelationUpdate['message'])
          const type = typeof message['type'] !== 'undefined' ? message['type'] : -1
          const confidence = typeof message['confidence'] !== 'undefined' ? message['confidence'] : 0
          return OpinionHelper.convertToMessage(type, confidence)
        }
        default:
          return this.notificationRelationUpdate['message']
      }
    }
  }
}
</script>
