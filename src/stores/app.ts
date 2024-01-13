import { defineStore } from 'pinia'


export const useAppStore = defineStore('app', {
    persist: true,
    state: () => {
        return {
            currentPath: '' as string, // 当前页面路径
            isCollapse: false as boolean, // 侧边栏是否收缩展示
            contentFullScreen: false as boolean, // 内容是否可全屏展示
            showLogo: true as boolean, // 是否显示Logo
            fixedTop: false as boolean, // 是否固定顶部, todo，暂未使用
            showTabs: true as boolean, // 是否显示导航历史
            expandOneMenu: true as boolean, // 一次是否只能展开一个菜单
            elementSize: "default" as "" | "default" | "small" | "large", // element默认尺寸，支持官网'large / default /small'小参数
            lang: '', // 默认采用的国际化方案,初次进入，采用浏览器当前设置的语言，默认采用中文
            theme: {
                style: 'default',
                primaryColor: '#409eff',
                menuType: 'side'
            },
            tabs: [] as any[] // 标签列表

        }
    },
    getters: {
    },
    actions: {
    },
})