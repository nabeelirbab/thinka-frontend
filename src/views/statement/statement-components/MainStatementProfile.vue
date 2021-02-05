<template>
  <div v-if="mainRelationData" class="d-md-flex mb-1" @click="selectedStatementId = null">
    <div class="d-flex flex-fill">
      <div>
        <fa icon="user-circle" class="text-secondary" style="font-size:2.7em" />
      </div>
      <div class="pl-1">
        <div class="font-weight-bold text-capitalize">
          {{mainRelationData['user']['username']}}
        </div>
        <div class="text-sm">
          {{timeSince(mainRelationData['created_at'])}}
        </div>
      </div>
    </div>
    <div class="pl-2 text-right">
      <div class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                <div v-if="typeof author !== 'undefined'" @click="addAuthorFilter(author['id'])" class="c-pointer text-break d-flex align-items-center" style="min-width:0">
                  <input :checked="typeof authorFilter[author['id']] === 'undefined' ? false : authorFilter[author['id']]" type="checkbox"  class="mr-1 ">
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
export default {
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
