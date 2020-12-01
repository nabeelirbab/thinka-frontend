import { ref, watch } from 'vue'
const selectedStatementId = ref(0)
const mainRelationData = ref(null)
const deletedRelationId = ref(null)
const selectedStatementData = ref(null)
const showImpact = ref(false)
const showOpinion = ref(false)
const showScope = ref(false)
const showCTOpinion = ref(false)
const createSubStatementParentId = ref(0) // parent id of an active create sub statement
const statementTextFilter = ref('')
const backHistory = ref([])
const forwardHistory = ref([])
watch(selectedStatementId, (id) => {
  if(id === 0 || id === null){
    showImpact.value = false
    showOpinion.value = false
    showScope.value = false
    createSubStatementParentId.value = 0
    selectedStatementData.value = null
  }else{
    createSubStatementParentId.value = 0
  }
})
watch(statementTextFilter, (searchText) => {
  if(searchText !== '' && selectedStatementData.value && selectedStatementData.value['statement']['text'].indexOf(searchText) === -1){
    selectedStatementId.value = 0
  }
})
watch(showImpact, (value) => {
  if(value){
    showScope.value = false
  }
})
watch(showScope, (value) => {
  if(value){
    showImpact.value = false
  }
})
export default {
  selectedStatementId: selectedStatementId,
  selectedStatementData: selectedStatementData,
  showImpact: showImpact,
  showOpinion: showOpinion,
  showScope: showScope,
  createSubStatementParentId: createSubStatementParentId,
  showCTOpinion: showCTOpinion,
  statementTextFilter: statementTextFilter,
  backHistory: backHistory,
  forwardHistory: forwardHistory,
  mainRelationData: mainRelationData,
  deletedRelationId: deletedRelationId
}
