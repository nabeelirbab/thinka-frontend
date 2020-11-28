import API from '@/core/api'
class UserRelationBookmark extends API {
  apiName = 'user-relation-bookmark'
  toggleBookmark(bookmarkId, relationId){
    if(bookmarkId){
      return this.deleteBookmark(bookmarkId) // return null if success, bookmarkId if failed
    }else if(relationId){
      return this.bookmark(relationId)
    }
  }
  checkIfBookmarked(relationId){
    const param = {
      select: ['id', 'user_id', 'relation_id'],
      condition: [{
        column: 'relation_id',
        value: relationId
      }]
    }
    return new Promise((resolve, reject) => {
      this.retrieve(param).then(result => {
        resolve(result['data'] && result['data'].length ? result['data'][0]['id'] : null)
      }).catch(error => {
        reject(error)
      })
    })
  }
  bookmark(relationId){
    const param = {
      relation_id: relationId
    }
    return new Promise((resolve, reject) => {
      this.create(param).then(result => {
        if(result['data']){
          resolve(result['data']['id'])
        }else{
          resolve(null)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
  deleteBookmark(bookmarkId){
    const param = {
      id: bookmarkId
    }
    return new Promise((resolve, reject) => {
      this.delete(param).then(result => {
        console.log('delete bookmark', result)
        resolve(result['data'] && result['data']['id'] ? null : bookmarkId)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
const statement = new UserRelationBookmark()
export default statement
