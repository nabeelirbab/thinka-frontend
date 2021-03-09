import API from '@/core/api'
class User extends API {
  apiName = 'user'
  register(userData){
    return this.post('/register', userData)
  }
}
const api = new User()
export default api
