<template>
  <div>
    <div 
      v-if="!isToggled" @click="isFocused = true" 
      class="btn-lg btn-shadow w-100 d-flex align-items-center text-lg text-white"
    >
      <div class="text-right flex-fill">
        <fa icon="search" />
      </div>
      <small class="ml-2 flex-fill text-left">Search Trees</small>
    </div>
    <div
      v-else
      class="d-flex btn-lg btn-shadow w-100 bg-white p-0 border-width-none"
    >
      <input 
        ref="searchInput"
        @focus="isFocused = true"
        @blur="isFocused = false" 
        @keypress.enter="search"
        v-model="keyword"
        type="text" 
        class="form-control-no-border bg-transparent border-none flex-fill px-4 py-1 text-initial" 
        placeholder="Enter statement keyword..."
      />
      <button @click.stop="search" class="border-none btn-lg btn-primary rounded-r-oval px-3 text-white d-flex align-items-center" ><span class="text-sm"><fa icon="search" /> Seach</span> &nbsp;</button>
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
      this.isFocused = true
      setTimeout(() => {
        this.$refs.searchInput.focus()
      }, 200)
    },
    search(){
      console.log('search 1')
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