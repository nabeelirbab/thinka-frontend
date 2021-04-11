<template>
  <span :title="relationTypeDescription" class="badge badge-pill" style="background-color: #d7e8e9;">
    <span>{{relationTypeSymbol}} {{relationTypeName}}</span>
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
    },
    relationTypeName(){
      const relationTypeId = this.relationTypeId
      if(typeof relationTypeId === 'number'){
        const relationTypeIndex = this.findArrayIndex(relationTypeId * 1, this.relationTypes, 'id')
        if(relationTypeIndex >= 0){
          return this.relationTypes[relationTypeIndex]['name']
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
