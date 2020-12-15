<template>
  <div class="container py-4 bg-white height-max">
    <template v-if="user">
      <div id="welcomebox" class="container pb-4" v-if="welcomeVisible">
        <div class="d-flex border p-2 border rounded-lg">
        <p>Good day! In your dashboard, you will see information and functionality to help guide you in using <strong class="text-uppercase">Thinka.io</strong>.<router-link to="/learning"> Click here to visit the learning centre. <fa icon="school" /></router-link><br></p>
        <div><fa v-on:click="welcomeVisible = false" icon="window-close" /></div>
      </div>
      </div>
    </template>
    <div class='text-center mb-2'>
      <router-link to="/new-statement" class="btn btn-lg btn-primary text-uppercase mx-1 mb-2"><fa icon="project-diagram" /> Create New Tree</router-link>
      <router-link to="/search" class="btn btn-lg btn-outline-primary text-uppercase mx-1 mb-2"><fa icon="search" /> Search A Tree</router-link>
    </div>
    <div class="row no-gutters">
      <div class="col-12 col-md-8 pr-md-2 pb-3">
        <MyList v-if="user" class="mb-2" />
        <div class="card mb-2">
          <h5 class="card-header"><fa icon="cloud" /> My Thinka Tanks</h5>
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
      </div>
      <div class="col-12 col-md-4 pb-3">
        <Trending />
      </div>
    </div>
  </div>
</template>
<script>
import Auth from '@/core/auth'
import Trending from './dashboard-components/Trending'
import MyList from './dashboard-components/MyList'
export default {
  components: {
    Trending,
    MyList
  },
  mounted(){

  },
  data(){
    return {
      user: Auth.user(),
      welcomeVisible: true
    }
  }
}
</script>
