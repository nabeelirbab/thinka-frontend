const months = ['January', "February", 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export default {
  methods: {
    findArrayIndex(value, array, key = null){
      for(let x in array){
        if(key && array[x][key] + '' === value + ''){
          return x
        }else if(array[x] === value){
          return x
        }
      }
      return -1
    },
    toHourMedian(datetime){
      var hours = datetime.getHours();
      var minutes = datetime.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    },
    formatDate(date, format = null){
      const dateToFormat = new Date(date)
      if(date && dateToFormat.getFullYear() !== 1970){
        switch(format){
          case 'M d at H:m':
            return months[dateToFormat.getMonth()] + ' ' + dateToFormat.getDate() + ', ' + dateToFormat.getFullYear() + ' at ' + this.toHourMedian(dateToFormat)
          default:
            return dateToFormat.getMonth() + '/' + dateToFormat.getDate() + '/' + dateToFormat.getFullYear()
        }
      }else{
        return null
      }
    },
    timeSince(date) {
      date = new Date(date)
      let seconds = Math.floor((new Date() - date) / 1000)
      let interval = seconds / 31536000
      if (interval > 1) {
        return Math.floor(interval) + " year" + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
      }
      interval = seconds / 2592000
      if (interval > 1) {
        return Math.floor(interval) + " month" + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
      }
      interval = seconds / 86400
      if (interval > 1) {
        return Math.floor(interval) + " day" + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
      }
      interval = seconds / 3600
      if (interval > 1) {
        return Math.floor(interval) + " hour" + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
      }
      interval = seconds / 60
      if (interval > 1) {
        return Math.floor(interval) + " minute" + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
      }
      return Math.floor(seconds) + " second" + (Math.floor(interval) > 1 ? 's' : '') + ' ago'
    },
    toPascal(s){
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
	
    toKebabCase(s){
      return s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('-')
    },
    userBasicInformationFullName(userBasicInformation){
      return this.toPascal(userBasicInformation['first_name']) + ' ' + this.toPascal(userBasicInformation['last_name'])
    }
  }
}
