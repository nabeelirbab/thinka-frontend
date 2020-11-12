export default {
  methods: {
    findArrayIndex(value, array, key = null){
      for(let x in array){
        if(key && array[x][key] === value){
          return x
        }else if(array[x] === value){
          return x
        }
      }
      return -1
    },
    formatDate(date, format = null){
      const dateToFormat = new Date(date)
      if(date && dateToFormat.getFullYear() !== 1970){
        switch(format){
          default:
            return dateToFormat.getMonth() + '/' + dateToFormat.getDate() + '/' + dateToFormat.getFullYear()
        }
      }else{
        return null
      }
    }
  }
}
