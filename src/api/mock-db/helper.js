export default {
  getParent(entryParentId, parentDB){
    return parentDB.getById(entryParentId)
  }
}
