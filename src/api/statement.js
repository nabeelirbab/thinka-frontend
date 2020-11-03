import API from './api'
class Statement extends API {
  apiName = 'statement'
  get(param = null){
    return this.retrieve(param)
  }
}
const statement = new Statement()
export default statement
