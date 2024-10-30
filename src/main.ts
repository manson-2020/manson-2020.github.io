import { createSSRApp } from 'vue'
import App from './App.vue'
import { includeSrc } from "@/libs/utils";
import interceptor from './interceptors'
import store from './libs/store';
import "virtual:uno.css";

export function createApp() {
  const app = createSSRApp(App);
  app.config.globalProperties.include = includeSrc;
  app.use(store).use(interceptor);

  return { app }
}
