import { ref } from 'vue'
import axios from 'axios'

const localStorageKey = 'vue-jwt'
const authBasePath = (process.env.VUE_APP_API_URL).replace('v1', 'api')
const logInPath = authBasePath + 'login'
const refreshPath = authBasePath + 'refresh'
const userPath = authBasePath + 'user'

const authenticationStatus = ref('authenticating') // unauthenticated, authenticating, authenticated
const user = ref(null) // contains user session data
const isRefreshing = ref(false)
// const authReady = ref(false)
class Auth {
  refreshIntervalInstance
  constructor(){
    this.refreshIntervalInstance = null
  }
  user(){
    return user
  }
  status(){
    return authenticationStatus
  }
  generateHeader(){
    const storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
    if(storedAuth){
      return {
        headers: {
          'Authorization':  'Bearer ' + storedAuth['accessToken']
        }
      }
    }else{
      return {}
    }
  }
  chechAuth(){
    isRefreshing.value = false
    authenticationStatus.value = 'authenticating'
    if(localStorage.getItem(localStorageKey)){
      const storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
      const header = {
        headers: {
          'Authorization': storedAuth['tokenType'] + ' ' + storedAuth['accessToken']
        }
      }
      axios.post(userPath, {}, header).then(response => {
        const userData = response['data']['data']
        user.value = {
          id: userData['id'],
          email: userData['email'],
          status: userData['status'],
          first_name: userData['user_basic_information'] ? userData['user_basic_information']['first_name'] : null,
          last_name: userData['user_basic_information']['last_name'] ? userData['user_basic_information']['last_name'] : null
        }
        this.startSession(storedAuth['ttl'])
        authenticationStatus.value = 'authenticated'
      }).catch(error => {
        if(error.response.status === 401){
          authenticationStatus.value = 'unauthenticated'
        }else{
          console.log('an unknown error occured', error.response.status)
        }
      })
    }else{
      authenticationStatus.value = 'unauthenticated'
    }
  }
  startSession(ttl, immediate = true){
    isRefreshing.value = false
    clearInterval(this.refreshIntervalInstance)
    if(immediate){
      this.refreshToken()
    }else{
      setTimeout(() => {
        this.refreshToken()
      }, (ttl) * 1000)
    }
  }
  sessionExpired(){
    this.logout()
  }
  logout(){
    user.value = null
  }
  refreshToken(){
    if(localStorage.getItem(localStorageKey)){
      const storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
      const header = {
        headers: {
          'Authorization': storedAuth['tokenType'] + ' ' + storedAuth['accessToken']
        }
      }
      isRefreshing.value = true
      axios.post(refreshPath, {}, header).then(() => {
        isRefreshing.value = false
        // console.log('refresh', response)
        this.refreshIntervalInstance = setTimeout(() => {
          this.refreshToken()
        }, (storedAuth['ttl'] * 1) * 1000)
      }).catch(() => {
        isRefreshing.value = false
      })
    }else{
      authenticationStatus.value = 'unauthenticated'
      user.value = null
    }
  }
  logIn(email, password){
    return new Promise((resolve, reject) => {
      const parameter = { email: email, password: password }
      axios.post(logInPath, parameter).then(response => {
        const { token_type: tokenType, access_token: accessToken, user: userData, expires_in: ttl } = response['data']
        localStorage.setItem(localStorageKey, JSON.stringify({
          tokenType: tokenType,
          accessToken: accessToken,
          userId: userData['id'],
          ttl: ttl, // time to live in seconds
        }))
        user.value = userData
        this.startSession(ttl, false)
        resolve(userData)
      }).catch(error => {
        if(typeof error.response === 'undefined'){
          console.log(error)
        }
        const requestStatus = error.response.status
        const requestBody = error.response.data
        reject({
          status: parseInt(requestStatus),
          data: requestBody
        })
      })
    })
  }
}
const auth = new Auth()
export default auth
