<template>
  <div>
    <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}1
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}2
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}3
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}4
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}5
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}6
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}7
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}8
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}9
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}10
          <draggable
      :list="list"
      class="dragArea"
      item-key="id"
      :group="{ name: 'group1' }"
    >
      <template #item="{element}">
        <div class="bg-white">
          {{element}}11
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>
        </div>
      </template>
    </draggable>

        </div>
      </template>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable' // https://github.com/SortableJS/Vue.Draggable
export default {
  components: {
    draggable
  },
  data(){
    return {
      list: [
        {description: 'hey'},
      ]
    }
  }
}
</script>