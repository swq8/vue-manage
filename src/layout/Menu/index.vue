<template>
  <el-scrollbar>
    <el-menu class="layout-menu system-scrollbar" background-color="var(--system-menu-background)"
      text-color="var(--system-menu-text-color)" active-text-color="var(--system-primary-color)"
      :default-active="activeMenu" :class="appStore.isCollapse ? 'collapse' : ''" :collapse="appStore.isCollapse"
      :collapse-transition="false" :unique-opened="appStore.expandOneMenu">
      <menu-item v-for="(menu, key) in userStore.menu" :key="key" :menu="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import MenuItem from './MenuItem.vue'
import { useUserStore } from '@/stores/user'
export default defineComponent({
  components: {
    MenuItem
  },
  setup() {
    const userStore = useUserStore()
    const appStore = useAppStore()

    const route = useRoute()
    const activeMenu: any = computed(() => {
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });
    onMounted(() => {

    })
    return {
      appStore,
      activeMenu,
      userStore,
    }
  }
})
</script>

<style lang="scss" scoped>
.el-scrollbar {
  background-color: var(--system-menu-background);
}

.layout-menu {
  border: none;
  padding-bottom: 6em;
  width: 100%;

  &.collapse {
    margin-left: 0px;
  }

  :deep() {

    .el-menu-item,
    .el-sub-menu {
      background-color: var(--system-menu-background) !important;
    }

    .el-menu-item i,
    .el-menu-item-group__title,
    .el-sub-menu__title i {
      color: var(--system-menu-text-color);
    }

    .el-menu-item,
    .el-sub-menu__title {
      &.is-active {
        background-color: var(--system-primary-color) !important;
        color: var(--system-primary-text-color) !important;

        i {
          color: var(--system-primary-text-color) !important;
        }

        &:hover {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;
        }
      }

      &:hover {
        background-color: var(--system-menu-hover-background) !important;
      }
    }

    .el-sub-menu {
      &.is-active {

        >.el-sub-menu__title,
        >.el-sub-menu__title i {
          color: var(--system-menu-submenu-active-color) !important;
        }
      }

      .el-menu-item {
        background-color: var(--system-menu-children-background) !important;

        &.is-active {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;

          &:hover {
            background-color: var(--system-primary-color) !important;
            color: var(--system-primary-text-color) !important;
          }
        }

        &:hover {
          background-color: var(--system-menu-hover-background) !important;
        }
      }

      .el-sub-menu {
        .el-sub-menu__title {
          background-color: var(--system-menu-children-background) !important;

          &:hover {
            background-color: var(--system-menu-hover-background) !important;
          }
        }
      }
    }
  }
}</style>