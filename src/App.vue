<template>
  <el-config-provider :size="appStore.elementSize">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAppStore } from './stores/app'
export default defineComponent({
  name: 'App',
  setup() {
    const appStore = useAppStore()
    return {
      appStore
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
}
</style>
