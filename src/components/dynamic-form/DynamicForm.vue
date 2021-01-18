<template>
  <div>
    <Field ref="field" v-if="typeof form['fields'] !== 'undefined'" 
      :fields="form['fields']"
      :form-data="formData"
      :readonly="readonly"
    />
    <span v-else>Form has no fields</span>
  </div>
</template>
<script>
import FormData from './form-data'
import Field from './Field'
export default {
  components: {
    Field
  },
  props: {
    formSettings: {
      type: Object,
      required: true
    },
    readonly: Boolean
  },
  mounted(){
    this.setFormData()
  },
  data(){
    const formData = new FormData()
    formData.setUp()
    return {
      formData : formData,
      formFieldData: formData.setupConfiguration.formFieldData,
      form: {

      }
    }
  },
  methods: {
    setFormData(){
      // this.$refs.field._setFormData(this.formData.setUp())
    },
    _isValid(){ // show errors on the form, and return true if valid
      return this.$refs.field._isValid()
    },
    _getFormData(raw = false){
      let formData = this.formFieldData
      if(raw){
        return formData
      }else{
        let nestedFormData = {}
        for(let fieldKey in formData){
          const segmentFieldKey = fieldKey.split('.')
          let currentNestedFormData = nestedFormData
          segmentFieldKey.forEach((currentFieldKey, index) => {
            if(typeof currentNestedFormData[currentFieldKey] !== 'undefined'){
              currentNestedFormData = currentNestedFormData[currentFieldKey]
            }else if(index === segmentFieldKey.length - 1){
              console.log(fieldKey, formData[fieldKey])
              currentNestedFormData[currentFieldKey] = formData[fieldKey]
            }else{
              currentNestedFormData[currentFieldKey] = {}
              currentNestedFormData = currentNestedFormData[currentFieldKey]
            }
          })
        }
        return nestedFormData
      }
    },
    _fillFormData(formData, isRaw = false){
      setTimeout(() => {
        if(isRaw){
          this.formFieldData = formData
        }else{
          let stringKeyFormData = this.toStringKey(formData)
          for(let stringKeyFormDataKey in stringKeyFormData){
            this.formFieldData[stringKeyFormDataKey] = stringKeyFormData[stringKeyFormDataKey]
          }
        }
      }, 10)
    },
    _resetFormData(){
      for(let formFieldDataKey in this.formFieldData){
        delete this.formFieldData[formFieldDataKey]
      }
    },
    _addErrorMessages(errorMessages){
      this.$refs.field._addErrorMessages(errorMessages)
    },
    _addRequestError(errorResult){
      if(errorResult.response.status === 422){
        const responseBody  = errorResult.response['data']
        if(responseBody['error']['code'] * 1 === 1){ // form validation error
          let errorMessages = {}
          for(let field in responseBody['error']['message']){
            errorMessages[field] = responseBody['error']['message'][field].reduce((currentMessage, newMessage) => currentMessage + newMessage + '. ', '')
          }
          this._addErrorMessages(errorMessages)
        }
      }
    },
    toStringKey(nestedFormData, parentStringKey = ''){
      let stringKeyFormData = {}
      for(let fieldKey in nestedFormData){
        if(typeof nestedFormData[fieldKey] === 'object' && nestedFormData[fieldKey] !== null){
          let stringKeyFormDataList = this.toStringKey(nestedFormData[fieldKey], fieldKey)
          for(let stringKeyFormDataListKey in stringKeyFormDataList){
            stringKeyFormData[parentStringKey + (parentStringKey !== '' ? '.' : '') + stringKeyFormDataListKey] = stringKeyFormDataList[stringKeyFormDataListKey]
          }
        }else{
          stringKeyFormData[parentStringKey + (parentStringKey !== '' ? '.' : '') + fieldKey] = nestedFormData[fieldKey]
        }
      }
      return stringKeyFormData
    },
  },
  watch: {
    formSettings: {
      handler(formSettings){
        this.form = formSettings
      },
      immediate: true
    }
  }
}
</script>