<template>
  <div :title="isFullscreen ? '退出全屏' : '全屏'">
    <el-icon @click="toggle" style="font-size:0.95em">
      <Crop v-if="isFullscreen" />
      <FullScreen v-else />
    </el-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useFullscreen } from '@vueuse/core'

export default defineComponent({
  name: 'fullscreen',
  setup() {
    const { isFullscreen, toggle } = useFullscreen()
    return {
      isFullscreen,
      toggle
    }
  }
})
</script>

<style lang="scss" scoped>
i {
  cursor: pointer;
  font-size: 18px;

  &:focus {
    outline: none;
  }
}
</style>
