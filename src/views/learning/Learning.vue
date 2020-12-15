<template>
  <div class="text-justify bg-white">
    <div class="row no-gutters">
      <div class="col-12 col-md-6 w-100 max-height bg-dark banner" style="overflow:hidden">
      </div>
      <div class="col-12 col-md-6 p-4 order-first order-md-last" >
        <div class="text-content mt-md-4 pt-md-4 p-3 text-left" >
          <h3 class="mb-4 text-primary text-left">Welcome to <span class="">THINKA.IO!</span></h3>
          <p class="lead text-justify" >Thinka.io helps users organize their thoughts into logical trees. Each sentence is backed up by supportive points or rebutted by counter points.</p>
          <p class="lead text-justify" >By creating trees users can clearly express why they think the way they do. People can create and share <em>points of view</em> and see how many people share the same view.</p>
          <p class="lead text-justify">Symbols are used to connect sentences so that readers know the logical basis of each point of view.</p>
          <div class="text-danger font-weight-bold mr-1" style="font-size:1.5em">+ Support     - Counter     * Note</div>
          <p class="lead text-justify"><br>When a sentence is marked with a symbol that indicates the sentence has impact so that agreements will cascade according to the lines of reasoning defined in the branches of the logical tree.<br><router-link to="/login" class="text-nowrap">Learn more about symbols.</router-link></p>
`
          <router-link to="/register" class="btn btn-primary btn-lg text-nowrap mb-2">Join Community Now</router-link>
          <br />
          Already have an account? <router-link to="/login" class="text-nowrap font-weight-bold">Log In Now</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

</script>
<style scoped>
.banner {
  background: url('~@/assets/images/home-banner.png') no-repeat center top;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.max-height {
  height: calc(100vh - 275px)
}
.text-content {
  width: 100%;
}
@media (min-width: 768px) {
  .max-height {
    height: calc(100vh - 74px)
  }
  .text-content {
    max-width: 500px
  }
}
</style>
