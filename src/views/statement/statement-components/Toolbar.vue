<template>
  <div class="">
    <div class="fixed-bottom px-2 px-md-4" style="padding-bottom:72px">
      <ImpactSlider v-if="showImpact" />
      <OpinionSlider v-if="showOpinion" />
      <ScopeSlider v-if="showScope" />
    </div>
    <div :class="selectedStatementId === 0 ? 'active' : ''" class="toolbar d-flex justify-content-between justify-content-md-center fixed-bottom bg-white py-2 px- border-top">
      <CircleIconButton 
        @click="showImpact = !showImpact" 
        :active="showImpact" 
        icon="certificate" text="Impact" title="Show Impact" class="mx-2" />
      <CircleIconButton 
        @click="showOpinion = !showOpinion" 
        :active="showOpinion" 
        icon="comment-dots" text="Opinion" title="Show Opinion" class="mx-2" />
      <CircleIconButton 
        @click="showScope = !showScope" 
        :active="showScope" 
        icon="microscope" text="Scope" title="Show Scope" class="mx-2" />
      <CircleIconButton @click="createSubStatementParentId = selectedStatementId" :active="createSubStatementParentId > 0" icon="folder-plus" text="Add" title="Add Statement" class="mx-2" />
      <CircleIconButton icon="folder-minus" text="Remove" title="Remove Statement" class="mx-2" />
    </div>
  </div>
</template>
<script>
import CircleIconButton from '@/components/CircleIconButton'
import GlobalData from '../global-data'
import ImpactSlider from './toolbar-components/ImpactSlider'
import OpinionSlider from './toolbar-components/OpinionSlider'
import ScopeSlider from './toolbar-components/ScopeSlider'
export default {
  components: {
    CircleIconButton,
    ImpactSlider,
    OpinionSlider,
    ScopeSlider,
  },
  data(){
    return {
      ...GlobalData
    }
  }
}
</script>
<style scoped>
  .toolbar {
  top: calc(100% - 70px);
  transition: all .3s ease-out;
  background: #428bca;
}
.toolbar.active {
  top: 100%;
}
</style>