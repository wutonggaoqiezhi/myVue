<template>
  <div class="container">
    <HomeScene :class="{ 'hide': !homeSceneViewing }" v-if="homeSceneViewing"></HomeScene>
    <MainScene :class="{ 'hide': !mainSceneViewing }" ref="mainScene"></MainScene>
    <!-- <VideoIntro v-if="introVideoViewing"></VideoIntro> -->
    <!-- <VideoEnd v-if="endVideoViewing"></VideoEnd> -->

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import emitter from '@/utils/bus';
import HomeScene from './HomeScene/index.vue'
import MainScene from './MainScene/index.vue'
// import VideoIntro from './Videos/IntroComponent.vue'
// import VideoEnd from './Videos/End.vue'
// import Hotspot from './Hotspot/index.vue'

import WuHouCiApp from '@/WuHouCiApp';

let app: WuHouCiApp
const mainScene = ref<HTMLCanvasElement | null>(null)
const homeSceneViewing = ref(true)
const mainSceneViewing = ref(false)
// const introVideoViewing = ref(false)
// const endVideoViewing = ref(false)

const onLoadingStart = () => {
  emitter.emit("load.start");
}

interface LoadingEvent {
  data: {
    loaded: number;
    total: number;
  };
}

const onLoadingProgress = (event: LoadingEvent) => {
  emitter.emit("load.progress", event.data.loaded / event.data.total);
}

const onLoadingComplete = () => {
  emitter.emit("load.complete");
  // if (this.UIManager) this.UIManager.generateUIControls(this.app.glManager);
}

onMounted(() => {
  const canvas = mainScene.value!
  console.log('canvas - ', canvas)
  app = new WuHouCiApp(canvas.querySelector('#canvasScene')!);
  app.init();

  setTimeout(() => {
    app.loader.start();
    onLoadingStart();
  }, 1000)

  app.loader.addEventListener("start", onLoadingStart)
  app.loader.addEventListener("progress", onLoadingProgress)
  app.loader.addEventListener("complete", onLoadingComplete)
})
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
