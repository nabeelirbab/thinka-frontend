
import API from '@/core/api'
class RelationType extends API {
  apiName = 'relation-type'
  createCachedDataLookUpById = true
}
export default new RelationType()
