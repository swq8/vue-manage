<template>
  <div class="tabs">
    <el-scrollbar class="scroll-container tags-view-container" ref="scrollbarDom" @wheel.passive="handleWhellScroll"
      @scroll="handleScroll">
      <Item v-for="menu in appStore.tabs" :key="menu.meta.title" :menu="menu" :active="activeMenu.path === menu.path"
        @close="delMenu(menu)" @reload="pageReload" />
    </el-scrollbar>
    <div class="handle">
      <div id="vueAdminBoxTabRefresh" @click="pageReload"></div>
      <div id="vueAdminBoxTabCloseSelf" @click="closeCurrentRoute"></div>
      <div id="vueAdminBoxTabCloseOther" @click="closeOtherRoute"></div>
      <div id="vueAdminBoxTabCloseAll" @click="closeAllRoute"></div>
      <el-dropdown placement="bottom">
        <div class="el-dropdown-link">
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="tab-ddropdown-item" :icon="RefreshLeft" @click="pageReload">重新加载</el-dropdown-item>
            <el-dropdown-item class="tab-ddropdown-item" :icon="CircleClose" :disabled="currentDisabled"
              @click="closeCurrentRoute">关闭当前标签</el-dropdown-item>
            <el-dropdown-item class="tab-ddropdown-item" :icon="CircleClose" :disabled="appStore.tabs.length < 3"
              @click="closeOtherRoute">关闭其他标签</el-dropdown-item>
            <el-dropdown-item class="tab-ddropdown-item" :icon="CircleClose" :disabled="appStore.tabs.length <= 1"
              @click="closeAllRoute">关闭所有标签</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-tooltip class="item" effect="dark" :content="appStore.contentFullScreen ? '退出全屏' : '全屏'" placement="bottom">
        <el-icon @click="onFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
/** 类型引用 */
import type { Ref } from 'vue'
import type { ElScrollbar } from 'element-plus'

