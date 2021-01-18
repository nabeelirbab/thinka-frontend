<template>
  <div>
    <select 
      :value="modelValue" 
      :class="error ? 'is-invalid' : ''"  
      :placeholder="placeholder" 
      :required="isRequired"
      :readonly="readonly"
      @input="$emit('value-change', $event.target.value)"
      autocomplete class="form-control"
    >
      <template v-for="option in options">
        <option :value="option['value']" >{{option['text']}}</option>
      </template>
    </select>
  </div>
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
      config: Object
    },
    emits: ['value-change'],
    data(){
      return {
        options: []
      }
    },
    methods: {
      // postProcessValue(value){
      //   if(this.type === 'email'){
      //     return value === '' ? null : value
      //   }else{
      //     return value
      //   }
      // }
    },
    watch: {
      modelValue: {
        handler(modelValue){
          if((modelValue === null || typeof modelValue === 'undefined') && typeof this.defaultValue !== 'undefined'){
            this.$emit('value-change', this.defaultValue)
          }else{
            this.$emit('value-change', modelValue)
          }
        },
        immediate: true
      },
      config: {
        handler(config){
          if(typeof config['options'] === 'function'){ // options function should always return a promise
            config['options']().then((options) => {
              this.options = options
            })
          }else if(typeof config['options'] !== 'undefined'){
            this.options = config['options']
          }
        },
        immediate: true
      }
    }
  }
</script>