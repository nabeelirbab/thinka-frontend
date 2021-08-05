<template>
  <div class="container pt-4">
    <div class="mb-3">
      <h5>Learning Centre</h5>
      <router-link to="/learning"> Click here to visit the learning centre. <fa icon="school" /></router-link>
    </div>
    <div>
      <h5>Profile</h5>
      <router-link to="/profile-setting"> Click here to edit your profile setting. <fa icon="user" /></router-link>
    </div>
    <div class="" style="margin-top: 50vh">
      <ReportForm />
    </div>
  </div>
</template>
<script>
import ReportForm from './ReportForm'
export default {
  components: {
    ReportForm
  }
}
</script>