<template>
  <div class="p-3 border-bottom border-width-6">
    <div class="mb-2 d-flex">
      <div class="flex-fill">
        <router-link :to="'/branch/' + this.opinion['relation_id'] + '/t/' + this.toKebabCase((this.statementText).slice(0, 30))" class="text-dark text-decoration-none">
          <fa icon="quote-left" class="text-secondary text-sm mr-1" />
          {{statementText}}
          <fa icon="quote-right" class="text-secondary text-sm ml-1" />
        </router-link>
      </div>
      <small class="text-light">
        {{timeSince(opinion['relation']['updated_at'] + ' UTC', 2592000000, 'm d, Y')}}
      </small>
    </div>
    <div v-html="opinionMessage" class="text-break bg-light p-1 rounded text-sm px-3 d-flex align-items-center ">
      
    </div>
  </div>
</template>
<script>
import OpinionHelper from '@/helpers/opinion'
export default {
  props: {
    opinion: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      opinionMessage: OpinionHelper.convertToMessage(this.opinion['type'], this.opinion['confidence'])
    }
  },
  methods: {

  },
  computed: {
    statementText(){
      return this.opinion['relation']['virtual_relation_id'] ? this.opinion['relation']['virtual_relation']['statement']['text'] : this.opinion['relation']['statement']['text']
    }
  }
}
</script>