import RelationTypeAPI from './relation-type'
export default {
  prepare: () => {
    return new Promise(resolve => {
      const relationTypeParam = {
        select: ['description', 'symbol', 'relevance']
      }
      RelationTypeAPI.retrieve(relationTypeParam, true).then(() => {
        resolve(true)
      })
    })
  }
}