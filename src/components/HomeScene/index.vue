<template>
  HomeScene
  <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut">
    <div class="canvas-2d" :style="{ zIndex: 2 }">
      <template v-if="!isExperience">
        <div class="canvas-2d-wrapper" style="min-width:1024px;height:100%">
          <canvas id="canvasBuild" width="1200" height="1173" />
        </div>
        <LogoComponent />
      </template>
    </div>
  </transition>
</template>

<script setup lang="ts">
import * as THREE from 'three'

import Renderer2D from '@/utils/Renderer2D';
import LogoComponent from './LogoComponent.vue';

import { getCurrentInstance, onMounted, ref } from 'vue';

import { TweenMax } from 'gsap';
import * as gsap from 'gsap'

let animGreet: gsap.Animation

const instance = getCurrentInstance()

// const show = ref(true)
// const isVideo = ref(false)
const isExperience = ref(false)

// const props = defineProps({
//   start: Boolean
// })

const playGreet = () => {
  animGreet.play();
}

const onLoadStart = () => {
}

const onLoadComplete = () => {
  isExperience.value = true;
}

instance?.proxy?.$emitter.on("load.start", onLoadStart);
instance?.proxy?.$emitter.on("load.complete", onLoadComplete);

onMounted(() => {
  // @ts-expect-error: 'this' is used to assign a property to the global window object
  window.testComponent = this;

  const canvas = document.querySelector('#canvasBuild') as HTMLCanvasElement
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight

  const imgBackground = new THREE.TextureLoader().load("images/home-bg.png");
  const imgMask = new THREE.TextureLoader().load("images/mask-preloader-half.jpg");

  const rendererBuild = new Renderer2D(document.querySelector('#canvasBuild')!, 'background', [imgBackground, imgMask]).setUniformsValue("progress", 0);

  animGreet = TweenMax.to(rendererBuild.getUniform("progress")!, 2, {
    value: 1,
    paused: false,
    // ease: Sine.easeIn
  }).eventCallback("onUpdate", () => {
    rendererBuild.render()
  })

  playGreet();
})

// export default {
//   components: {
//     Logo
//   },
//   props: {
//     start: Boolean
//   },
//   data() {
//     return {
//       show: true,
//       isVideo: false,
//       isExperience: false
//     };
//   },
//   created() {

//     this.$Bus.$on("load.start", this.onLoadStart);
//     this.$Bus.$on("load.complete", this.onLoadComplete);

//   },
//   mounted() {

//     window.testComponent = this;

//     const canvas = this.$el.querySelector('#canvasBuild')
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight

//     const imgBackground = new THREE.TextureLoader().load("images/home-bg.png");
//     const imgMask = new THREE.TextureLoader().load("images/mask-preloader-half.jpg");

//     const rendererBuild = new Renderer2D(this.$el.querySelector('#canvasBuild'), 'background', [imgBackground, imgMask]).setUniformsValue("progress", 0);

//     animGreet = TweenMax.to(rendererBuild.getUniform("progress"), 2, { value: 1, paused: false, ease: Sine.easeIn })
//       .eventCallback("onUpdate", (params) => { rendererBuild.render() })
//     this.playGreet();
//   },
//   methods: {

//     playGreet() {

//       animGreet.play();

//     },

//     onLoadStart() {


//     },

//     onLoadComplete() {

//       // this.isExperience = true;

//     }

//   }
// }
</script>

<style lang="less" scoped>
.canvas-2d {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;

  .canvas-2d-wrapper {
    position: absolute;
    display: block;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  #canvasCloud,
  #canvasBuild {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  #canvasBuild {
    z-index: 10;
  }

  .progress-bar {
    position: absolute;
    bottom: 50%;
    left: 50%;
    width: 600px;
    margin-left: -300px;
    margin-bottom: -40px;
    z-index: 1;
  }
}
</style>
