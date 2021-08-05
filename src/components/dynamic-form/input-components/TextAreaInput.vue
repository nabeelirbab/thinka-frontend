<template>
  <textarea 
    :value="modelValue" 
    :type="type" 
    :class="error ? 'is-invalid' : ''"  
    :placeholder="placeholder" 
    :required="isRequired"
    :readonly="readonly"
    @input="$emit('value-change', postProcessValue($event.target.value))"
    autocomplete class="form-control" ></textarea>
</template>
<script>
  export default {
    props: {
      type: String,
      error: [String, Object], // object for null
      placeholder: String,
      required: Boolean,
      modelValue: [String, Number],
      defaultValue: [String, Number, Object],
      isRequired: Boolean,
      readonly: Boolean
    },
    emits: ['value-change'],
    data(){
      return {
      }
    },
    methods: {
      postProcessValue(value){
        if(this.type === 'email'){
          return value === '' ? null : value
        }else{
          return value
        }
      }
    },
    watch: {
      modelValue: {
        handler(modelValue){
          if(modelValue === '' && (this.isRequired || this.type === 'password')){
            this.$emit('value-change', null)
          }
          // if(modelValue === null){
          //   console.log('changed')
          //   this.$emit('value-change', '')
          // }
        },
        immediate: true
      }
    }
  }
</script>