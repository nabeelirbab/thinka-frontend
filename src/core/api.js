import axios from 'axios'
import Auth from '@/core/auth'
import { ref } from 'vue'
export default class API {
  apiName
  cachedData = ref(null) // stores all data retrieved here for reusing
  basePath = process.env.VUE_APP_API_URL // . 'http://localhost/thinka-api/public/api/'
  mockAPI = {
    'statement': require('../api/mock-db/statement.js').default
  }
  // retrieve(param = null){
  //   return new Promise((resolve) => {
  //     if(param === null){
  //       resolve(this.mockAPI[this.apiName]['entries'])
  //     }else if(typeof param === 'object'){
  //       if(typeof param['id'] !== 'undefined'){
  //         resolve((this.mockAPI[this.apiName]).getById(param['id'] * 1))
  //       }
  //     }
  //   })
  // }
  retrieve(parameter = {}, cache = false){
    return new Promise((resolve, reject) => {
      axios.post(this.basePath + this.apiName + '/retrieve', parameter, Auth.generateHeader()).then(response => {
        if(cache){
          this.cachedData.value = response['data']
        }
        resolve(response['data'])
      }).catch(errorResult => {
        if(errorResult.response.status === 401){
          Auth.sessionExpired()
          // alert('Session Expired')
        }
        reject(errorResult)
      })
    })
  }
  create(parameter){
    return new Promise((resolve, reject) => {
      axios.post(this.basePath + this.apiName + '/create', parameter, Auth.generateHeader()).then(response => {
        resolve(response['data'])
      }).catch(errorResult => {
        reject(errorResult)
      })
    })
  }
  update(parameter){
    return new Promise((resolve, reject) => {
      axios.post(this.basePath + this.apiName + '/update', parameter, Auth.generateHeader()).then(response => {
        resolve(response['data'])
      }).catch(errorResult => {
        reject(errorResult)
      })
    })
  }
  delete(parameter){
    return new Promise((resolve, reject) => {
      axios.post(this.basePath + this.apiName + '/delete', parameter, Auth.generateHeader()).then(response => {
        resolve(response['data'])
      }).catch(errorResult => {
        reject(errorResult)
      })
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
  post(path, parameter = {}){
    return new Promise((resolve, reject) => {
      axios.post(this.basePath + this.apiName + path, parameter, Auth.generateHeader()).then(response => {
        resolve(response['data'])
      }).catch(errorResult => {
        if(errorResult.response.status === 401){
          Auth.sessionExpired()
          // alert('Session Expired')
        }
        reject(errorResult)
      })
    })
  }
  fileUpload(uploadLocation, uploadForm){
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: uploadLocation,
        data: uploadForm,
        headers: {'Content-Type': 'multipart/form-data' }
      })
      .then(function (response) {
        resolve(response['data'])
      })
      .catch(function (response) {
          reject(response)
      });
    })
  }
}
