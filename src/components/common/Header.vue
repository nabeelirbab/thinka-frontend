<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <a class="navbar-brand text-uppercase" href="#">Thinka.io</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <!-- <div class="navbar-nav">
        
        <a class="nav-item nav-link" href="#">Features</a>
        <a class="nav-item nav-link" href="#">Pricing</a>
        <a class="nav-item nav-link disabled" href="#">Disabled</a>
      </div> -->
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-item nav-link active"><fa icon="columns" /> Dashboard </router-link>
        </li>
        
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li class="nav-item mx-4">
          <router-link to="/search" class="nav-item nav-link active"  ><fa icon="search" /> Search</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
