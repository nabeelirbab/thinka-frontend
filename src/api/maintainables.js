import RelationTypeAPI from './relation-type'
import ScopeAPI from './scope'
import ContextAPI from './context'
import StatementTypeAPI from './statement-type'
export default {
  prepare: () => {
    return new Promise(resolve => {
      let countdown = 4
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
      const contextParam = {
        select: ['description'],
        sort: [{
          column: 'id',
          order: 'asc'
        }]
      }
      ContextAPI.retrieve(contextParam, true).then(() => {
        --countdown
        if(countdown === 0){
          resolve(true)
        }
      })
      const statementTypeParam = {
        select: ['description', 'explanation'],
        sort: [{
          column: 'id',
          order: 'asc'
        }]
      }
      StatementTypeAPI.retrieve(statementTypeParam, true).then(() => {
        --countdown
        if(countdown === 0){
          resolve(true)
        }
      })
    })
  }
}