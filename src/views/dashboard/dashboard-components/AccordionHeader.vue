<template>
  <div class="c-pointer m-0 px-3 py-2 border-bottom " data-toggle="collapse" :data-target="dataTarget" >
    <h6 class="mb-0 text-uppercase text-primary font-weight-bold text-nowrap d-flex align-items-center" >
      <fa :icon="icon" class="text-lg" />
      <div class="flex-fill pl-1">
        {{text}}
      </div>
      <fa icon="angle-down"/>
    </h6>
  </div>
</template>
<script>
export default {
  props: {
    dataTarget: String,
    icon: String,
    text: String,

  }
}
</script>