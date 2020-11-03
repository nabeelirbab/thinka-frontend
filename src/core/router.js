import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import Search from "@/views/search/Search";
import Statement from "@/views/statement/Statement.vue";

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

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
