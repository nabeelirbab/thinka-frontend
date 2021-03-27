import axios from 'axios'
import Auth from '@/core/auth'
import { ref } from 'vue'
export default class API {
  apiName
  createCachedDataLookUpById = false
  cachedDataLookUpById = ref({})
  cachedData = ref(null) // stores all data retrieved here for reusing
  basePath = process.env.VUE_APP_API_URL // . 'http://localhost/thinka-api/public/api/'
  mockAPI = {
    'statement': require('../api/mock-db/statement.js').default
  }
  preFormattedSelect = {}
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
      this.post('/retrieve', parameter).then(response => {
        if(cache){
          this.cachedData.value = response
          if(this.createCachedDataLookUpById){
            this.cachedDataLookUpById.value = {}
            if(this.cachedData.value['data'].length){
              this.cachedData.value['data'].forEach(entry => {
                this.cachedDataLookUpById.value[entry['id']] = entry
              })
            }
            
          }
        }
        resolve(response)
      }).catch(errorResult => {
        if(typeof errorResult.response === 'undefined'){
          console.log('Internet connection')
        }else if(errorResult.response.status === 401){
          Auth.sessionExpired()
          // alert('Session Expired')
        }
        reject(errorResult)
      })
    })
  }
  getPreFormattedSelect(select){
    return typeof this.preFormattedSelect[select] !== 'undefined' ? this.preFormattedSelect[select] : {}
  }
  create(parameter){
    return new Promise((resolve, reject) => {
      this.post('/create', parameter).then(response => {
        resolve(response)
      }).catch(errorResult => {
        reject(errorResult)
      })
    })
  }
  update(parameter){
    return new Promise((resolve, reject) => {
      this.post('/update', parameter).then(response => {
        resolve(response)
      }).catch(errorResult => {
        reject(errorResult)
      })
    })
  }
  delete(parameter){
    return new Promise((resolve, reject) => {
      this.post('/delete', parameter).then(response => {
        resolve(response)
      }).catch(errorResult => {
        reject(errorResult)
      })
    })
  }
  // apiRequest(path, parameter){
  //   return new Promise((resolve, reject) => {
  //     axios.post(this.basePath + path, parameter).then(response => {
  //       resolve(response['data'])
  //     }).catch(errorResult => {
  //       reject(errorResult)
  //     })
  //   })
  // }
  async post(path, parameter = {}){
    return new Promise((resolve, reject) => {
      (async () => {
        while(Auth.isRefreshing()){
          await this.sleep(300)
          // console.log('sleeping', Auth.isRefreshing())
        }
        // console.log('Auth.generateHeader()', Auth.generateHeader())
        axios.post(this.basePath + this.apiName + path, parameter, Auth.generateHeader()).then(response => {
          resolve(response['data'])
        }).catch(errorResult => {
          if(errorResult.response.status === 401){
            Auth.sessionExpired()
            // alert('Session Expired')
          }
          reject(errorResult)
        })
      })()
      
    })
  }
  async sleep(milliseconds){
    await new Promise(r => setTimeout(r, milliseconds))
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
