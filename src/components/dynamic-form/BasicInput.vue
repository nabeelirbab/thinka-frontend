<template>
  <div class="form-group row">
    <label class="col-12 col-lg-4 col-form-label text-capitalize font-weight-bold">{{label}}</label>
    <div class="col-12 col-lg-8">
      <SelectInput
        v-if="type === 'select'"
        @value-change="updateValue"
        :modelValue="modelValue"
        :config="config"
        :default-value="defaultValue"
        :type="type"
        :class="error ? 'is-invalid' : ''"
        :placeholder="placeholder" 
        :required="isRequired"
        :readonly="readonly"
      />
      <NormalInput
        v-else
        :modelValue="modelValue"
        @value-change="updateValue"
        :default-value="defaultValue"
        :type="type"
        :class="error ? 'is-invalid' : ''"
        :placeholder="placeholder" 
        :required="isRequired"
        :readonly="readonly"
        />
      <div class="invalid-feedback">
        {{error}}
      </div>
      <small v-if="helpText && error === null" class="form-text text-muted">{{helpText}}</small>
    </div>
  </div>
</template>
<script>
import NormalInput from './input-components/NormalInput'
import SelectInput from './input-components/SelectInput'
import ValidationChecker from './validation-checker'
export default {
  components: {
    NormalInput,
    SelectInput
  },
  props: {
    name: {
      type: String,
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    errorMessage: String,
    modelValue: [String, Number],
    formData: Object,
    readonly: Boolean
  },
  emits: ['update:modelValue'],
  data(){
    return {
      validationRules: {
        required: typeof this.field['is_required'] !== 'undefined' ? this.field['is_required'] : true,
        email: false
      },
      validationErrors: [],
      error: null
    }
  },
  methods: {
    _get_validation_errors(){
      return this.validationErrors
    },
    _isValid(){
      let isValid = true
      this.validationErrors = []
      this.error  = null
      if(this.validationRules['required'] && (typeof this.modelValue === 'undefined' || this.modelValue === null || this.modelValue === '')){
        isValid = false
        this.validationErrors = ["required"],
        this.error = 'This is required'
      }else{
        if(this.validationRules['required'] && this.validationRules['email'] && !ValidationChecker.isEmail(this.modelValue)){
          isValid = false
          this.validationErrors = ["email"],
          this.error = 'This must be an email'
        }
        if(typeof this.field['custom_validation'] === 'function'){
          const error = this.field['custom_validation'](this.modelValue, this.formData)
          if(error){
            isValid = false
            this.validationErrors = ["custom_validation"],
            this.error = error
          }
        }
      }
      return isValid
    },
    updateValue($event){
      this.$emit('update:modelValue', $event)
      setTimeout(() => {
        this._isValid()
      }, 50)
    }
  },
  watch: {
    errorMessage: {
      handler(errorMessage){
        this.error = typeof errorMessage === 'undefined' || errorMessage === '' ? null : errorMessage
      },
      immediate: true
    },
    type: {
      handler(type){
        this.validationRules['email'] = type === 'email'
      },
      immediate: true
    }
  },
  computed: {
    helpText(){
      return typeof this.field['help_text'] === 'undefined' ? null : this.field['help_text']
    },
    isRequired(){
      return typeof this.field['is_required'] === 'undefined' ? true : this.field['is_required']
    },
    type(){
      return (typeof this.field['type'] === 'undefined') ? 'text' : this.field['type']
    },
    label(){
      if(typeof this.field['label'] !== 'undefined'){
        return this.field['label']
      }else{
        return this.toCapitalize((this.name.replace(/_/g, ' ')).replace(/\./g, ' '))
      } 
    },
    placeholder(){
      if(typeof this.field['placeholder'] !== 'undefined'){
        return this.field['placeholder']
      }else{
        return this.label
      } 
    },
    config(){
      return typeof this.field['config'] === 'undefined' ? {} : this.field['config']
    },
    defaultValue(){
      return typeof this.field['default_value'] === 'undefined' ? null : this.field['default_value']
    },
  }
}
</script>
