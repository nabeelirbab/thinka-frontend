import { ref, watch } from 'vue'
const authors = ref({})
const selectedStatementId = ref(0)
const mainRelationData = ref(null)
const mainRelationId = ref(0)
const deletedRelationId = ref(null)
const selectedStatementData = ref(null)
const showImpact = ref(false)
const showOpinion = ref(false)
const showScope = ref(false)
const showCTOpinion = ref(false)
const editSelectedStatement = ref(false)
const enableDragging = ref(false)
const isDraggingStatement = ref(0) // 1 - dragging on positive, 2 dragging on negative
const createSubStatementParentId = ref(0) // parent id of an active create sub statement
const statementTextFilter = ref('')
const authorFilter = ref({})
const backHistory = ref([])
const forwardHistory = ref([])
const subRelationMap = ref({}) // trace the location of the substatement given the statement id
const subRelationIds = ref([]) // list of subrelation ids. Used to update all the sub statements
const mapRelations = (relation = null, parentIds = []) => {
  let ids = []
  if(relation === null){
    relation = mainRelationData.value
  }
  if(parentIds.length === 0){
    authors.value = {}
    subRelationIds.value = []
    subRelationMap.value = {}
  }
  relation['relations'].forEach((relation, index) => {
    authors.value[relation['user_id']] = relation['user']
    ids.push({id: relation['id']})
    subRelationMap.value[relation['id']] = parentIds.concat([index])
    if(relation['relations'] && relation['relations'].length){
      ids = ids.concat(mapRelations(relation, subRelationMap.value[relation['id']]))
    }
  })
  if(parentIds.length === 0){
    subRelationIds.value = ids
  }
  return ids
}
const hideToolbarDialog = () => {
  showImpact.value = false
  showOpinion.value = false
  showScope.value = false
}
watch(mainRelationData, (newMainRelationData) => {
  if(newMainRelationData){
    mainRelationId.value = newMainRelationData
    mapRelations()
  }else{
    mainRelationId.value = 0
    authors.value = []
    subRelationIds.value = []
    subRelationMap.value = {}
  }
})

watch(selectedStatementId, (id) => {
  editSelectedStatement.value = false
  enableDragging.value = false
  if(id === 0 || id === null){
    showImpact.value = false
    showOpinion.value = false
    showScope.value = false
    isDraggingStatement.value = 0
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
  deletedRelationId: deletedRelationId,
  isDraggingStatement: isDraggingStatement,
  subRelationMap: subRelationMap,
  editSelectedStatement: editSelectedStatement,
  enableDragging: enableDragging,
  authors: authors,
  mainRelationId: mainRelationId,
  subRelationIds: subRelationIds,
  authorFilter: authorFilter,
  mapRelations: mapRelations,
  hideToolbarDialog: hideToolbarDialog
}
