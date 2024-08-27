import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueGtag from "vue-gtag-next";

const app = createApp(App);

app.use(VueGtag, {
  isEnabled: false,
  property: { id: "G-NGMSZ7LMK4" },
});

app.mount("#app");
