/*
 * @Date: 2022-05-22 20:44:25
 * @Description: 
 */
import { createApp } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css' // 引入基于断点的隐藏类
import 'element-plus/dist/index.css'
import 'normalize.css' // css初始化
import './assets/style/common.scss' // 公共css
import './theme/modules/chinese/index.scss'
import App from './App.vue'
import stores from './stores'
import router from './router'
if (import.meta.env.MODE === 'development') { // 开发环境调用

}

const app = createApp(App)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.use(stores)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.config.performance = true
app.mount('#app')
