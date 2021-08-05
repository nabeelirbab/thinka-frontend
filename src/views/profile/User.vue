<template>
  <div class="container pt-3 mb-4">
    <div v-if="isLoading" class="text-center">Please wait <fa icon="spinner" spin /></div>
    <template v-else>
      <div class="bg-white shadow-md-light rounded p-2 d-flex align-items-center mb-2">
          <fa icon="user-circle" class="text-secondary mr-2" style="font-size:2em" />
          <div v-if="user">
            <span class="text-capitalize font-weight-bold mr-1"> {{user['user_basic_information']['first_name']}} {{user['user_basic_information']['last_name']}}</span>
            <small>( {{user['username']}} )</small>
          </div>
      </div>
      <div class="bg-white shadow-md-light rounded">
        <h6 class="text-primary mb-0 flex-fill text-uppercase d-flex align-items-center p-2 border-bottom border-width-6"> <fa icon="history" class="mr-2" /> Activity History </h6>
        <div v-if="!events.length" class="p-2">
          No public activity history
        </div>
        <template v-for="event in events">
          <div v-if="event['event_type'] === 'relation'">
            <RelationRow :relation="event['payload']" :no-user="true" />
          </div>
          <div v-else-if="event['event_type'] === 'opinion'">
            <OpinionEvent :opinion="event['payload']" />
          </div>
          <!-- <div >
          </div> -->
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import User from '@/api/user'
import RelationRow from '@/components/RelationRow'
import OpinionEvent from './user-components/OpinionEvent'
export default {
  components: {
    RelationRow,
    OpinionEvent
  },
  mounted(){
    this.getHistory()
  },
  data(){
    return {
      user: null,
      events: [],
      isLoading: false
    }
  },
  methods: {
    getHistory(){
      if(this.user === null){
        this.isLoading = true
      }
      User.post('/activity-history', {user_id: this.userId}).then(result => {
        console.log('result', result['data'])
        if(result['data']){
          this.events = result['data']['events']
          this.user = result['data']['user']
        }
        console.log('events', this.events)
        this.isLoading = false
      })
    }
  },
  computed: {
    userId(){
      return this.$route.params.userId * 1
    },
  }
}
</script>