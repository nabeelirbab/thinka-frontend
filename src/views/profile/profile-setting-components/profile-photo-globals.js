import { ref } from 'vue'
const hasFile = ref(null)
const imageSource = ref(null)
const imageNaturalDimension = ref({
  width: 0,
  height: 0,
})
const fileInputElement = ref(null)
export default {
  hasFile: hasFile,
  imageSource: imageSource,
  imageNaturalDimension: imageNaturalDimension,
  fileInputElement: fileInputElement
}