<template>
  <div class="dropdown show">
    <!-- <button class="btn icon-size py-1 shadow-none" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More tree options.">
      <fa icon="ellipsis-v" />
    </button> -->
    <!-- <CircleIconButton icon="ellipsis-v" button-class="btn-light bg-whitesmoke text-primary" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More tree options."/> -->
    <button class="border-0 rounded bg-transparent" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More options."><fa icon="ellipsis-v" style="color:#02bcd4"/></button>

    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
      <router-link v-if="!isVirtualRelation" :to="'/branch/' + relation['id'] + '/t/' + toKebabCase(statementText.slice(0, 30))" class="dropdown-item"><fa icon="eye" /> Zoom</router-link>
      <button 
        @click="showVirtualRelationLinkages = true" 
        class="dropdown-item" 
      >
        <fa icon="link" /> Linkages
      </button>
      <button 
        @click="authenticationStatus === 'authenticated' ? (createSubStatementParentId = selectedStatementId) : null" 
        :active="createSubStatementParentId > 0" 
        :disabled="(authenticationStatus !== 'authenticated' || isVirtualRelation)" 
        class="dropdown-item" 
      >
        <fa icon="folder-plus" /> Add
      </button>
      <button 
        @click="editSelectedStatement = true" 
        :disabled="user === null || !selectedStatementId || isPublished || isVirtualRelation"
        class="dropdown-item"
      >
        <fa icon="edit" /> Edit
      </button>
      <button 
        @click="deleteStatement"  
        :disabled="(authenticationStatus !== 'authenticated')"
        class="dropdown-item"
      >
        <fa icon="folder-minus" /> Remove
      </button>
      <button 
        @click="enableDragging = true" 
        :disabled="user === null || !selectedStatementId || selectedStatementId * 1 === mainRelationId || isPublished || isVirtualRelation"
        class="dropdown-item"><fa icon="arrows-alt" /> Drag </button>
      <button
        v-if="level > 1"
        @click="openContextLock" 
        :disabled="user === null || !selectedStatementId || (selectedStatementId * 1 === mainRelationId) || isVirtualRelation"
        :title="user === null ? 'You need to login to use this feature' : 'Lock Context to Main Statement'" 
        class="dropdown-item"><fa icon="lock" /> Context Lock</button>
      <!-- <button
        @click="bookmark"
        class="dropdown-item"
      >
        <fa icon="leaf" /> Bookmark
      </button> -->
      <button
        @click="showScope = !showScope"
        class="dropdown-item"
      >
        <fa icon="microscope" /> Scope
      </button>
      <button
        v-if="isAuthor"
        @click="publish" 
        :disabled="isPublishing" 
        class="dropdown-item"
      >
        <span v-if="isPublishing">
          <fa  icon="spinner" spin /> Please waiit
        </span>
        <span v-else-if="isPublished">
          <fa  icon="briefcase" /> Unpublish
        </span>
        <span v-else >
          <fa  icon="sun" /> Publish
        </span>
      </button>
    </div>
  </div>
  <ContextLockModal ref="contextLockModal" />
  <Prompt ref="prompt" />
  <DeletePrompt ref="deletePrompt" />
</template>
<script>
import GlobalData from '@/views/statement/global-data'
import ContextLockModal from './ContextLockModal'
import CircleIconButton from '@/components/CircleIconButton'
import Prompt from '@/components/Prompt'
import Auth from '@/core/auth'
import RelationAPI from '@/api/relation'
import DeletePrompt from '../toolbar-components/DeletePrompt'
export default {
  components: {
    ContextLockModal,
    CircleIconButton,
    Prompt,
    DeletePrompt
  },
  props: {
    relation: {
      type: Object,
      required: true
    },
    level: Number
  },
  data(){
    return {
      ...GlobalData,
      authenticationStatus: Auth.status(),
      isPublishing: false,
      user: Auth.user()
    }
  },
  methods: {
    openContextLock(){
      this.$refs.contextLockModal._open()
    },
    deleteStatement(){
      this.$refs.deletePrompt._open()
    },
    publish(){
      if(this.user){
        this.proceedToPublish()
      }else{
        this.isPublishing = true
        this.$refs.logInModal._open(() => {
          this.isPublishing = true
          setTimeout(() => {
            if(this.user['id'] * 1 === this.relationUserId * 1){
              this.proceedToPublish()
            }else{
              this.nonAuthorPublish()
            }
          }, 1000)

        })
      }
    },
    proceedToPublish(){
      this.isPublishing = true
      const publishMessage = `
        <p>So you're ready to publish, well done! Currently this tree is private and so it can still be modified. Once published you will not be able to change your tree. So if you continue all the statements and logic will be fixed and will be visible to anyone.</p>
        <p>Are you sure you want to publish this statement now?</p>
      `
      const unpublishMessage = '<p>Unpublishing this statement will make it private and it can no longer be seen by other users</p>Are you sure you want to unplish this tree?'
      this.$refs.prompt._open(
        this.relation['published_at'] ? unpublishMessage: publishMessage,
        [{
          label: this.relation['published_at'] ? 'Unpublish': 'Publish',
          class: this.relation['published_at'] ? 'btn-danger' : 'btn-success',
          callback: () => {
            const param = {
              id: this.relation['id'],
              published_at: !this.relation['published_at'],
              sub_relations: []
            }
            RelationAPI.post('/publish', param).then(result => {
              if(result['data']){
                location.reload()
              }
            }).catch(error => {
              console.error(error)
              this.isPublishing = false
            })
          }
        }, {
          label: 'No',
          class: 'btn-outline-dark',
          callback: () => {
            this.isPublishing = false
          }
        }],
        this.relation['published_at'] ? 'Unpblishing Statement...' : 'Publishing Statement...'
      )
    },
  },
  computed: {
    statementText(){
      if(typeof this.relation === 'undefined'){
        return ''
      }else if(this.relation['statement']){
        return this.relation['statement']['text']
      }else if(this.relation['virtual_relation'] && typeof this.relation['virtual_relation']['statement'] !== 'undefined'){
        return this.relation['virtual_relation']['statement']['text']
      }else{
        return ''
      }
    },
    isVirtualRelation(){
      return this.relation && this.relation['is_virtual_relation']
    },
    isPublished(){
      return this.relation && this.relation['published_at']
    },
    isAuthor(){
      return this.user && this.relation && this.user.id === this.relation.user_id
    }
  }
}
</script>
