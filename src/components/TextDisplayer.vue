<template>
    <template v-for="(formattedText, index) in formattedTextArray" :key="'tedisplayerext' + index + formattedText">
      <span v-html="formattedText" class="text-break"></span>&nbsp;
      <!-- <span style="hyphens:auto" v-html="formattedText"></span>&nbsp; -->
    </template>
</template>
<script>
export default {
  props: {
    text: String,
    textClass: {
      type: String,
      default: ''
    },
  },
  data(){
    return {
      formattedTextArray: [],
      // formattedTextIndexTypeLookUp: {} // determine text type by index
    }
  },
  methods: {
    generateFormattedText(){
      this.formattedTextArray = []
      const textSegments = this.text.split(' ')
      let currentText = ''
      textSegments.forEach(textSegment => {
        if(this.isUrl(textSegment)){
          const indexOfHttp = textSegment.indexOf('http')
          if(indexOfHttp !== 0){
            currentText += ' ' + textSegment.slice(0, indexOfHttp)
            textSegment = textSegment.slice(indexOfHttp)
          }
          if(currentText !== ''){
            this.formattedTextArray.push(currentText)
            currentText = ''
          }
          this.formattedTextArray.push(this.textToLink(textSegment))
        }else{
          currentText += ' ' + textSegment
        }
      })
      // this.formattedTextIndexTypeLookUp[this.formattedTextArray.length] = 'text'
      if(currentText !== ''){
        this.formattedTextArray.push(currentText)
        currentText = ''
      }
    },
    isUrl(text){
      if(text.indexOf('http://') >= 0 || text.indexOf('https://') >= 0){
        return true
      }else{
        return false
      }
    },
    textToLink(text){
      return `<a href="${text}" class="${this.textClass}" target="_blank">${text}</a>`
    }
  },
  watch: {
    text: {
      handler(){
        this.generateFormattedText()
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
</style>