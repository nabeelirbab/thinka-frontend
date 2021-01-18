<template>
  <div>
    <template v-for="(field, fieldKey) in fields">
      <BasicInput
        model2123=""
        v-model="formFieldData[fieldKey]"
        :form-data="formFieldData"
        @update:modelValue="fieldDataChanged(fieldKey)"
        :ref="'basic_input_' + fieldKey" 
        :name="fieldKey" 
        :field="field"
        :error-message="errorMessages[fieldKey]"
        :readonly="readonly"
      />
    </template>
  </div>
</template>
<script>
import BasicInput from './BasicInput'
export default {
  components: {
    BasicInput
  },
  props: {
    fields: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: true
    },
    readonly: Boolean
  },
  data(){
    const setupConfiguration = this.formData.setupConfiguration
    return {
      formFieldData: setupConfiguration.formFieldData,
      errorMessages: {}
    }
  },
  methods: {
    // _setFormData(formData){
    //   this.formFieldData = formData.formFieldData
    // },
    _isValid(){ // show errors on the form, and return true if valid
      let isValid = true
      for(let fieldKey in this.fields){
        if(!this.$refs['basic_input_' + fieldKey]._isValid()){
          isValid = false
        }
      }
      return isValid
    },
    _addErrorMessages(errorMessages){
      this.errorMessages = {}
      setTimeout(() => {
        this.errorMessages = errorMessages
      }, 100)
    },
    fieldDataChanged(fieldKey){
      if(typeof this.fields[fieldKey]['on_change'] !== 'undefined'){
        this.fields[fieldKey]['on_change'] ({
          value: this.formFieldData[fieldKey]
        }, this.formFieldData)
      }
      if(
        typeof this.fields[fieldKey]['delete_on_empty'] !== 'undefined' 
        && typeof this.formFieldData[fieldKey] !== 'undefined' 
        && this.fields[fieldKey]['delete_on_empty'] 
        && (this.formFieldData[fieldKey] === '' || this.formFieldData[fieldKey] === null)
      ){
        delete this.formFieldData[fieldKey]
      }
    }
  },
  watch: {
    // fields: {
    //   handler(fields){
    //     this.customValidationFunctions = []
    //     for(let fieldKey in this.fields){
    //       if(typeof this.fields[fieldKey]['custom_validation'] === 'function'){
    //         this.customValidationFunctions.push(this.fields[fieldKey]['custom_validation'])
    //       }
    //     }
    //   },
    //   immediate: true
    // }
    // formFieldData: {
    //   deep: true,
    //   handler(newData, oldData){
    //   }
    // }
  }
}
</script>