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

    <div class="accordion" id="accordianList">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h2 class="mb-0">
        <button class="btn btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          <fa icon="list" /> My Trees <fa class="float-right" icon="angle-down" />
        </button>
      </h2>
    </div>

    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordianList">
      <div class="card-body">
        <MyList v-if="user" class="mb-2" />
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header" id="headingTwo">
      <h2 class="mb-0">
        <button class="btn btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          <fa icon="cloud" /> My Thinka Tanks <fa  class="float-right" icon="angle-down" />
        </button>
      </h2>
    </div>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordianList">
      <div class="card-body">
        <!-- <h5 class="card-header"><fa icon="cloud" /> My Thinka Tanks</h5> -->
        <div class="card-body p-0">
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
  </div>
  <div class="card">
    <div class="card-header" id="headingThree">
      <h2 class="mb-0">
        <button class="btn btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          <fa icon="chart-line" /> Trending <fa  class="float-right" icon="angle-down" />
        </button>
      </h2>
    </div>
    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordianList">
      <div class="card-body">
        <Trending />
      </div>
    </div>
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
