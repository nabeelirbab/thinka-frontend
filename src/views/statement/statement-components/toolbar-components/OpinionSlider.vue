<template>
  <div class="d-flex align-items-center justify-content-center bg-white border border-secondary p-2 mb-1">
    <div class="pr-3 font-weight-bold">Opinion</div>
    <div class="text-center" style="width:250px">
      <vue-slider v-model="opinion" :min="-100" :max="100" style="width:150px; margin-left:20px"/>
      <div class="text-center">
        <span class="float-left">Disagree</span>
        <span >Neutral</span>
        <span class="float-right">Agree</span>
      </div>
    </div>
    <div class="pl-1 mr-1">{{opinion}}%</div>
    <input type="checkbox" class=""/>
  </div>
</template>
<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

export default {
  components: {
    VueSlider
  },
  data(){
    return {
      opinion: 0
    }
  }
}
</script>
