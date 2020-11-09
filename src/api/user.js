import API from '@/core/api'
class User extends API {
  apiName = 'user'
  register(userData){
    return this.apiRequest('user/register', userData)
  }
}
const api = new User()
export default api
