import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
