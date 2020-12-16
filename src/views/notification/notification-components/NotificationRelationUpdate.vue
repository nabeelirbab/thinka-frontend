<template>
  <div  class="d-flex">
    <div class='pr-1'>
      <fa icon="user-circle" class="text-secondary" style="font-size:2em" />
    </div>
    <div style="min-width:0">
      <div >
        <span class="font-weight-bold">{{toPascal(notificationRelationUpdate['user']['user_basic_information']['first_name'])}} {{toPascal(notificationRelationUpdate['user']['user_basic_information']['last_name'])}}</span>
        <small class="float-right">{{formatDate(datetime)}}</small>
      </div>
      <div v-if="notificationRelationUpdate['relation']" class="d-flex">
        <fa icon="quote-left" class="text-secondary text-sm mr-1" />
        <div class="font-italic text-truncate" style="min-width:0">
          <router-link :to="'/branch/' + notificationRelationUpdate['relation_id']" class="c-pointer text-dark">
            {{notificationRelationUpdate['relation']['statement']['text']}}
          </router-link>
        </div>
        <fa icon="quote-right" class="text-secondary text-sm ml-1" />
      </div>
      <div class="text-break">
        {{notificationRelationUpdate['message']}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    notificationRelationUpdate: {
      type: Object,
      required: true
    },
    datetime: String
  }
}
</script>