<template>
  <div class="container py-4 bg-white height-max">
    <h2>Dashboard</h2>
    <p>Good day! In your dashboard, you will see different information and functionality to help and guide you in using <strong class="text-uppercase">Thinka.io</strong>.</p>
    <div class='text-center mb-2'>
      <router-link to="/new-statement" class="btn btn-lg btn-primary text-uppercase mx-1 mb-2"><fa icon="project-diagram" /> Create New Tree</router-link>
      <router-link to="/search" class="btn btn-lg btn-outline-primary text-uppercase mx-1 mb-2"><fa icon="search" /> Search A Tree</router-link>
    </div>
    <div class="row">

      <div class="col-12 col-md-6 pb-3">
          <Trending />
      </div>

      <div class="col-12 col-md-6 pb-3">
        <div class="card">
          <h5 class="card-header"><fa icon="cloud" /> Thinka Tank</h5>
          <div class="card-body">
            <p class="card-text">Thinka Tanks can contain many logic trees and many users so they can chat and assist collaboration privately.</p>
            <table class="table ">
              <tbody>
                <tr>
                  <td>Plant Lovers Tank</td>
                  <td>This tank relates to plants. Join us!</td>
                </tr>
                <tr>
                  <td>Politics</td>
                  <td>We work on critical thinking trees for politics such as policy debate or evaluation of political candidates.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <h5 class="card-header"><fa icon="list" /> My Trees</h5>
          <div class="card-body">
            <table class="table ">
              <tbody>
                <tr>
                  <td>Claim</td>
                  <td>Apples are good for your health.</td>
                </tr>
                <tr>
                  <td>Question</td>
                  <td>Were the moon landings fake?</td>
                </tr>
                <tr>
                  <td>Risk</td>
                  <td>Lockdowns are a terrible solution for anything.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
import Trending from './dashboard-components/Trending'
export default {
  components: {
    Trending
  },
  mounted(){

  },
  data(){
    return {
      user: Auth.user()
    }
  }
}
</script>
