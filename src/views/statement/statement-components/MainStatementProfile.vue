<template>
  <div v-if="mainRelationData" class="d-md-flex mb-1" @click="selectedStatementId = null">
    <div class="d-flex flex-fill">
      <div>
        <fa icon="user-circle" class="text-secondary" style="font-size:2.7em" />
      </div>
      <div class="pl-1">
        <StatementTypePill :statement-type-id="mainRelationData['statement'] ? mainRelationData['statement']['statement_type_id'] : 0" />
        <div class="text-sm">
          by {{mainRelationData['user']['username']}}
        </div>
        <!-- <div class="text-sm">
          
        </div> -->
      </div>
    </div>
    <div class="pl-2 text-right">
      <span class="text-sm text-light">{{timeSince(mainRelationData['created_at'])}}</span>
      <div class="dropdown">
        <button class="btn btn-outline-dark btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Authors
        </button>
        <div @click.stop class="dropdown-menu dropdown-menu-right px-2" aria-labelledby="dropdownMenuButton">
          <div>
            <span v-if="!Object.keys(authors).length">No other authors</span>
            <template v-else>
              <div @click="addAuthorFilter()">
                <input :checked="Object.keys(authorFilter).length === 0" type="checkbox"  class="mr-1">
                <label class="mb-2">Show All</label>
              </div>
              <template v-for="author in authors">
                <div @click="addAuthorFilter(author['id'])" class="c-pointer text-break d-flex align-items-center" style="min-width:0">
                  <input 
                    :checked="typeof authorFilter[author['id']] === 'undefined' ? false : authorFilter[author['id']]" 
                    type="checkbox"  class="mr-1 "
                  />
                  <label class="mb-2 flex-fill text-break c-pointer">{{author['username']}}</label>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import GlobalData from '../global-data'
import StatementTypePill from '@/components/StatementTypePill'
export default {
  components: {
    StatementTypePill
  },
  data(){
    return {
      ...GlobalData
    }
  },
  methods: {
    addAuthorFilter(userId = null){
      if(userId === null){
        this.authorFilter = {}
      }else if(typeof this.authorFilter[userId] !== 'undefined' && this.authorFilter[userId]){
        delete this.authorFilter[userId]
      }else{
        this.authorFilter[userId] = true
      }
    }
  }
}
</script>
