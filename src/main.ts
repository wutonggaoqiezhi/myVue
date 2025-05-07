import { createApp } from 'vue'
import App from './App.vue'

import emitter from '@/utils/bus'
import { createI18n } from 'vue-i18n'

import LangZH from '@/assets/i18n/zh'
import LangEN from '@/assets/i18n/en'

const i18n = createI18n({
  locale: window.localStorage.getItem('wuhouci-lang') || 'zh',
  messages: {
    zh: LangZH,
    en: LangEN,
  },
})

const app = createApp(App)

declare module 'vue' {
  interface ComponentCustomProperties {
    $emitter: typeof emitter
  }
}

app.config.globalProperties.$emitter = emitter

app.use(i18n).mount('#app')

// @ts-expect-error: TypeScript does not recognize the custom property $emitter
app.config.globalProperties.$emitter.on('lang.change', (lang: 'zh' | 'en') => {
  window.localStorage.setItem('wuhouci-lang', lang)
  i18n.global.locale.value = lang
  console.log(`Language Changed:${lang}`)
})
