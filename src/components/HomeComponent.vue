<template>
  Home
  <div class="container">
    <HomeScene />
  </div>
</template>

<script setup lang="ts">
import HomeScene from './HomeScene/index.vue'
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background: #fff;
}

.hide {
  display: none;
  pointer-events: none
}
</style>
