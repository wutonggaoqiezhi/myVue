/// <reference types="vite/client" />

// src/env.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.png' {
  const src: string
  export default src
}
