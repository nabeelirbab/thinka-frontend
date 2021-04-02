const typeDescriptions = [
  'I have No Opinion',
  'I think Statement is false', // thumbs down
  'I think Statement is true', // but has no impact', // point
  'I think Statement is true' // and has Impact' // thumbs up
]
//I think the statement is true and has a 100% proving impact and I'm 100% confident about it
export default {
  typeDescriptions: typeDescriptions,
  convertToMessage: (type, confidence = 0, impact = null) => {
    if(typeof typeDescriptions[type] === 'undefined'){
      return 'Unknown opinion'
    }
    let message = '"' + typeDescriptions[type]
    //impact
    if(impact !== null){
      if(impact === 0){
        message += ' and has no impact'
      }else if(impact < 0){
        message += ` and has <em class="font-weight-bold">${(impact * -100).toFixed(0)}%</em> disproving impact`
      }else if(impact > 0){
        message += ` and has <em class="font-weight-bold">${(impact * 100).toFixed(0)}%</em> proving impact`
      }
    }
    // confidence
    if(type){
      message += ` and I'm <em class="font-weight-bold">${(confidence * 100).toFixed(0)}%</em> confident about it`
    }
    return message
  }
}