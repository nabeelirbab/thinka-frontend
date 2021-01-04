<template>
  <div  class="d-flex">
    <div class='pr-1'>
      <fa icon="user-circle" class="text-secondary" style="font-size:2em" />
    </div>
    <div style="min-width:0">
      <div >
        <span class="font-weight-bold">{{toPascal(notificationStatementUpdate['user']['username'])}}</span>
        <small class="float-right">{{formatDate(datetime)}}</small>
      </div>
      <div v-if="notificationStatementUpdate['statement']" class="d-flex">
        <fa icon="quote-left" class="text-secondary text-sm mr-1" />
        <div class="font-italic text-truncate" style="min-width:0">
          {{notificationStatementUpdate['statement']['text']}}
        </div>
        <fa icon="quote-right" class="text-secondary text-sm ml-1" />
      </div>
      <div class="text-break">
        {{notificationStatementUpdate['message']}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    notificationStatementUpdate: {
      type: Object,
      required: true
    },
    datetime: String
  }
}
</script>