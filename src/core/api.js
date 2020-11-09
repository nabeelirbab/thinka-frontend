import axios from 'axios'
export default class API {
  apiName
  basePath = process.env.VUE_APP_API_URL // . 'http://localhost/thinka-api/public/api/'
  mockAPI = {
    'statement': require('../api/mock-db/statement.js').default
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
  apiRequest(path, parameter){
    return new Promise((resolve, reject) => {
      axios.post(this.basePath + path, parameter).then(response => {
        resolve(response['data'])
      }).catch(errorResult => {
        reject(errorResult)
      })
    })
  }
}
