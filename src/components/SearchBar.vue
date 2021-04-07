<template>
  <div>
    <div
      v-if="!isToggled" @click="isFocused = true" 
      class="btn-lg btn-sm-xl c-pointer rounded-oval btn-shadow w-100 d-flex align-items-center text-white"
      style="background-color:#ffffff1a;"
    >
      <div class="text-right flex-fill">
        <fa icon="search" />
      </div>
      <span class="ml-2 flex-fill text-left text-nowrap">Search Trees</span>
    </div>
    <div
      v-else
      class="search-bar-y-padding text-initial d-flex rounded-oval btn-shadow w-100 bg-white p-0 border-width-none"
    >
      <input 
        ref="searchInput"
        @blur="isFocused = false" 
        @keypress.enter="search"
        v-model="keyword"
        type="text" 
        class="btn-sm-xl form-control-no-border bg-transparent border-none w-100 pl-3 pr-1" 
        placeholder="Enter statement keyword..."
        
      />
      <button 
        @click.stop="search" 
        class="search-bar-y-padding rounded-r-oval border-none btn-primary px-3 text-white d-flex align-items-center text-nowrap"
      >
        <span class=""><fa icon="search" /> Search</span> &nbsp;
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: String
  },
  emits: ['search', 'update:modelValue'],
  data(){
    return {
      isFocused: false,
      keyword: ''
    }
  },
  mounted(){
    this._clear()
  },
  methods: {
    _clear(){
      this.isFocused = false,
      this.keyword = ''
    },
    focus(){
      console.log('focused?')
      this.isFocused = true
      setTimeout(() => {
        this.$refs.searchInput.focus()
      }, 200)
    },
    search(){
      this.$emit('search', this.keyword)
    }
  },
  watch: {
    isFocused(isFocused){
      if(isFocused){
        
        setTimeout(() => {
          if(this.$refs.searchInput){
            this.$refs.searchInput.focus()
          }else{
            isFocused(isFocused)
          }
        }, 200)
      }
    },
    modelValue: {
      handler(){
        this.keyword = this.modelValue
      },
      immediate: true
    },
    keyword: {
      handler(keyword){
        this.$emit('update:modelValue', keyword)
      },
      immediate: true
    } 
  },
  computed: {
    isToggled(){
      return this.keyword !== '' || this.isFocused
    }
  }
}
</script>
<style>
 .search-bar-height {
   padding: 0.5rem 1rem!important
 }
 .search-bar-y-padding {
   padding-top: 0.72rem;
   padding-bottom: 0.72rem;
 }
</style>