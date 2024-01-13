import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route: Route[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: 'dashboard', icon: 'sfont system-home' },
    children: [
      {
        path: 'dashboard',
        component: createNameComponent(() => import('@/views/main/dashboard/index.vue')),
        meta: { cache: true, title: '首页', icon: 'sfont system-home', hideClose: true }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    meta: { title: "系统管理", icon: "sfont system-document" },
    children: [
      {
        path: "menu",
        meta: { cache: true, title: "菜单管理" },
        component: createNameComponent(() => import('@/views/system/menu.vue'))
      },
      {
        path: "log",
        meta: { cache: true, title: "管理日志" },
        component: createNameComponent(() => import('@/views/system/log.vue'))
      },
      {
        path: "info",
        meta: { cache: true, title: "系统信息" },
        component: createNameComponent(() => import('@/views/system/info.vue'))
      },
    ]
  }
]

export default route