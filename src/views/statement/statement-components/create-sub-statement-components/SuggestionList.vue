<template>
  <div>
    <template v-for="(suggestion, index) in suggestions" >
      <div 
        v-if="noSelectedSuggestionItem || selectedSuggestionId === suggestion['id'] || joinedSuggestionId === suggestion['id'] || linkedSuggestionId === suggestion['id']"
        :class="index !== suggestions.length - 1 ? 'border-bottom ' : ''" 
        class="d-flex align-items-center" 
        style="min-width: 0"
      >
        <div class="d-flex">
          <div class="p-1">
            <!-- Select Suggestion -->
            <template v-if="noSelectedSuggestionItem || selectedSuggestionId">
              <span 
                v-if="!selectedSuggestionId"
                @click="$emit('select-suggestion', suggestion)"
                class="c-pointer text-info text-hover-underline"
                title="Use this statement"
              >
                <fa icon="file" />
              </span>
              <span
                v-else
                @click="$emit('select-suggestion', null)"
                class="c-pointer text-danger text-hover-underline"
              >
                Unselect
              </span>
            </template>
            <!--- Join Suggestion -->
            <template 
              v-if="!noJoin
                && (noSelectedSuggestionItem || joinedSuggestionId)
                && suggestion['parent_relation_id'] === null
                && suggestion['user_id'] * 1 === user['id'] * 1
                && suggestion['logic_tree_id'] !== logicTreeId"
            >
              <span 
                v-if="!joinedSuggestionId"
                @click="$emit('join-suggestion', suggestion)"
                class="c-pointer text-info text-hover-underline ml-1"
                title="Join this Relation"
              >
                <fa icon="project-diagram" /> 
              </span>
              <span v-else
                @click="$emit('join-suggestion', null)"
                class="c-pointer text-danger text-hover-underline ml-1"
              >
                Cancel Joining
              </span>
            </template>
            <!--- Link Suggestion -->
            <template 
              v-if="!noLink
                && (noSelectedSuggestionItem || linkedSuggestionId)
                && suggestion['logic_tree_id'] !== logicTreeId"
            >
              <span 
                v-if="!linkedSuggestionId"
                @click="$emit('link-suggestion', suggestion)"
                class="c-pointer text-info text-hover-underline ml-1"
                title="Link this Relation"
              >
                <fa icon="link" /> 
              </span>
              <span v-else
                @click="$emit('link-suggestion', null)"
                class="c-pointer text-danger text-hover-underline ml-1"
              >
                Cancel Link
              </span>
            </template>
          </div>
          <!-- <div v-if="suggestion['logic_tree']" class="text-sm text-break"><fa icon="tree" /> {{suggestion['logic_tree']['name']}}</div> -->
          <div :class="selectedSuggestionId ? 'font-weight-bold' : ''" class="p-1 mr-1 text-break">{{suggestion['statement']['text']}}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import Auth from '@/core/auth'
export default {
  props: {
    suggestions: Array,
    selectedSuggestionId: Number,
    joinedSuggestionId: Number,
    linkedSuggestionId: Number,
    noJoin: Boolean,
    noLink: Boolean,
    logicTreeId: [Number, Object]
  },
  emits: ['join-suggestion', 'select-suggestion', 'link-suggestion'],
  data(){
    return {
      user: Auth.user()
    }
  },
  computed: {
    noSelectedSuggestionItem(){
      return this.selectedSuggestionId === 0 && this.joinedSuggestionId === 0 && this.linkedSuggestionId === 0
    }
  }
}
</script>
