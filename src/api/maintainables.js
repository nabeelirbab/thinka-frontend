import RelationTypeAPI from './relation-type'
import ScopeAPI from './scope'
export default {
  prepare: () => {
    return new Promise(resolve => {
      let countdown = 2
      const relationTypeParam = {
        select: ['description', 'symbol', 'relevance', 'relevance_window', 'default_impact'],
        sort: [{
          column: 'relevance',
          order: 'desc'
        }]
      }
      RelationTypeAPI.retrieve(relationTypeParam, true).then(() => {
        --countdown
        if(countdown === 0){
          resolve(true)
        }
      })

      const scopeParam = {
        select: ['description', 'degree', 'comment'],
        sort: [{
          column: 'degree',
          order: 'asc'
        }]
      }
      ScopeAPI.retrieve(scopeParam, true).then(() => {
        --countdown
        if(countdown === 0){
          resolve(true)
        }
      })
    })
  }
}