/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>

  export default component
}

declare module "@/static/js/dsbridge.js";

declare const WeixinJSBridge: AnyObject;

declare const AWSC: AnyObject;
