export default {
  url: (filename = '') => {
    console.log('process.env.VUE_APP_FILE_SERVER_URL', process.env.VUE_APP_FILE_SERVER_URL)
    if(typeof process.env.VUE_APP_FILE_SERVER_URL === 'undefined'){
      alert('System Error: ENV:VUE_APP_FILE_SERVER_URL is not set')
      return ''
    }else{
      return process.env.VUE_APP_FILE_SERVER_URL + filename
    }
  }
}