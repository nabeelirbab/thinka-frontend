<template>
  <div class="d-flex align-items-center justify-content-center bg-white border border-secondary p-2 mb-1 pb-4">
    <div class="pr-3 font-weight-bold">Scope</div>
    <div class="text-center mr-2" style="width:250px">
      <vue-slider v-model="scope" :v-data="scaleInterval" :marks="true"/>
    </div>
    <div>{{scope}}</div>
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
      scope: 'None',
      scaleInterval: ['None', 'Half', 'All'],
    }
  }
}
</script>
