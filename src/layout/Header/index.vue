<template>
  <header>
    <div class="left-box">
      <!-- 收缩按钮 -->
      <div class="menu-icon" @click="opendStateChange">
        <el-icon>
          <Expand v-if="appStore.isCollapse" />
          <Fold v-else />
        </el-icon>
      </div>
      <Breadcrumb />
    </div>
    <div class="right-box">
      <!-- 快捷功能按钮 -->
      <div class="function-list">
        <div class="function-list-item hidden-sm-and-down"><Full-screen /></div>
        <div class="function-list-item">
          <SizeChange />
        </div>
        <div class="function-list-item hidden-sm-and-down">
          <Theme />
        </div>
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            管理员
            <i class="sfont system-xiala"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>{{ userStore.name }}</el-dropdown-item>
              <el-dropdown-item >修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import FullScreen from './functionList/fullscreen.vue'
import SizeChange from './functionList/sizeChange.vue'
import Theme from './functionList/theme.vue'
import Breadcrumb from './Breadcrumb.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
export default defineComponent({
  components: {
    FullScreen,
    Breadcrumb,
    SizeChange,
    Theme
  },
  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const layer = reactive({
      show: false,
      showButton: true
    })
    // isCollapse change to hide/show the sidebar
    const opendStateChange = () => {
      appStore.isCollapse = !appStore.isCollapse
    }

    // login out the system
    const logout = () => {
      userStore.logout()
    }

    const showPasswordLayer = () => {
      layer.show = true
    }
    return {
      appStore,

      layer,
      opendStateChange,
      logout,
      showPasswordLayer,
      userStore
    }
  }
})
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: var(--system-header-background);
  padding-right: 22px;
}

.left-box {
  height: 100%;
  display: flex;
  align-items: center;

  .menu-icon {
    width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    font-weight: 100;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      background-color: var(--system-header-item-hover-color);
    }

    i {
      color: var(--system-header-text-color);
    }
  }
}

.right-box {
  display: flex;
  justify-content: center;
  align-items: center;

  .function-list {
    display: flex;

    .function-list-item {
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;

      :deep(i) {
        color: var(--system-header-text-color);
      }
    }
  }

  .user-info {
    margin-left: 20px;

    .el-dropdown-link {
      color: var(--system-header-breadcrumb-text-color);
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }
  }
}

.head-fold {
  font-size: 20px;
}
</style>