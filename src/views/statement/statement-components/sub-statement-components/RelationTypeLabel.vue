<template>
  <span :title="relationTypeDescription" class="text-primary ">
    <span :style="relationTypeSymbolStyle" class="font-weight-bold" style="float:left">{{relationTypeSymbol}}</span>

    <span class="pl-1">{{relationTypeDescription}}</span>
  </span>
</template>
<script>
import RelationTypeAPI from '@/api/relation-type'
export default {
  props: {
    relationTypeId: Number
  },
  computed: {
    relationTypes(){
      return RelationTypeAPI.cachedData && RelationTypeAPI.cachedData.value['data'] ? RelationTypeAPI.cachedData.value['data'] : []
    },
    relationTypeSymbolStyle(){
      if(this.relationTypeSymbol && this.relationTypeSymbol !== '??'){
        switch(this.relationTypeSymbol){
          case '+':
            return {
              'font-size': '1.3em',
              'line-height': '1.2em'
            }
          case '-':
            return {
              'font-size': '1.4em',
              'line-height': '1.0em'
            }
          case '*':
            return {
              // 'font-size': '1.4em',
              'line-height': '1.8em'
            }
          case '^':
            return {
              // 'font-size': '1.4em',
              'line-height': '1.8em'
            }
          default:
            return '1em'
        }
      }else{
        return '1em'
      }
    },
    relationTypeSymbol(){
      const relationTypeId = this.relationTypeId
      if(typeof relationTypeId === 'number'){
        const relationTypeIndex = this.findArrayIndex(relationTypeId * 1, this.relationTypes, 'id')
        if(relationTypeIndex >= 0){
          return this.relationTypes[relationTypeIndex]['symbol']
        }else{
          return '??'
        }
      }else{
        return 0
      }
    },
    relationTypeDescription(){
      const relationTypeId = this.relationTypeId
      if(typeof relationTypeId === 'number'){
        const relationTypeIndex = this.findArrayIndex(relationTypeId * 1, this.relationTypes, 'id')
        if(relationTypeIndex >= 0){
          return this.relationTypes[relationTypeIndex]['description']
        }else{
          return 'Unknow'
        }
      }else{
        return 0
      }
    }
  }
}
</script>