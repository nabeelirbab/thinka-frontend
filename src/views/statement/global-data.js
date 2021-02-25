import { ref, watch, computed } from 'vue'
import QuickHelper from '@/helpers/quick-helper'
import RelationAPI from '@/api/relation'
import Auth from '@/core/auth'
const authors = ref({})
const selectedStatementId = ref(0)
const mainRelationData = ref(null)
const mainRelationId = ref(0)
const deletedRelationId = ref(null)
const selectedStatementData = ref(null) // this is actually selectedRelationData
const userFollowing = ref({})

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
  return Object.keys(authorFilter.value).length !== 0 || statementTextFilter.value !== ''
})
const contextPassed = (userRelationContextLocks) => {
  if(userRelationContextLocks.length === 0){
    return true
  }else{
    let hasPassed = false
    userRelationContextLocks.forEach(userRelationContextLock => {
      if(userRelationContextLock['root_relation_id'] * 1 === mainRelationId.value * 1){
        hasPassed = true
        return false
      }
    })
    return hasPassed
  }
}
const mapRelations = (relation = null, parentIndexIds = [], parentIds = [], isVirtualRelation = 0, ) => {
  if(relation === null){
    relation = mainRelationData.value
  }
  if(parentIndexIds.length === 0){ // head of statement
    authors.value = {}
    subRelationIds.value = []
    subRelationMap.value = {}
    for(let key in relation['parent_relation_user_following']){
      const userId = relation['parent_relation_user_following'][key]['id']
      userFollowing.value[userId] = relation['parent_relation_user_following'][key]
    }
    console.log(relation)
  }
  userFollowing.value[relation['user_id']] = relation['user']
  for(let allUserRelationBookmarkIndex in relation['all_user_relation_bookmarks']){
    const userId = relation['all_user_relation_bookmarks'][allUserRelationBookmarkIndex]['user_id']
    userFollowing.value[userId] = (typeof userFollowing.value[userId] !== 'undefined') ? userFollowing.value[userId] : {}
  }

  subRelationIds.value.push({id: relation['id']})
  let toDeleteIndices = [] // for both circular and out of context relations
  let subRelations = relation['relations']
  relation['is_author_filter_passed'] = true
  relation['is_virtual_relation'] = isVirtualRelation // if true, the value will be the root virtual relation id
  if(relation && relation['virtual_relation_id']){
    if(!isVirtualRelation){ 
      relation['is_virtual_relation'] = relation['virtual_relation_id']
    }
    if(relation['virtual_relation']){
      subRelations = relation['virtual_relation']['relations']
    }
    // if(relation['virtual_relation']){
    //   relation['statement'] = relation['virtual_relation']['statement']
    //   relaton['relations'] = typeof relation['virtual_relation']['relations'] !== 'undefined' ? relation['virtual_relation']['relations'] : []
    // }
  }
  subRelationParents.value[relation['id']] = parentIds
  const subRelationParentIds = parentIds.concat([relation['id']])
  subRelations.forEach((subRelation, index) => {
    const isAlreadyExisted = QuickHelper.methods.findArrayIndex(subRelation['id'], subRelationIds.value, 'id') // check if subrelation already existed somewhere
    if(isAlreadyExisted === -1 && contextPassed(subRelation['user_relation_context_locks'])){
      authors.value[subRelation['user_id']] = subRelation['user']
      subRelationMap.value[subRelation['id']] = parentIndexIds.concat([index])
      if(typeof subRelation['relations'] !== 'undefined' && subRelation['relations'].length){
        subRelationParents.value[subRelation['id']] = subRelationParentIds
      }else{
        subRelation['relations'] = []
      }
      subRelation['is_virtual_relation'] = relation['is_virtual_relation']
      mapRelations(
        subRelation, // relation
        subRelationMap.value[subRelation['id']], // parentIndexIds
        subRelationParentIds, // parentIds
        relation['is_virtual_relation'] // isVirtualRelation
      )
    }else{
      toDeleteIndices.unshift(index)
    }
  })
  toDeleteIndices.forEach(index => {
    subRelations.splice(index, 1)
  })
  if(parentIndexIds.length === 0){
    console.log('done')
  }
}
const countUserFollowing = (relation = null) => {
  if(relation === null){
    userFollowing.value = {}
    relation = mainRelationData.value
    for(let key in relation['parent_relation_user_following']){
      const userId = relation['parent_relation_user_following'][key]['id']
      userFollowing.value[userId] = relation['parent_relation_user_following'][key]
    }
  }
  userFollowing.value[relation['user_id']] = relation['user']
  for(let allUserRelationBookmarkIndex in relation['all_user_relation_bookmarks']){
    const userId = relation['all_user_relation_bookmarks'][allUserRelationBookmarkIndex]['user_id']
    userFollowing.value[userId] = (typeof userFollowing.value[userId] !== 'undefined') ? userFollowing.value[userId] : {}
  }
  if(typeof relation['relations'] === 'object'){
    relation['relations'].forEach((subRelation) => {
      countUserFollowing(subRelation)
    })
  }
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
    userFollowing.value = {}
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
const getRelationInstance = (relationId) => {
  if(relationId === null || relationId === 0 || (relationId === mainRelationId.value)){
    return mainRelationData.value
  }else if(typeof subRelationMap.value[relationId] !== 'undefined'){
    const statementRelationIndexMap = subRelationMap.value[relationId]
    let currentRelation = mainRelationData.value
    const map = statementRelationIndexMap
    for(let x = 0; x < map.length; x++){
      const index = map[x]
      if(currentRelation['virtual_relation_id']){
        currentRelation = currentRelation['virtual_relation']['relations'][index]
      }else {
        currentRelation = currentRelation['relations'][index]
      }
    }
    if(currentRelation['id'] * 1 !== relationId * 1){
      console.error('There is problem with subRelationMap. Id not match', currentRelation, relationId)
    }
    return currentRelation
  }else{
    console.log('Cannot locate relation in subRelationMap', relationId, subRelationMap.value)
    return null
  }
}
const prepareNewSubStatement = (rawNewSubStatement) => {
  let newSubStatement = null
  if(typeof rawNewSubStatement['relation'] !== 'undefined'){ // from statement to relatio
    newSubStatement = rawNewSubStatement['relation']
    delete rawNewSubStatement['relation']
    newSubStatement['statement'] = rawNewSubStatement
  }else{ // its already a relation
    newSubStatement = rawNewSubStatement
  }
  const user = Auth.user().value
  console.log('prepareNewSubStatement', user)
  newSubStatement['relations'] = []
  newSubStatement['user_id'] = user['id']
  newSubStatement['user'] = {
    id: user['id'],
    username: user['username'],
    user_basic_information: {
      user_id: user['id'],
      first_name: user['first_name'],
      last_name: user['last_name']
    }
  }
  if(typeof newSubStatement['user_relation_context_locks'] === 'undefined'){
    newSubStatement['user_relation_context_locks'] = []
  }
  return newSubStatement
}
const addNewSubStatement = (newSubStatement, parentRelationId = null) => {
  let newSubRelations = null
  let parentRelation = getRelationInstance(parentRelationId)
  newSubRelations = prepareNewSubStatement(newSubStatement)
  console.log('parentRelation', parentRelationId, parentRelation)
  if(typeof newSubStatement['retrieve_relations'] !== 'undefined'){
    newSubRelations['is_Loading_relations'] = true
    console.log('addNewSubStatement', newSubRelations)
    const param = {
      relation_id: newSubRelations['id'] * 1
    }
    RelationAPI.post('/retrieve-tree', param).then(result => {
      if(result['data'].length){
        newSubRelations = result['data'][0]
      }
      parentRelation['relations'].push(newSubRelations)
      mapRelations()
    }).catch(error => {
      console.error(error)
      newSubRelations['is_Loading_relations'] = false
      mapRelations()
    })
    
  }else{
    newSubRelations['is_Loading_relations'] = false
    parentRelation['relations'].push(newSubRelations)
    mapRelations()
  }
}
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
  userFollowing: userFollowing,
  mapRelations: mapRelations,
  hideToolbarDialog: hideToolbarDialog,
  getRelationInstance: getRelationInstance,
  addNewSubStatement: addNewSubStatement,
  countUserFollowing: countUserFollowing
}
