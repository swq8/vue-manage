<template>
  <component :is="type" v-bind="linkProps(to)" @click="hideMenu">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, } from 'vue'
import { useAppStore } from '@/stores/app';
export default defineComponent({
  name: 'appLink',
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const appStore = useAppStore()
    const linkProps = (to: any) => {
      return {
        to: to
      }
    }
    const hideMenu = () => {
      if (document.body.clientWidth <= 1000 && !appStore.isCollapse) {
        appStore.isCollapse = true
      }
    };
    return {
      type: "router-link",
      linkProps,
      hideMenu
    }
  }
})
</script>
<style lang="">
  
</style>