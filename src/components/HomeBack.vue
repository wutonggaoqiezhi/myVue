<template>
  <div class="container">

    <HomeScene :class="{ 'hide': !homeSceneViewing }" v-if="homeSceneViewing"></HomeScene>
    <!-- <home-scene :class="{ 'hide': !homeSceneViewing }" v-if="homeSceneViewing"></home-scene>
    <main-scene :class="{ 'hide': !mainSceneViewing }" ref="mainScene"></main-scene>

    <video-intro v-if="introVideoViewing"></video-intro>
    <video-end v-if="endVideoViewing"></video-end>

    <hotspot v-if="hotspotViewing" :class="{ 'hide': !hotspotViewing }" :hotspot="hotspot"></hotspot>
    <app-footer></app-footer> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCurrentInstance } from 'vue'

// import WuHouCiApp from '@/WuHouCiApp'

import HomeScene from './HomeScene/index.vue'

const instance = getCurrentInstance()
console.log('instance - ', instance?.proxy?.$emitter)

const homeSceneViewing = ref(true)
// const introVideoViewing = ref(false)
// const endVideoViewing = ref(false)
// const mainSceneViewing = ref(false)
// const hotspotViewing = ref(false)

// const hotspot = {}

onMounted(async () => {
  const dom = (document.querySelector("#canvasScene") as HTMLCanvasElement | null);
  console.log('dom - ', dom)
  // const app = new WuHouCiApp(dom!);
  // // @ts-expect-error: Assigning to a global variable for debugging purposes
  // window["WHC"] = app
});

// import Hotspot from "./Hotspot"
// import HomeScene from "./HomeScene"
// import MainScene from "./MainScene"
// import AppFooter from "./Footer"
// import VideoIntro from './Videos/Intro'
// import VideoEnd from './Videos/End'

// import WuHouCiApp from '../WuHouCiApp';
// import GUIManager from '../webgl/gui/GUIManager'


// export default {
//   components: {
//     Hotspot,
//     HomeScene,
//     MainScene,
//     AppFooter,


//     VideoIntro,
//     VideoEnd,
//   },
//   data() {
//     return {

//       app: null,
//       GUIManager: null,

//       homeSceneViewing: true,
//       introVideoViewing: false,
//       endVideoViewing: false,
//       mainSceneViewing: false,
//       hotspotViewing: false,

//       hotspot: {}
//     }
//   },
//   mounted() {

//     //this.UIManager = new GUIManager( document.body);

//     try {


//       this.app = window["WHC"] = new WuHouCiApp(this.$refs["mainScene"].$el.querySelector("#canvasScene"));
//       this.app.init();

//       setTimeout(() => {
//         this.app.loader.start();
//         this.onLoadingStart();
//       }, 1000)

//       this.app.loader.addEventListener("start", this.onLoadingStart)
//       this.app.loader.addEventListener("progress", this.onLoadingProgress)
//       this.app.loader.addEventListener("complete", this.onLoadingComplete)

//       this.app.addEventListener("hotspot.open", this.onOpenHotspot);
//       this.app.addEventListener("audio.play", this.onAudioPlay);
//       this.app.addEventListener("panoScene.enter", this.onEnterPanoScene);
//       this.app.addEventListener("minimap.update", (event) => { this.$Bus.$emit("minimap.update", event.data); })
//       this.app.addEventListener("flow.open", (event) => { this.$Bus.$emit("flow.open", event.data); })
//       this.app.addEventListener("flow.close", (event) => { this.$Bus.$emit("flow.close", event.data); })

//       this.$Bus.$on("introVideo.complete", this.onIntoVideoComplete);
//       this.$Bus.$on("startExperence", this.onStartExperence);
//       this.$Bus.$on("beginTravel", this.beginTravel);
//       this.$Bus.$on("endTravel", this.onEndTravel)

//       this.$Bus.$on("travelAgain", this.travelAgain);

//       this.$Bus.$on("hotspot.close", this.onCloseHotspot);
//       this.$Bus.$on("mainScene.back", this.onBack);

//       //Audio
//       this.$Bus.$on("audio.trigger", this.onAudioTrigger);
//       this.$Bus.$on("audio.muted", this.onAudioMuted);

//       window["glManager"] = this.app.glManager;

//     } catch (error) {
//       throw (error)
//     }


//   },
//   methods: {

//     onLoadingStart() {

//       this.$Bus.$emit("load.start");
//     },

//     onLoadingProgress(event) {

//       this.$Bus.$emit("load.progress", event.data.loaded / event.data.total);
//     },

//     onLoadingComplete() {

//       this.$Bus.$emit("load.complete");
//       this.UIManager && this.UIManager.generateUIControls(this.app.glManager);

//     },
//     onStartExperence() {

//       this.homeSceneViewing = false;
//       this.introVideoViewing = true;
//       this.endVideoViewing = false;
//       this.mainSceneViewing = true;

//       this.app.glManager.start();
//     },
//     beginTravel() {
//       this.app.beginTravel()
//     },
//     onEndTravel() {

//       this.endVideoViewing = true;
//       this.mainSceneViewing = false;
//       this.app.reset();

//     },
//     travelAgain() {

//       this.onStartExperence();
//       this.$Bus.$emit("startExperence");

//     },
//     onIntoVideoComplete() {


//       this.introVideoViewing = false;
//       this.app.audioManager.start();

//     },
//     onEnterPanoScene(event) {

//       this.$Bus.$emit("panoScene.enter", event.data)
//     },
//     onExistPanoScene() {

//       this.$Bus.$emit("panoScene.exsit")
//     },
//     onBack(flow) {

//       this.app.closeFlow(flow);

//     },
//     onOpenHotspot(event) {

//       this.hotspot = event.data;
//       this.hotspotViewing = true;

//     },
//     onCloseHotspot(id) {

//       this.app.closeHotspot(id);
//       this.hotspotViewing = false;
//     },

//     onAudioTrigger(isPlay) {
//       this.app.audioManager.trigger(isPlay);
//     },
//     onAudioMuted(isMuted) {
//       this.app.audioManager.muted(isMuted);
//     },
//     onAudioPlay() {
//       this.$Bus.$emit("audio.play");
//     }
//   }
// };

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
