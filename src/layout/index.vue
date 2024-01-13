<template>
  <el-container style="height: 100vh">
    <div class="mask" v-show="!appStore.isCollapse && !appStore.contentFullScreen" @click="hideMenu"></div>
    <el-aside :width="appStore.isCollapse ? '60px' : '250px'" :class="appStore.isCollapse ? 'hide-aside' : 'show-side'"
      v-show="!appStore.contentFullScreen">
      <Logo v-if="appStore.showLogo" />
      <Menu />
    </el-aside>
    <el-container>
      <el-header v-show="!appStore.contentFullScreen">
        <Header />
      </el-header>
      <Tabs v-show="appStore.showTabs" />
      <el-main>
        <router-view v-slot="{ Component, route }">
          <transition :name="<string>route.meta.transition || 'fade-transform'" mode="out-in">
            <keep-alive v-if="userStore.cachedComponents" :include="userStore.cachedComponents">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
            <component v-else :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from "vue";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { useEventListener } from "@vueuse/core";
import Menu from "./Menu/index.vue";
import Logo from "./Logo/index.vue";
import Header from "./Header/index.vue";
import Tabs from "./Tabs/index.vue";
export default defineComponent({
  components: {
    Menu,
    Logo,
    Header,
    Tabs,
  },
  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()


    // 页面宽度变化监听后执行的方法
    const resizeHandler = () => {
      if (document.body.clientWidth <= 1000 && !appStore.isCollapse) {
        appStore.isCollapse = true
      } else if (document.body.clientWidth > 1000 && appStore.isCollapse) {
        appStore.isCollapse = false
      }
    };
    // 初始化调用
    resizeHandler();
    // beforeMount
    onBeforeMount(() => {
      // 监听页面变化
      useEventListener("resize", resizeHandler);
    });
    // methods
    // 隐藏菜单
    const hideMenu = () => {
      appStore.isCollapse = true
    };
    return {
      appStore,
      hideMenu,
      userStore,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-header {
  padding-left: 0;
  padding-right: 0;
}

.el-aside {
  display: flex;
  flex-direction: column;
  transition: 0.2s;
  overflow-x: hidden;
  transition: 0.3s;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.el-main {
  background-color: var(--system-container-background);
  height: 100%;
  overflow-x: hidden;
  padding: 9px;
}


:deep(.el-main-box) {
  background-color: white;
  padding: 1em;
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

@media screen and (max-width: 1000px) {
  .el-aside {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;

    &.hide-aside {
      left: -250px;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>