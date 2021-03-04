<template>
  <div class="fixed-top font-weight-bold align-items-center bg-white" style="min-height: 46px!important">
    <div v-if="!hideBranding" class="px-2 w-sm-100 d-flex align-items-center w-100 py-1" style="height:43px" >
      <router-link :to="'/'" class="navbar-brand py-0 text-lowercase text-primary" >
        <!-- Thinka.io -->
        <img src="@/assets/logo.png" style="height:27px; width:auto"/>
      </router-link>
      <!-- <router-link v-if="user === null" to="/login" class="btn btn-primary d-inline d-md-none ml-auto">Log In</router-link> -->
      <div class="flex-fill text-right">
        <UserInfo @open-login="openLogIn" />
      </div>
    </div>
    <div v-show="authenticationStatus !== 'authenticating'" class="menuContainer w-100" style="">
      <!-- <LogInForm v-if="user === null" class="ml-auto d-none d-md-block" /> -->
      <div class="main-menu-height" style="position:absolute; width: 100vw!important; right: 0px; left: 0px; background: #00000066">
        <div class="mainMenuItems d-flex justify-content-around align-items-center container px-0" >
          <router-link to="/dashboard" :class="(routePath === '/dashboard' ? activeLinkClass : 'text-white') + ' ' + linkClass" tag="button"><fa icon="home" /> </router-link>
          <router-link to="/search" :class="(routePath === '/search' ? activeLinkClass : 'text-white') + ' ' + linkClass" tag="button"><fa icon="search" /></router-link>
          <router-link to="/branch" :class="(routePath.indexOf('/branch') !== -1 ? activeLinkClass : 'text-white') + ' ' + linkClass" tag="button"><CustomIcon icon="tree" /></router-link>
          <router-link to="/bookmarks" :class="(routePath === '/bookmarks' ? activeLinkClass : 'text-white') + ' ' + linkClass" tag="button"><fa icon="bookmark" /></router-link>
          <router-link to="/notification" :class="(routePath === '/notification' ? activeLinkClass : 'text-white') + ' ' + linkClass" tag="button">
            <fa-layers full-width >
              <fa icon="bell" />
              <fa-layers-text v-if="rerenderNotificationCount && unopenedNotificationCount" counter :value="unopenedNotificationCount" position="top-right" class="fa-right-4 float-right" style="margin-left:auto; maright-right:0;font-size:1.5em" />
            </fa-layers>
          </router-link>
          <router-link to="/more-menu" :class="(routePath === '/more-menu' ? activeLinkClass : 'text-white') + ' ' + linkClass"  tag="button"><fa icon="bars" /></router-link>
        </div>
      </div>
      <div class="header-image-background main-menu-height" style="height:47px;"></div>
      <!-- <UserInfo v-if="!hideBranding" @open-login="openLogIn" class="d-none d-md-inline-block " style="position:absolute; margin-left: calc(100% - 63px)"/> -->


    </div>
  </div>
  <LogInModal ref="logIn" />
</template>
<script>
import Auth from '@/core/auth'
// import LogInForm from './header-components/LogInForm'
import UserInfo from './header-components/UserInfo'
import CustomIcon from '@/components/CustomIcon'
import LogInModal from '@/components/login/LogInModal'
import NotificationUserAPI from '@/api/notification-user'
export default {
  components: {
    // LogInForm,
    UserInfo,
    CustomIcon,
    LogInModal
  },
  mounted(){
    setTimeout(() => {
      NotificationUserAPI.checkNotification()
    }, 100)
  },
  data(){
    return {
      user: Auth.user(),
      authenticationStatus: Auth.status(),
      rerenderNotificationCount: false,
      linkClass: 'shadow-none py-2 -2 header-icon flex-fill text-center',
      activeLinkClass: 'border-bottom border-white border-width text-white'
    }
  },
  
  methods: {
    openLogIn(){
      this.$refs.logIn._open()
    }
  },
  watch: {
    unopenedNotificationCount:{
      handler(){
        this.rerenderNotificationCount = false
        setTimeout(() => {
          this.rerenderNotificationCount = true
        }, 400)
      },
      immediate: true
    }
  },
  computed:{
    unopenedNotificationCount(){
      const notificationUsers = NotificationUserAPI.notificationUsers.value
      let unopenedCount = 0;
      notificationUsers.forEach(notificationUsers => {
        if(notificationUsers['status'] * 1 === 0){
          ++unopenedCount
        }
      })
      return unopenedCount
    },
    routePath(){
      return this.$route['path']
    },
    hideBranding(){
      return typeof this.$route['meta']['hideBranding'] !== 'undefined' && this.$route['meta']['hideBranding']
    }
  }
}
</script>
<style scoped>

.header-icon {
  font-size: 1.16em!important
}
@media (min-width: 768px) {
  
}
@media (min-width: 769px) and (max-width: 1230px) {
  
}
</style>
