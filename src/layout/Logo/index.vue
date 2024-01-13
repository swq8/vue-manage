<template>
  <div class="logo-container">
    <!-- <img src="@/assets/logo.png" alt=""> -->
    <h1 v-if="!appStore.isCollapse">{{ systemTitle }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAppStore } from '@/stores/app'
import { systemTitle } from '@/config'
export default defineComponent({
  setup() {
    const appStore = useAppStore()
    
    return {
      appStore,
      systemTitle
    }
  }
})
</script>

<style lang="scss" scoped>
  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: var(--system-logo-background);
    h1 {
      font-size: 18px;
      white-space: nowrap;
      color: var(--system-logo-color);
    }
  }
</style>