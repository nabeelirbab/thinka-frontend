import API from '@/core/api'
class StatementType extends API {
  apiName = 'statement-type'
  createCachedDataLookUpById = true
  get(param = null){
    return this.retrieve(param)
  }
}
export default new StatementType()
