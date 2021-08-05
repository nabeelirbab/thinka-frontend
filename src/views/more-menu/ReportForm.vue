<template>
  <div>
    <h5 class="mb-3">Send a Report or Suggestion</h5>
    <DynamicForm ref="reportForm" :readonly="isLoading || isSuccess" :form-settings="formSetting" />
    <div class="text-right">
      <span v-if="isSuccess" class="text-success">Your report has been sent <fa icon="check" /></span>
      <button v-else-if="!isLoading" @click="sendReport" class="btn btn-primary">Send</button>
      <span v-else>Please wait <fa icon="spinner" spin /></span>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/dynamic-form/DynamicForm'
import UserReport from '@/api/user-report'
export default {
  components: {
    DynamicForm
  },
  data(){
    return {
      isLoading: false,
      isSuccess: false,
      formSetting: {
        fields: {
          detail: {
            label_col_span: 'd-none',
            input_col_span: 'col-12',
            placeholder: 'Enter the details you want to report. Make sure to include the page/s.',
            type: 'textarea'
          }
        }
      }
    }
  },
  methods: {
    sendReport(){
      this.isLoading = true
      UserReport.create(this.$refs.reportForm._getFormData()).then(response => {
        console.log(response)
        if(response['data']){
          this.isSuccess = true
        }
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>