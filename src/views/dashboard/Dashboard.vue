<template class="overflow-hidden">
  <div>
    <div class="image-background py-4 px-0 mb-4">
      <div class="container py-2 ">
        <SearchTree />
        <router-link to="/new-statement" class="btn btn-lg btn-primary border-width-none d-flex align-items-center btn-shadow mb-3">
          <div class="text-right flex-fill">
            <fa icon="project-diagram" />
          </div>
          <span class="ml-2 flex-fill text-left">Create New Tree</span>
        </router-link>
        <router-link to="/learning" class="btn btn-lg btn-primary border-width-none d-flex align-items-center btn-shadow">
          <div class="text-right flex-fill">
            <fa icon="book-reader" />
          </div>
          <span class="ml-2 flex-fill text-left">Visit Learning Center</span>
        </router-link>
      </div>
    </div>
    <div class="container py-2 mb-4 pb-4">
      <!-- <div  class="container p-1" v-if="welcomeVisible">
        <div class="d-flex border p-2 border rounded-lg">
          <p>Good day! In your dashboard, you will see information and functionality to help guide you in using <strong class="text-uppercase">Thinka.io</strong>.<router-link to="/learning"> Click here to visit the learning centre. <fa icon="school" /></router-link><br></p>
          <div><fa v-on:click="welcomeVisible = false" icon="window-close" /></div>
        </div>
      </div> -->
      <div class="shadow rounded bg-white" id="accordianList">
        <div class="">
          <AccordionHeader
            data-target="#collapseThree"
            icon="chart-line"
            text="Trending"
            class=""
          />
          <div id="collapseThree" class="collapse show" aria-labelledby="headingThree" data-parent="#accordianList">
            <Trending />
          </div>
        </div>
        <div v-if="user" class="">
          <AccordionHeader
            data-target="#collapseOne"
            icon="list"
            text="My Trees"
          />
          <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordianList">
            <MyList v-if="user" class=" p-0" />
          </div>
        </div>
        <div v-if="user" class=" rounded-b">
          <AccordionHeader
            data-target="#collapseTwo"
            icon="cloud"
            text="My Thinka Tanks"
            class="border-top"
          />
          <div id="collapseTwo" class="collapse rounded-b" aria-labelledby="headingTwo" data-parent="#accordianList">
            <div class=" m-2 p-0">
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
