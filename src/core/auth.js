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
  storedAuth = null
  constructor(){
    this.refreshIntervalInstance = null
  }
  user(){
    return user
  }
  status(){
    return authenticationStatus
  }
  isRefreshing(){
    return isRefreshing.value
  }
  generateHeader(){
    this.storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
    // if(this.storedAuth === null && localStorage.getItem(localStorageKey)){
    // }
    if(this.storedAuth){
      return {
        headers: {
          'Authorization':  'Bearer ' + (this.storedAuth ? this.storedAuth['accessToken'] : null)
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
          'Authorization': 'Bearer ' + storedAuth['accessToken']
        }
      }
      axios.post(userPath, {}, header).then(response => {
        const userData = response['data']['data']
        user.value = {
          id: userData['id'],
          username: userData['username'],
          email: userData['email'],
          status: userData['status'],
          first_name: userData['user_basic_information'] ? userData['user_basic_information']['first_name'] : null,
          last_name: userData['user_basic_information']['last_name'] ? userData['user_basic_information']['last_name'] : null
        }
        this.storedAuth = storedAuth
        this.startSession()
        authenticationStatus.value = 'authenticated'
      }).catch(error => {
        if(typeof error.response === 'undefined'){
          console.error('Maybe there is internet connection problem')
          authenticationStatus.value = 'unauthenticated'
        }else if(error.response.status === 401){
          authenticationStatus.value = 'unauthenticated'
        }else{
          console.error('an unknown error occured', error.response.status)
        }
      })
    }else{
      authenticationStatus.value = 'unauthenticated'
    }
  }
  startSession(){
    // ttl = ttl * 0.85
    isRefreshing.value = false
    clearInterval(this.refreshIntervalInstance)
    // const timePassedSinceTokenCreated = new Date() - new Date(this.storedAuth['date']) // miliseconds
    // let remainingTTL = timePassedSinceTokenCreated > ttl ? 0 : ttl - timePassedSinceTokenCreated
    // console.log('startSession', remainingTTL, ttl, this.storedAuth['date'])
    // setTimeout(() => {
    //   this.refreshToken()
    // }, remainingTTL)
    this.refreshToken()
  }
  sessionExpired(){
    this.logout()
  }
  logout(){
    return new Promise((resolve) => {
      user.value = null
      localStorage.removeItem(localStorageKey)
      authenticationStatus.value = 'unauthenticated'
      resolve(true)
    })
  }
  refreshToken(){
    if(localStorage.getItem(localStorageKey)){
      this.storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
      const ttl = this.storedAuth['ttl'] * 1
      const timePassedSinceTokenCreated = new Date() - new Date(this.storedAuth['date']) // miliseconds
      let remainingTTL = timePassedSinceTokenCreated > ttl ? 0 : ttl - timePassedSinceTokenCreated
      console.log('startSession', remainingTTL, ttl, this.storedAuth['date'])
      if(remainingTTL){
        setTimeout(() => {
          this.refreshToken()
        }, remainingTTL)
      }else{
        console.log('refreshing')
        const storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
        const header = {
          headers: {
            'Authorization': 'Bearer ' + storedAuth['accessToken'] // storedAuth['tokenType'] + ' ' + storedAuth['accessToken']
          }
        }
        isRefreshing.value = true
        axios.post(refreshPath, {}, header).then(result => {
          storedAuth['accessToken'] = result['data']['token']
          storedAuth['date'] = new Date()
          localStorage.setItem(localStorageKey, JSON.stringify(storedAuth))
          this.storedAuth = storedAuth
          isRefreshing.value = false
          this.refreshIntervalInstance = setTimeout(() => {
            this.refreshToken()
          }, storedAuth['ttl'] * 0.85)
        }).catch(() => {
          isRefreshing.value = false
          authenticationStatus.value = 'unauthenticated'
          user.value = null
        })
      }
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
        this.storedAuth = {
          tokenType: tokenType,
          accessToken: accessToken,
          userId: userData['id'],
          ttl: ttl * 60000,// ttl * 60000, // time to live in seconds. TTL from server is in minutes
          date: new Date()
        }
        localStorage.setItem(localStorageKey, JSON.stringify(this.storedAuth))
        let userInformation = userData['user']
        user.value = {
          id: userData['id'],
          email: userData['email'],
          status: userData['status'],
          first_name: userInformation['first_name'],
          last_name: userInformation['last_name']
        }
        authenticationStatus.value = 'authenticated'
        this.startSession()
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
