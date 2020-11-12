import API from '@/core/api'
class StatementType extends API {
  apiName = 'statement-type'
  get(param = null){
    return this.retrieve(param)
  }
}
export default new StatementType()
