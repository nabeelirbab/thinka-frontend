import { ref, watch, computed } from 'vue'
import QuickHelper from '@/helpers/quick-helper'
const authors = ref({})
const selectedStatementId = ref(0)
const mainRelationData = ref(null)
const mainRelationId = ref(0)
const deletedRelationId = ref(null)
const selectedStatementData = ref(null) // this is actually selectedRelationData

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
const parentRelationIdsWithPassedFilterChildren = ref({}) // determine if the relation has children which passess the filter
const backHistory = ref([])
const forwardHistory = ref([])
const subRelationMap = ref({}) // trace the location of the substatement given the statement id
const subRelationParents = ref({}) // list of parents of a given relation id sorted from the top
const subRelationIds = ref([]) // list of subrelation ids. Used to update all the sub statements
const isMainRelationSelected = computed(() => {
  return mainRelationId.value && selectedStatementId.value && mainRelationId.value * 1 === selectedStatementId.value * 1
})
const hasFilterApplied = computed(() => {
  console.log('hasFilterApplied', authorFilter.value, statementTextFilter.value)
  return Object.keys(authorFilter.value).length !== 0 || statementTextFilter.value !== ''
})
const mapRelations = (relation = null, parentIndexIds = [], parentIds = []) => {
  if(relation === null){
    relation = mainRelationData.value
  }
  if(parentIndexIds.length === 0){
    authors.value = {}
    subRelationIds.value = []
    subRelationMap.value = {}
  }
  subRelationIds.value.push({id: relation['id']})
  let toDeleteCircularRelationIndices = []
  relation['is_author_filter_passed'] = true
  subRelationParents.value[relation['id']] = parentIds
  const subRelationParentIds = parentIds.concat([relation['id']])
  relation['relations'].forEach((subRelation, index) => {
    const isAlreadyExisted = QuickHelper.methods.findArrayIndex(subRelation['id'], subRelationIds.value, 'id') // check if subrelation already existed somewhere
    if(isAlreadyExisted === -1){
      authors.value[subRelation['user_id']] = subRelation['user']
      subRelationMap.value[subRelation['id']] = parentIndexIds.concat([index])
      if(typeof subRelation['relations'] !== 'undefined' && subRelation['relations'].length){
        mapRelations(subRelation, subRelationMap.value[subRelation['id']], subRelationParentIds)
      }else{
        subRelationParents.value[subRelation['id']] = subRelationParentIds
      }
    }else{
      toDeleteCircularRelationIndices.push(index)
    }
  })
  toDeleteCircularRelationIndices.forEach(index => {
    relation['relations'].slice(index, 1)
  })
}
const hideToolbarDialog = () => {
  showImpact.value = false
  showOpinion.value = false
  showScope.value = false
}
watch(mainRelationData, (newMainRelationData) => {
  if(newMainRelationData){
    mainRelationId.value = newMainRelationData['id'] * 1
    mapRelations()
  }else{
    mainRelationId.value = 0
    authors.value = []
    subRelationIds.value = []
    subRelationMap.value = {}
  }
})
let filterByAuthor = (relationToFilter, authorFilters) => {
  relationToFilter['is_author_filter_passed'] = Object.keys(authorFilters).length === 0 || typeof authorFilters[relationToFilter['user_id']] !== 'undefined'
  if(relationToFilter['is_author_filter_passed'] && typeof subRelationParents.value[relationToFilter['id']] !== 'undefined'){
    subRelationParents.value[relationToFilter['id']].forEach(parentId => {
      parentRelationIdsWithPassedFilterChildren.value[parentId] = true
    })
  }
  relationToFilter['relations'].forEach(relation => {
    filterByAuthor(relation, authorFilters)
  })
}
watch(authorFilter, () => {
  parentRelationIdsWithPassedFilterChildren.value = {}
  filterByAuthor(mainRelationData.value, authorFilter.value)
}, {deep: true})

watch(selectedStatementId, (id) => {
  
  if(id === 0 || id === null){
    showImpact.value = false
    showOpinion.value = false
    showScope.value = false
    isDraggingStatement.value = 0
    selectedStatementData.value = null
  }
  editSelectedStatement.value = false
  enableDragging.value = false
  createSubStatementParentId.value = 0
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
  parentRelationIdsWithPassedFilterChildren: parentRelationIdsWithPassedFilterChildren,
  isMainRelationSelected: isMainRelationSelected,
  hasFilterApplied: hasFilterApplied,
  mapRelations: mapRelations,
  hideToolbarDialog: hideToolbarDialog
}
