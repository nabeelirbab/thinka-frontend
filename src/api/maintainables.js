import RelationTypeAPI from './relation-type'
import ScopeAPI from './scope'
export default {
  prepare: () => {
    return new Promise(resolve => {
      const relationTypeParam = {
        select: ['description', 'symbol', 'relevance'],
        sort: [{
          column: 'relevance',
          order: 'desc'
        }]
      }
      RelationTypeAPI.retrieve(relationTypeParam, true).then(() => {
        resolve(true)
      })

      const scopeParam = {
        select: ['description', 'degree', 'comment'],
        sort: [{
          column: 'degree',
          order: 'asc'
        }]
      }
      ScopeAPI.retrieve(scopeParam, true).then(() => {
        resolve(true)
      })
    })
  }
}