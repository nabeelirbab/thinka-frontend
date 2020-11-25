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
        <div class="card">
          <h5 class="card-header"><fa icon="cloud" /> Thinka Tank</h5>
          <div class="card-body">
            <p class="card-text">Thinka Tanks group Logic Trees like a playlist for users subscription, chat, and to assist collaboration</p>
            <table class="table ">
              <tbody>
                <tr>
                  <td>Plant Lovers</td>
                  <td>Logics that relates to plants. From house plants to farm</td>
                </tr>
                <tr>
                  <td>Politics</td>
                  <td>Logics that relates to politics such as debate, or polical point of view, political candidate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 pb-3">
          <Trending />
      </div>
      <div class="col-12 col-md-6 pb-3">
        <div class="card">
          <h5 class="card-header"><fa icon="list" /> User History</h5>
          <div class="card-body">
            <table class="table ">
              <tbody>
                <tr>
                  <td>James Smith</td>
                  <td>Created a new statement</td>
                </tr>
                <tr>
                  <td>Paul Walker</td>
                  <td>& Has supported a statement</td>
                </tr>
                <tr>
                  <td>John Doe</td>
                  <td>& Has supported a statement</td>
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
