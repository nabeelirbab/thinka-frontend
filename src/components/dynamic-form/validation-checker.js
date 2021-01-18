export default {
  isEmail: (email) => {
    if(typeof email === 'undefined' || email === '' || email === null){
      return false
    }else{
      const atOccurance = email.match(/@/g)
      const atIndex = email.indexOf('@')
      return atOccurance && atIndex !== (email.length - 1) && atOccurance.length === 1
    }
  }
}