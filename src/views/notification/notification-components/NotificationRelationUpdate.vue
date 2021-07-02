<template>
  <div class="w-100">
    <NotificationHead
      :username="notificationRelationUpdate['user']['username']"
      :created-at="datetime"
    />
    <div style="min-width:0">
      <div v-if="notificationRelationUpdate['relation']" class="d-flex">
        <fa icon="quote-left" class="text-secondary text-sm" />
        <div @click="readNotification" class="font-italic text-truncate c-pointer -1" style="min-width:0">
          {{statementText}}
        </div>
        <fa icon="quote-right" class="text-secondary text-sm ml-1" />
      </div>
      <div  class="text-break bg-light p-1 rounded text-sm px-3 d-flex align-items-center ">
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
import NotificationHead from './NotificationHead'
import NotificationHelper from '../notification-helper'
import OpinionHelper from '@/helpers/opinion'
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
          console.log('message', message)
          return OpinionHelper.convertToMessage(type, confidence)
        }
        default:
          return this.notificationRelationUpdate['message']
      }
    },
    statementText(){
      return this.notificationRelationUpdate['relation']['virtual_relation_id'] ? this.notificationRelationUpdate['relation']['virtual_relation']['statement']['text'] : this.notificationRelationUpdate['relation']['statement']['text']
    }
  }
}
</script>
