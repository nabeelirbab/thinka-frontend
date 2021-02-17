import API from '@/core/api'
class Statement extends API {
  apiName = 'statement'
  get(param = null){
    return this.retrieve(param)
  }
  retrieveTree(statementId){
    this.post('/retrieve-tree', {id: statementId})
  }
}
const statement = new Statement()
export default statement
