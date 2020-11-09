import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import Search from "@/views/search/Search";
import Statement from "@/views/statement/Statement.vue";
import Registration from "@/views/authentication/Registration.vue";
import LogIn from "@/views/authentication/LogIn.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
  {
    path: "/statement/:statementId",
    name: "Statement",
    component: Statement,

  },
  {
    path: "/register",
    name: "Register",
    component: Registration,

  },
  {
    path: "/login",
    name: "LogIn",
    component: LogIn,

  },
  
];

// const router = createRouter({
//   mode: 'history',
//   history: createWebHistory(),
//   routes,
// });
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
