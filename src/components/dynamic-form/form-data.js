import { ref } from 'vue'
class FormData {
  setupConfiguration = {}
  setUp(){
    const formFieldData = ref({})
    console.log('this.formFieldData', formFieldData.value)
    this.setupConfiguration = {
      formFieldData: formFieldData
    }
    return this.setupConfiguration
  }
}
export default FormData