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

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue 全局捕获错误：', err)
  console.warn('错误发生在：', info)
  // 你可以上报到日志系统，或者统一显示错误弹窗
}
// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $emitter: typeof emitter
//   }
// }

// app.config.globalProperties.$emitter = emitter

app.use(i18n).mount('#app')

emitter.on('lang.change', (lang) => {
  window.localStorage.setItem('wuhouci-lang', lang as string)
  i18n.global.locale.value = lang as 'zh' | 'en'
  console.log(`Language Changed:${lang}`)
})
