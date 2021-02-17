const typeDescriptions = [
  'I have No Opinion',
  'I think Statement is False',
  'I think Statement is True but has no impact',
  'I think Statement is True and has Impact'
]
export default {
  typeDescriptions: typeDescriptions,
  convertToMessage: (type, confidence = 0) => {
    if(typeof typeDescriptions[type] === 'undefined'){
      return 'Unknown opinion'
    }
    let message = '"' + typeDescriptions[type]
    if(type){
      message += ` and I'm <em class="font-weight-bold">${(confidence * 100).toFixed(0)}%</em> confident about it`
    }
    return message
  }
}