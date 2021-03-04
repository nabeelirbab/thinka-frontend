<template>
  <div class="mb-3">
    <div 
      v-if="!isFocused" @click="isFocused = true" 
      class="btn btn-lg btn-shadow w-100 d-flex align-items-center text-lg text-white"
    >
      <div class="text-right flex-fill">
        <fa icon="search" />
      </div>
      <small class="ml-2 flex-fill text-left">Search Trees</small>
    </div>
    <div
      v-else
      class="d-flex mb-3 btn btn-lg btn-shadow w-100 bg-white p-0 border-width-none"
    >
      <input 
        ref="searchInput"
        @blur="focusOut" 
        @keypress.enter="search"
        v-model="keyword"
        type="text" 
        class="form-control-no-border bg-transparent border-none flex-fill px-4 py-1 text-sm" 
        placeholder="Enter statement keyword..."
      />
      <button @click.stop="search" class="border-none btn-lg rounded-r-oval px-3 text-white bg-primary  d-flex align-items-center" ><span class="text-sm"><fa icon="search" /> Seach</span> &nbsp;</button>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      isFocused: false,
      keyword: ''
    }
  },
  methods: {
    search(){
      console.log('keyword', this.keyword)
      this.$router.push('/search/' + this.toKebabCase(this.keyword))
    },
    focusOut(){
      setTimeout(() => {
        // this.isFocused = false
      }, 200)
    }
  },
  watch: {
    isFocused(isFocused){
      if(isFocused){
        setTimeout(() => {
          this.$refs.searchInput.focus()
        }, 100)
      }
    }
  }
}
</script>