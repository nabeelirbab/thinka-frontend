<template>
  <div class="container bg-white height-max pt-4 text-center">
    <template v-if="isLoading">
      Please wait... <fa icon="spinner" spin />
    </template>
    <template v-else>
      Try searching for a statement in Search Page <br />
      <router-link to="/search" class="btn btn-primary"><fa icon="search" /> Search Page</router-link>
    </template>
  </div>
</template>
<script>
export default {
  mounted(){
    let relationId =localStorage.getItem('last_viewed_relation_id')
    if(relationId && !isNaN(relationId  * 1)){
      this.$router.push('/branch/' + relationId)
    }else{
      this.isLoading = false
    }
  },
  data(){
    return {
      isLoading: true
    }
  }
}
</script>