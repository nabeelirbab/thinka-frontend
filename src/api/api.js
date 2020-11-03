export default class API {
  apiName
  mockAPI = {
    'statement': require('./mock-db/statement.js').default
  }
  retrieve(param = null){
    return new Promise((resolve) => {
      if(param === null){
        resolve(this.mockAPI[this.apiName]['entries'])
      }else if(typeof param === 'object'){
        if(typeof param['id'] !== 'undefined'){
          resolve((this.mockAPI[this.apiName]).getById(param['id'] * 1))
        }
      }
    })
  }
}
