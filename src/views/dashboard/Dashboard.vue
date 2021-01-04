<template class="overflow-hidden">
  <div class="container py-2 bg-white height-max">
    <div id="welcomebox" class="container p-1" v-if="welcomeVisible">
      <div class="d-flex border p-2 border rounded-lg">
      <p>Good day! In your dashboard, you will see information and functionality to help guide you in using <strong class="text-uppercase">Thinka.io</strong>.<router-link to="/learning"> Click here to visit the learning centre. <fa icon="school" /></router-link><br></p>
      <div><fa v-on:click="welcomeVisible = false" icon="window-close" /></div>
      </div>
    </div>

    <div class="d-flex justify-content-center p-1">
      <router-link to="/new-statement" class="btn btn-lg btn-primary d-flex align-items-center"><fa icon="project-diagram" /><small class="ml-2">Create New Tree</small></router-link>
      <router-link to="/search" class="btn btn-lg btn-outline-primary d-flex align-items-center"><fa icon="search" /><small class="ml-2">Search Trees</small></router-link>
    </div>

    <div class="accordion pt-1" id="accordianList">
      <div class="card">
        <div class="card-header m-0 p-2" id="headingThree">
          <h2 class="m-0 p-0">
            <button class="btn btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              <fa icon="chart-line" /> Trending <fa  class="float-right" icon="angle-down" />
            </button>
          </h2>
        </div>
        <div id="collapseThree" class="collapse show" aria-labelledby="headingThree" data-parent="#accordianList">
          <div class="card-body m-2 p-0">
            <Trending />
          </div>
        </div>
      </div>
      <div v-if="user" class="card">
        <div class="card-header m-0 p-2" id="headingOne">
          <h2 class="m-0 p-0">
            <button class="btn btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <fa icon="list" /> My Trees <fa class="float-right" icon="angle-down" />
            </button>
          </h2>
        </div>

        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordianList">
          <div class="card-body m-2 p-0">
            <MyList v-if="user" class="mb-2" />
          </div>
        </div>
      </div>
      <div v-if="user" class="card">
        <div class="card-header m-0 p-2" id="headingTwo">
          <h2 class="m-0 p-0">
            <button class="btn btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              <fa icon="cloud" /> My Thinka Tanks <fa  class="float-right" icon="angle-down" />
            </button>
          </h2>
        </div>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordianList">
            <div class="card-body m-2 p-0">
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
  data(){
    return {
      user: Auth.user(),
      welcomeVisible: true
    }
  },
  mounted() {
    console.log('Start welcomeVisible: ' + this.welcomeVisible);
    if (localStorage.getItem('welcomeVisible')) {
      this.welcomeVisible = false;
    }
  },
  watch: {
    welcomeVisible(newValue) {
      localStorage.welcomeVisible = newValue;
    }
  }
}
</script>
