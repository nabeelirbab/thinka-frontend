const typeDescriptions = [
  'I have no explicit opinion.',
  'I think the statement is false', // thumbs down
  'I think the statement is true', // but has no impact', // point
  'I think the statement is true' // and has Impact' // thumbs up
]
//I think the statement is true and has a 100% supportives impact and I'm 100% confident about it.
export default {
  typeDescriptions: typeDescriptions,
  convertToMessage: (type, confidence = 0, impact = null) => {
    if(typeof typeDescriptions[type] === 'undefined'){
      return 'Unknown opinion'
    }
    let message = '"' + typeDescriptions[type]
    //impact
    if(impact !== null && type > 0){
      if(impact === 0){
        message += ' and has no impact'
      }else {
        let percent_impact = (impact * 100).toFixed(0)

        let magnitude_message = ''
        if (impact == 1 || impact == -1)
          magnitude_message = " and makes a critical"
        else if (impact * impact >= 0.25)
          magnitude_message = " and makes a strong"
        else
          magnitude_message = ` and makes a <em class="font-weight-bold">${percent_impact}%</em>`

        if(impact < 0){
          message += ` ${magnitude_message} counter impact`
        }else if(impact > 0){
          message += ` ${magnitude_message} supportive impact`
        }
      } // impact == 0
    }
    // confidence
    if(type){
      message += ` with <em class="font-weight-bold"> ${(confidence * 100).toFixed(0)}%</em> confidence.`
    }
    return message
  }
}
