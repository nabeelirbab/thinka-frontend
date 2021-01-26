<template>
  <div class="">
    
    <div  class="fixed-bottom px-2 px-md-4" style="padding-bottom:72px">
      <!-- Only the authors -->
      <template v-if="user && selectedStatementData && selectedStatementData['user_id'] * 1 === user['id'] * 1">
        <ImpactSlider v-if="showImpact" />
        <ScopeSlider v-if="showScope" />
      </template>
      <!-- Must be logged in user -->
      <template v-if="user">
        <OpinionSlider v-if="showOpinion" />
      </template>
    </div>
    <div :class="selectedStatementId === 0 || selectedStatementId === null ? 'active' : ''" class="toolbar d-flex justify-content-between justify-content-md-center fixed-bottom bg-white py-2 px- border-top">
      <CircleIconButton
        @click="showImpact = !showImpact" 
        :active="showImpact" 
        icon="certificate" text="Impact" title="Show Impact" class="mx-2" data-bs-toggle="tooltip" data-bs-placement="top" />
      <CircleIconButton
        @click="showOpinion = !showOpinion" 
        :active="showOpinion" 
        icon="comment-dots" text="Opinion" title="Show Opinion" class="mx-2" data-bs-toggle="tooltip" data-bs-placement="top" />
      <CircleIconButton
        @click="showScope = !showScope" 
        :active="showScope" 
        icon="microscope" text="Scope" title="Show Scope" class="mx-2" data-bs-toggle="tooltip" data-bs-placement="top" />
      <CircleIconButton
        v-if="!isMainRelationSelected"
        @click="authenticationStatus === 'authenticated' ? (createSubStatementParentId = selectedStatementId) : null" 
        :active="createSubStatementParentId > 0" 
        :disabled="!(authenticationStatus === 'authenticated')" 
        icon="folder-plus" :text="'Add'" title="Add Statement" class="mx-2" data-bs-toggle="tooltip" data-bs-placement="top"
      />
      <CircleIconButton
        v-else
        @click="isUserAuthor ? (editSelectedStatement = true) : null" 
        :active="editSelectedStatement" 
        :disabled="(!isUserAuthor)" 
        icon="edit" :text="'Edit'" title="Add Statement" class="mx-2" data-bs-toggle="tooltip" data-bs-placement="top"
      />
      <CircleIconButton
        @click="deleteStatement"  
        :disabled="authenticationStatus !== 'authenticated' ? true : false" 
        icon="folder-minus" text="Remove" title="Remove Statement" class="mx-2" data-bs-toggle="tooltip" data-bs-placement="top"
      />
    </div>
    <DeletePrompt ref="deletePrompt" />
  </div>
</template>
<script>
import CircleIconButton from '@/components/CircleIconButton'
import GlobalData from '../global-data'
import ImpactSlider from './toolbar-components/ImpactSlider'
import OpinionSlider from './toolbar-components/OpinionSlider'
import ScopeSlider from './toolbar-components/ScopeSlider'
import Auth from '@/core/auth'
import DeletePrompt from './toolbar-components/DeletePrompt'
export default {
  components: {
    CircleIconButton,
    ImpactSlider,
    OpinionSlider,
    ScopeSlider,
    DeletePrompt
  },
  data(){
    return {
      authenticationStatus: Auth.status(),
      user: Auth.user(),
      ...GlobalData
    }
  },
  methods: {
    deleteStatement(){
      this.$refs.deletePrompt._open()
    }
  },
  computed: {
    isUserAuthor(){ // true if the user author the selected statement
      return this.selectedStatementId && this.selectedStatementData['user_id'] * 1 === this.user.id
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