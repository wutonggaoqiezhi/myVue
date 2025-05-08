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
const mainScene = ref<InstanceType<typeof MainScene> | null>(null)
const homeSceneViewing = ref(true)
const mainSceneViewing = ref(false)
const introVideoViewing = ref(false)
const endVideoViewing = ref(false)
const hotspotViewing = ref(false)

const hotspot = ref({})

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

const onOpenHotspot = (event: unknown) => {
  hotspot.value = (event as { data: object }).data;
  hotspotViewing.value = true;
}

const onAudioPlay = () => {
  emitter.emit("audio.play");
}

const onEnterPanoScene = (event: unknown) => {
  emitter.emit("panoScene.enter", (event as { data: object }).data)
}

const onIntoVideoComplete = () => {
  introVideoViewing.value = false;
  app.audioManager.start();
}

onStartExperence() {
  homeSceneViewing.value = false;
  introVideoViewing.value = true;
  endVideoViewing.value = false;
  mainSceneViewing.value = true;

  app.glManager.start();
}

beginTravel() {
  app.beginTravel()
}

onMounted(() => {
  const canvas = mainScene.value!
  const canvasScene = canvas.canvasScene as HTMLCanvasElement
  app = new WuHouCiApp(canvasScene);
  app.init();

  setTimeout(() => {
    app.loader.start();
    onLoadingStart();
  }, 1000)

  app.loader.addEventListener("start", onLoadingStart)
  app.loader.addEventListener("progress", onLoadingProgress)
  app.loader.addEventListener("complete", onLoadingComplete)

  app.addEventListener("hotspot.open", onOpenHotspot);
  app.addEventListener("audio.play", onAudioPlay);
  app.addEventListener("panoScene.enter", onEnterPanoScene);
  app.addEventListener("minimap.update", (event: unknown) => {
    emitter.emit("minimap.update", (event as { data: object }).data);
  })
  app.addEventListener("flow.open", (event: unknown) => {
    emitter.emit("flow.open", (event as { data: object }).data);
  })
  app.addEventListener("flow.close", (event: unknown) => {
    emitter.emit("flow.close", (event as { data: object }).data);
  })

  emitter.on("introVideo.complete", onIntoVideoComplete);
  emitter.on("startExperence", onStartExperence);
  emitter.on("beginTravel", beginTravel);
  emitter.on("endTravel", onEndTravel)
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
