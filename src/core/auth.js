import { ref, watch } from 'vue'
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
watch(isRefreshing, (value) => {
  console.log('watcher refresh', value)
  localStorage.setItem(localStorageKey + '-is-refreshing', value)
})
class Auth {
  refreshIntervalInstance
  storedAuth = null
  refreshAttemptCount = 0 // attempt to rerefresh after a faild refresh
  constructor(){
    this.refreshIntervalInstance = null
    window.addEventListener('storage', (e) => {
      console.log('storage', e.key)
      if(e.key === localStorageKey){ // session in localstorage has been changed
        if(e.newValue){
          this.storedAuth = JSON.parse(e.newValue)
        }else{
          this.storedAuth = {
            accessToken: null,
            ttl: null,
            date: null,
          }
        }
      }else if(e.key === localStorageKey + '-is-refreshing'){
        console.log('listner refresh', e.newValue)
        isRefreshing.value = e.newValue
      }
    })
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
    // this.storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
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
        console.log('userData', userPath, userData)
        user.value = {
          id: userData['id'],
          username: userData['username'],
          email: userData['email'],
          status: userData['status'],
          user_profile_photo: userData['user_profile_photo'] ? userData['user_profile_photo']['file_name'] : null,
          first_name: userData['user_basic_information'] ? userData['user_basic_information']['first_name'] : null,
          last_name: userData['user_basic_information']['last_name'] ? userData['user_basic_information']['last_name'] : null,
          // profile_photo_file_name: userData['user_basic_information']['profile_photo_file_name']
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
    isRefreshing.value = false
    clearInterval(this.refreshIntervalInstance)
    this.refreshToken()
  }
  sessionExpired(){
    this.logout()
  }
  logout(){
    localStorage.removeItem('search_page_filter')
    localStorage.removeItem('search_page_result_cache')
    return new Promise((resolve) => {
      user.value = null
      localStorage.removeItem(localStorageKey)
      authenticationStatus.value = 'unauthenticated'
      resolve(true)
    })
  }
  refreshToken(){
    if(localStorage.getItem(localStorageKey)){
      // this.storedAuth = JSON.parse(localStorage.getItem(localStorageKey))
      const ttl = this.storedAuth['ttl'] * 0.85
      const timePassedSinceTokenCreated = new Date() - new Date(this.storedAuth['date']) // miliseconds
      let remainingTTL = timePassedSinceTokenCreated > ttl ? 0 : ttl - timePassedSinceTokenCreated
      if(remainingTTL || isRefreshing.value){
        setTimeout(() => {
          this.refreshToken()
        }, remainingTTL ? remainingTTL : 2000)
      }else{
        console.log('refreshing')
        const storedAuth = this.storedAuth
        const currentToken = storedAuth['accessToken']
        const  header = {
          headers: {
            'Authorization': 'Bearer ' + currentToken // storedAuth['tokenType'] + ' ' + storedAuth['accessToken']
          }
        }
        isRefreshing.value = true
        axios.post(refreshPath, {}, header).then(result => {
          console.log('refresh is successful')
          storedAuth['accessToken'] = result['data']['token']
          storedAuth['date'] = new Date()
          localStorage.setItem(localStorageKey, JSON.stringify(storedAuth))
          this.storedAuth = storedAuth
          isRefreshing.value = false
          this.refreshIntervalInstance = setTimeout(() => {
            this.refreshToken()
          }, storedAuth['ttl'] * 0.85)
        }).catch(() => {
          console.log('failed to refresh')
          if(currentToken !== this.storedAuth['accessToken']){ // token has been changed
            console.log('new token detected')
            this.refreshIntervalInstance = setTimeout(() => {
              this.refreshToken()
            }, storedAuth['ttl'] * 0.85)
          }else{
            console.log('token invalid')
            authenticationStatus.value = 'unauthenticated'
            user.value = null
          }
          isRefreshing.value = false
        })
      }
    }else{
      authenticationStatus.value = 'unauthenticated'
      user.value = null
    }
  }
  isTokenValid(){
    console.log('is token valid?')
    return new Promise((resolve, reject) => {
      const sessionJSON = localStorage.getItem(localStorageKey)
      if(sessionJSON && typeof this.storedAuth['accessToken'] !== 'undefined'){
        this.storedAuth = JSON.parse(sessionJSON)
        const header = {
          headers: {
            'Authorization': 'Bearer ' + this.storedAuth['accessToken'] // storedAuth['tokenType'] + ' ' + storedAuth['accessToken']
          }
        }
        axios.post(userPath, {}, header).then(response => {
          const userData = response['data']['data']
          resolve(userData)
        }).catch(() => {
          reject(false)
        })
      }else{
        reject(false)
      }
      
    })
  }
  logIn(email, password){
    localStorage.removeItem('search_page_filter')
    localStorage.removeItem('search_page_result_cache')
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
          last_name: userInformation['last_name'],
          profile_photo_file_name: userInformation['profile_photo_file_name']
        }
        console.log('login', userInformation)
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
