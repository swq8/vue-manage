/*
 * @Date: 2023-01-25 09:51:12
 * @LastEditTime: 2023-01-25 12:25:51
 * @Description: 
 */
/**
 * @description 所有人可使用的参数配置列表
 * @params hideMenu: 是否隐藏当前路由结点不在导航中展示
 * @params alwayShow: 只有一个子路由时是否总是展示菜单，默认false
 */
import { reactive } from 'vue'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import NProgress from '@/utils/system/nprogress'
import { changeTitle } from '@/utils/system/title'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { RouteLocationNormalized } from 'vue-router'
import mainApi from '@/api/main'


NProgress.configure({ showSpinner: true })

// 引入不需要权限的modules
import System from './modules/system'

/** 
 * @name 初始化必须要的路由
 * @description 使用reactive属性使得modules可以在路由菜单里面实时响应，搞定菜单回显的问题
 * @detail 针对modules的任何修改，均会同步至菜单级别，记住，是针对变量名为：moduels的修改
 **/
let modules = reactive([
  ...System
])

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: modules
})

// installed route
const installed: any[] = []

// clear router on logout
export const clearRouter = () => {
  for (const removeRoute of installed) {
    removeRoute()
  }
  installed.length = 0
  modules = reactive([
    ...System
  ])
  needLoad = true
}

// 未授权时可访问的白名单
const whiteList = ['/login']

// loaded status
let needLoad: boolean = true

// 路由跳转前的监听操作
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()
  // load route
  if (needLoad) {
    const appStore = useAppStore()
    let result: any = await mainApi.getInfo()
    if (result.data.name && result.data.name.length > 1) {
      userStore.authorize = result.data.authorize
      userStore.menu = result.data.menu
      userStore.name = result.data.name
      userStore.superAdmin = result.data.superAdmin
      for (const item of userStore.getRoute()) {
        modules.push(item)
        installed.push(router.addRoute(item))
      }
      needLoad = false
      console.log(appStore.currentPath)
      // go to homepage after loaded
      if (['', '/', '/login'].includes(appStore.currentPath)) router.replace('/home')
      else router.replace(appStore.currentPath)
    }

  }

  NProgress.start()
  to.meta.title ? (changeTitle(to.meta.title)) : "" // 动态title
  if (userStore.name.length > 0) {
    next()
  } else if (whiteList.includes(to.path)) {
    next()
  } else {
    next("/login"); // 全部重定向到登录页
  }
});

// 路由跳转后的监听操作
router.afterEach((to: RouteLocationNormalized | any, _from) => {
  const userStore = useUserStore()
  const name = to.matched[to.matched.length - 1].components.default.name
  if (to.meta && to.meta.cache && name && !userStore.cachedComponents.includes(name)) {
    useUserStore().cachedComponents.push(name)
  }
  useAppStore().currentPath = to.fullPath
  NProgress.done()
});


export {
  modules
}

export default router
