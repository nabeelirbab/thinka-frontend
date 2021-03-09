<template>
  <div class="c-pointer m-0 p-3 border-bottom" data-toggle="collapse" :data-target="dataTarget" >
    <h6 class="mb-0 text-uppercase text-primary font-weight-bold  text-nowrap d-flex align-items-center" >
      <fa :icon="icon" class="mr-2 text-lg" />
      <div class="mr-1 flex-fill">
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
    text: String
  }
}
</script>