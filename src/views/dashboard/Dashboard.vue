<template>
  <div class="container py-4">
    <h2>Dashboard</h2>
    <p>Good day! In your dashboard, you will see different information and functionality to help and guide you in using <strong class="text-uppercase">Thinka.io</strong>.</p>
    <div class='text-center mb-2'>
      <button class="btn btn-lg btn-primary text-uppercase mx-1 mb-2"><fa icon="project-diagram" /> Create New Tree</button>
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
        <div class="card">
          <h5 class="card-header"><fa icon="chart-line" /> Trending</h5>
          <div class="card-body">
            <p class="card-text">The list below shows the most active conclusions</p>
            <table class="table ">
              <tbody>
                <tr>
                  <td>Most plants grow in soil</td>
                  <td>12</td>
                </tr>
                <tr>
                  <td>Some people believe that the Earth is flat</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>Water is healthy for the body</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>This tree in the desert has no water and grows</td>
                  <td>9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
export default {
  data(){
    return {
      user: Auth.user()
    }
  }
}
</script>
