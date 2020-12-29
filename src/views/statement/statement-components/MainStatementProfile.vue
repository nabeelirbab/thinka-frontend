<template>
  <div v-if="mainRelationData" class="d-flex mb-1" @click="selectedStatementId = null">
    <div class="d-flex flex-fill">
      <div>
        <fa icon="user-circle" class="text-secondary" style="font-size:2.7em" />
      </div>
      <div class="pl-1">
        <div class="font-weight-bold">
          {{toPascal(mainRelationData['user']['user_basic_information']['first_name'])}} {{toPascal(mainRelationData['user']['user_basic_information']['last_name'])}}
        </div>
        <div class="text-sm">
          {{timeSince(mainRelationData['created_at'])}}
        </div>
      </div>
    </div>
    <div class="pl-2">
      <div class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Authors
        </button>
        <div @click.stop class="dropdown-menu px-2" aria-labelledby="dropdownMenuButton">
          <div>
            <span v-if="!Object.keys(authors).length">No other authors</span>
            <template v-else>
              <div @click="addAuthorFilter()">
                <input :checked="Object.keys(authorFilter).length === 0" type="checkbox"  class="mr-1">
                <label class="mb-2">Show All</label>
              </div>
              <template v-for="author in authors">
                <div @click="addAuthorFilter(author['id'])" class="c-pointer">
                  <input :checked="typeof authorFilter[author['id']] === 'undefined' ? false : authorFilter[author['id']]" type="checkbox"  class="mr-1">
                  <label class="mb-2">{{userBasicInformationFullName(author['user_basic_information'])}}</label>
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