/** 引用vue系列函数 */
import { defineComponent, computed, reactive, ref, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import {useUserStore} from '@/stores/user'
import { useRoute, useRouter } from 'vue-router'

/** 引用图标 */
import { ArrowDown, RefreshLeft, CircleClose, FullScreen } from '@element-plus/icons-vue'

import Item from './item.vue'

export default defineComponent({
  components: {
    Item, ArrowDown, FullScreen
  },
  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const route = useRoute()
    const router = useRouter()
    const scrollbarDom: Ref<typeof ElScrollbar | null> = ref(null)
    const scrollLeft = ref(0)
    const defaultMenu = {
      path: '/home',
      meta: { title: '首页', hideClose: true }
    }
    const currentDisabled = computed(() => route.path === defaultMenu.path)

    let activeMenu: any = reactive({ path: '' })
    if (appStore.tabs.length === 0) { // 判断之前有没有调用过
      addMenu(defaultMenu)
    }

    router.afterEach(() => {
      addMenu(route)
      initMenu(route)
    })

    // 全屏
    function onFullscreen() {
      appStore.contentFullScreen = !appStore.contentFullScreen
    }
    // 当前页面组件重新加载
    function pageReload() {
      const self: any = route.matched[route.matched.length - 1].instances.default
      self.handleReload();
    }

    // 关闭当前标签，首页不关闭
    function closeCurrentRoute() {
      if (route.path !== defaultMenu.path) {
        const tab = document.getElementById('vueAdminBoxTabCloseSelf')
        const nextPath = tab?.getAttribute('nextPath')
        delMenu(route, nextPath)
      }
    }
    // 关闭除了当前标签之外的所有标签
    function closeOtherRoute() {
      appStore.tabs = [defaultMenu]
      if (route.path !== defaultMenu.path) {
        addMenu(route)
      }
      setKeepAliveData()
    }

    // 关闭所有的标签，除了首页
    function closeAllRoute() {
      appStore.tabs = [defaultMenu]
      setKeepAliveData()
      router.push(defaultMenu.path)
    }

    // 添加新的菜单项
    function addMenu(menu: any) {
      let { path, meta, name, query } = menu
      if (meta.hideTabs) {
        return
      }
      let hasMenu = appStore.tabs.some((obj: any) => {
        return obj.path === path
      })
      if (!hasMenu) {
        appStore.tabs.push({
          path,
          meta,
          name,
          query
        })
      }
    }

    // 删除菜单项
    function delMenu(menu: any, nextPath?: string) {
      let index = 0
      if (!menu.meta.hideClose) {
        if (menu.meta.cache && menu.name) {
          // del menu.name from userStore.cachedComponents
          console.log('need code: del menu.name from userStore.cachedComponents')
        }
        index = appStore.tabs.findIndex((item: any) => item.path === menu.path)
        appStore.tabs.splice(index, 1)
      }
      if (nextPath) {
        router.push(nextPath)
        return
      }
      // 若删除的是当前页面，回到前一页，若为最后一页，则回到默认的首页
      if (menu.path === activeMenu.path) {
        const prePage = index - 1 > 0 ? appStore.tabs[index - 1] : { path: defaultMenu.path }
        router.push({ path: prePage.path, query: prePage.query || {} })
      }
    }

    // 初始化activeMenu
    function initMenu(menu: object) {
      activeMenu = menu
      nextTick(() => {
        setPosition()
      })
    }
    /** 设置当前滚动条应该在的位置 */
    function setPosition() {
      if (scrollbarDom.value) {
        const domBox = {
          scrollbar: scrollbarDom.value.wrapRef as HTMLDivElement,
          activeDom: scrollbarDom.value.wrapRef.querySelector('.active') as HTMLDivElement,
          activeFather: scrollbarDom.value.wrapRef.querySelector('.el-scrollbar__view') as HTMLDivElement
        }
        let hasDoms = true
        Object.keys(domBox).forEach((dom) => {
          if (!dom) {
            hasDoms = false
          }
        })
        if (!hasDoms) {
          return
        }
        const domData = {
          scrollbar: domBox.scrollbar.getBoundingClientRect(),
          activeDom: domBox.activeDom.getBoundingClientRect(),
          activeFather: domBox.activeFather.getBoundingClientRect()
        }
        const num = domData.activeDom.x - domData.activeFather.x + 1 / 2 * domData.activeDom.width - 1 / 2 * domData.scrollbar.width
        domBox.scrollbar.scrollLeft = num
      }
    }

    // 配置需要缓存的数据
    function setKeepAliveData() {
      let keepAliveNames: any[] = []
      appStore.tabs.forEach((menu: any) => {
        menu.meta && menu.meta.cache && menu.name && keepAliveNames.push(menu.name)
      })
      userStore.cachedComponents  = keepAliveNames
    }

    /** 监听鼠标滚动事件 */
    function handleWhellScroll(e: any) {
      let distance = 0
      let speed = 5
      if (e.wheelDelta > 30) {
        distance = -10
      } else if (e.wheelDelta < -30) {
        distance = 10
      }
      // console.log(scrollLeft.value + eventDelta / 4)
      scrollbarDom.value?.setScrollLeft(scrollLeft.value + distance * speed)
    }

    /** 监听滚动事件 */
    function handleScroll({ scrollLeft: left }: { scrollLeft: number }) {
      scrollLeft.value = left
    }

    // 初始化时调用：1. 新增菜单 2. 初始化activeMenu
    addMenu(route)
    initMenu(route)
    return {
      appStore,
      RefreshLeft, CircleClose,
      scrollbarDom,
      activeMenu,
      currentDisabled,
      onFullscreen,
      pageReload,
      delMenu,
      closeCurrentRoute,
      closeOtherRoute,
      closeAllRoute,
      handleScroll,
      handleWhellScroll
    }
  }
})
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background: var(--system-header-background);
  border-bottom: 1px solid var(--system-header-border-color);
  border-top: 1px solid var(--system-header-border-color);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .1);

  .handle {
    min-width: 95px;
    height: 100%;
    display: flex;
    align-items: center;

    .el-dropdown-link {
      margin-top: 5px;
      border-left: 1px solid var(--system-header-border-color);
      height: 25px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:focus {
        outline: none;
      }
    }

    i {
      color: var(--system-header-text-color);
    }
  }
}

.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }

  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}

.tags-view-container {
  height: 34px;
  flex: 1;
  width: 100%;
  display: flex;
}

.el-icon-full-screen {
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, .025);
  }

  &:focus {
    outline: none;
  }
}

.tab-ddropdown-item {
  display: flex;
  align-items: center;
}</style>
