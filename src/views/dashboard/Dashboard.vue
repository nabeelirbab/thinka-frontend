<template class="overflow-hidden">
  <div>
    <div class="image-background p-4 mb-4">
      <div class="container p-4">
        <SearchTree />
        <router-link to="/new-statement" class="btn btn-lg btn-primary d-flex align-items-center btn-shadow mb-3">
          <div class="text-right flex-fill">
            <fa icon="project-diagram" />
          </div>
          <small class="ml-2 flex-fill text-left">Create New Tree</small>
        </router-link>
        <router-link to="/new-statement" class="btn btn-lg btn-primary d-flex align-items-center btn-shadow">
          <div class="text-right flex-fill">
            <fa icon="book-reader" />
          </div>
          <small class="ml-2 flex-fill text-left">Visit Learning Center</small>
        </router-link>
      </div>
    </div>
    <div class="container py-2 mb-4">
      <!-- <div  class="container p-1" v-if="welcomeVisible">
        <div class="d-flex border p-2 border rounded-lg">
          <p>Good day! In your dashboard, you will see information and functionality to help guide you in using <strong class="text-uppercase">Thinka.io</strong>.<router-link to="/learning"> Click here to visit the learning centre. <fa icon="school" /></router-link><br></p>
          <div><fa v-on:click="welcomeVisible = false" icon="window-close" /></div>
        </div>
      </div> -->
      <div class="accordion shadow rounded" id="accordianList">
        <div class="card  rounded-t">
          <AccordionHeader
            data-target="#collapseThree"
            icon="chart-line"
            text="Trending"
          />
          <div id="collapseThree" class="collapse show" aria-labelledby="headingThree" data-parent="#accordianList">
            <Trending class="card-body p-0" />
          </div>
        </div>
        <div v-if="user" class="card">
          <AccordionHeader
            data-target="#collapseOne"
            icon="list"
            text="My Trees"
          />
          <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordianList">
            <MyList v-if="user" class="card-body p-0" />
          </div>
        </div>
        <div v-if="user" class="card rounded-b">
          <AccordionHeader
            data-target="#collapseTwo"
            icon="cloud"
            text="My Thinka Tanks"
          />
          <div id="collapseTwo" class="collapse rounded-b" aria-labelledby="headingTwo" data-parent="#accordianList">
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
  </div>
</template>
<script>
import Auth from '@/core/auth'
import Trending from './dashboard-components/Trending'
import MyList from './dashboard-components/MyList'
import AccordionHeader from './dashboard-components/AccordionHeader'
import SearchTree from './dashboard-components/SearchTree'
export default {
  components: {
    Trending,
    MyList,
    AccordionHeader,
    SearchTree
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
