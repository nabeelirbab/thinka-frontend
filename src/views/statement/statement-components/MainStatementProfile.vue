<template>
  <div v-if="mainRelationData" class="d-flex mb-1">
    <div>
      <fa icon="user-circle" class="text-secondary" style="font-size:2.7em" />
    </div>
    <div class="pl-1">
      <div class="font-weight-bold">
        {{toPascal(mainRelationData['user']['user_basic_information']['first_name'])}} {{toPascal(mainRelationData['user']['user_basic_information']['last_name'])}}
      </div>
      <div class="text-sm">
        {{formatDate(mainRelationData['created_at'], 'M d at H:m')}}
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
  }
}
</script>