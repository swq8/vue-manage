<template>
  <el-dropdown @command="handleCommand" size="medium">
    <span class="el-dropdown-link">
      <el-icon style="font-size: 1.2em;">
        <Connection />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="d in list" :key="d.size" :command="d.size" :disabled="appStore.elementSize === d.size">
          {{ d.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, unref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
export default defineComponent({
  setup() {
    const appStore = useAppStore()

    const route = useRoute()

    const list = [
      { size: 'large', name: '大' },
      { size: 'default', name: '默认' },
      { size: 'small', name: '小' },
    ]
    const { fullPath } = unref(route)
    return {
      appStore,
      list,
      fullPath
    }
  },
  methods: {
    handleCommand(size: any) {
      this.appStore.elementSize = size
    },
  }
})
</script>

<style lang="scss" scoped></style>