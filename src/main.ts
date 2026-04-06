import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "./style.css";
import { applyLocale, createI18nInstance } from "./i18n";
import { routes } from "./router";
import { getLocaleFromPath } from "./siteNavigation";

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ app, router }) => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "auto";
    }

    const i18n = createI18nInstance(getLocaleFromPath(router.currentRoute.value.path));
    app.use(i18n);

    const syncLocaleFromPath = (path: string) => {
      applyLocale(i18n, getLocaleFromPath(path));
    };

    syncLocaleFromPath(router.currentRoute.value.path);

    router.beforeEach((to) => {
      syncLocaleFromPath(to.path);
    });
  },
);
