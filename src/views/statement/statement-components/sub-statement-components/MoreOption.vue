<template>
  <div class="dropdown show">
    <!-- <button class="btn icon-size py-1 shadow-none" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More tree options.">
      <fa icon="ellipsis-v" />
    </button> -->
    <!-- <CircleIconButton icon="ellipsis-v" button-class="btn-light bg-whitesmoke text-primary" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More tree options."/> -->
    <button class="border-0 rounded bg-transparent" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="More options."><fa icon="ellipsis-v" style="color:#02bcd4"/></button>

    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink">
      <router-link :to="'/branch/' + relation['id'] + '/t/' + toKebabCase(relation['statement']['text'].slice(0, 30))" class="dropdown-item"><fa icon="eye" /> Zoom</router-link>
      <button @click="editSelectedStatement = true" :disabled="user === null || !selectedStatementId || (selectedStatementId && selectedStatementData['published_at'])" class="dropdown-item" href="#"><fa icon="edit" /> Edit</button>
      <button @click="enableDragging = true" :disabled="user === null || !selectedStatementId || selectedStatementId * 1 === mainRelationId || (selectedStatementData && selectedStatementData['published_at'])" class="dropdown-item" href="#"><fa icon="arrows-alt" /> Drag </button>
      <button @click="openContextLock" :disabled="user === null || !selectedStatementId || (selectedStatementId * 1 === mainRelationId)" :title="user === null ? 'You need to login to use this feature' : 'Lock Context to Main Statement'" class="dropdown-item" href="#"><fa icon="lock" /> Context Lock</button>
      <button @click="bookmark" :disabled="true" class="dropdown-item" href="#"><fa icon="leaf" /> Bookmark</button>
    </div>
  </div>
  <ContextLockModal ref="contextLockModal" />
</template>
<script>
import GlobalData from '@/views/statement/global-data'
import ContextLockModal from './ContextLockModal'
import CircleIconButton from '@/components/CircleIconButton'
import Auth from '@/core/auth'
export default {
  components: {
    ContextLockModal,
    CircleIconButton
  },
  props: {
    relation: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      ...GlobalData,
      user: Auth.user()
    }
  },
  methods: {
    openContextLock(){
      this.$refs.contextLockModal._open()
    }
  }
}
</script>
