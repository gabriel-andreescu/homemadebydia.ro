import type { RouteRecordRaw } from "vue-router";
import HomePage from "./pages/HomePage.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home-ro",
    component: HomePage,
    meta: { locale: "ro" },
  },
  {
    path: "/en/",
    name: "home-en",
    component: HomePage,
    meta: { locale: "en" },
  },
];
