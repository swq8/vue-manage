import { defineStore } from 'pinia'
import mainApi from '@/api/main'

import router, { clearRouter } from '@/router'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../router/createNode'
import { useAppStore } from './app'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            authorize: [] as string[],
            cachedComponents: [] as string[],
            menu: [] as any[],
            name: '' as string,
            superAdmin: false as boolean
        }
    },
    getters: {

    },
    actions: {
        /**
     * get route 
     * @returns route
     */
        getRoute() {
            const recurse = (items: any[], level: number = 1) => {
                const result: any[] = []
                for (const item of items) {
                    const obj = { ...item }
                    obj.meta = Object.assign({}, item.meta)
                    if (level === 1) {
                        if (item.path == undefined) continue;
                        obj.component = Layout
                        obj.children = recurse(item.children, level + 1)
                    } else if (level === 2) {
                        /*
                         * 不支持完全的动态文件名，webpack 的工作原理是对文件进行静态扫描，然后根据一定规则处理的。
                         * webpack 在扫描到“import()”语法时，会将变量转换成正则表达式的“.*”，然后根据这个规则匹配文件名，对匹配上的文件独立 chunk 输出
                        */
                        if (item.component == undefined || item.path == undefined) continue;
                        const path: string[] = item.component.split("/")
                        obj.component = null
                        switch (path.length) {
                            case 1: obj.component = createNameComponent(() => import(`@/views/${path[0]}.vue`))
                                break;
                            case 2: obj.component = createNameComponent(() => import(`@/views/${path[0]}/${path[1]}.vue`))
                                break;
                            case 3: obj.component = createNameComponent(() => import(`@/views/${path[0]}/${path[1]}/${path[2]}.vue`))
                                break;
                        }
                        if (obj.component === null) {
                            throw new Error('component error: ' + item.component)
                        }
                    }
                    result.push(obj)
                }
                return result
            }

            const route = recurse(this.menu)
            return route
        },
        hasAuthorize(name: string): boolean {
            if (this.superAdmin) return true
            return this.authorize.includes(name)
        },
        login(loginParam: any) {
            return new Promise((resolve, reject) => {
                mainApi.login(loginParam)
                    .then(res => {
                        this.name = res.data.name
                        useAppStore().tabs = []
                        resolve(res.data)
                    }).catch(err => {
                        reject(err)
                    })
            })
        },
        logout() {
            mainApi.logout().then(() => {
                this.$reset()
                useAppStore().tabs = []
                clearRouter()
                router.replace('/login')
            })

        },
    },
})