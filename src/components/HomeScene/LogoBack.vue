<template>
  Logo
  <!-- <div class="logo">
    <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut">
      <span class="seal" v-if="readyExperence"></span>
    </transition>
    <template v-if="readyLogo">
      <div class="canvas-words-1">
        <canvas id="canvas-words-1" width="1156" height="280"></canvas>
      </div>
      <div class="canvas-words-2">
        <canvas id="canvas-words-2" width="900" height="90"></canvas>
      </div>
      <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut">
        <button v-show="readyExperence" class="btn-startExperience" @click.stop="startExperence()"><span>{{ loading ?
          $t("Logo.btnStartExperience.loading") : $t("Logo.btnStartExperience.loaded") }}</span></button>
      </transition>
    </template>
<progress-bar></progress-bar>
</div> -->
</template>

<script setup lang="ts" name="LogoComponent">
// import { ref, onMounted, onBeforeUnmount, inject } from 'vue';
// import * as THREE from 'three';

// import Renderer2D from '@/utils/Renderer2D';
// import ProgressBar from './ProgressBar.vue';
// import { TweenMax } from 'gsap';

// import type { Emitter } from 'mitt';

// console.log('aaa')

// const emitter = inject('$emitter') as Emitter<Record<string, unknown>>

// const readyLogo = ref(true);
// const readyExperence = ref(false);
// const loading = ref(false);
// let animLogo1: gsap.Animation
// let animLogo2: gsap.Animation

// const onLoadingStart = () => {
//   // Add logic for loading start if needed
// };

// const onLoadingComplete = () => {
//   readyLogo.value = true;
//   if (animLogo1) animLogo1.play();
//   if (animLogo2) animLogo2.play();
// };

// const startExperence = () => {
//   emitter.emit("startExperence");
// };

// onBeforeUnmount(() => {
//   emitter.off("load.start", onLoadingStart);
//   emitter.off("load.complete", onLoadingComplete);
// });

// onMounted(() => {
//   // @ts-expect-error: 'Logo' is being added to the global 'window' object dynamically
//   window.Logo = { readyLogo, readyExperence, loading, startExperence };

//   emitter.on("load.start", onLoadingStart);
//   emitter.on("load.complete", onLoadingComplete);

//   const textureLoader = new THREE.TextureLoader();
//   const textureLogo1 = textureLoader.load("images/logo/whc-wz-a.png");
//   const textureLogo1mask = textureLoader.load("images/logo/whc-wz.jpg");
//   const textureLogo2 = textureLoader.load("images/logo/whc-pi-a.png");
//   const textureLogo2mask = textureLoader.load("images/logo/whc-pi.jpg");

//   const logo1 = new Renderer2D(document.querySelector('#canvas-words-1')!, 'logo', [textureLogo1, textureLogo1mask]).setUniformsValue("progress", 0);
//   const logo2 = new Renderer2D(document.querySelector('#canvas-words-2')!, 'logo', [textureLogo2, textureLogo2mask]).setUniformsValue("progress", 0);

//   animLogo1 = TweenMax.to(logo1.getUniform("progress")!, 5, {
//     value: 0.99,
//     delay: 0,
//     paused: true,
//     // ease: Sine.easeOut
//   }).eventCallback("onUpdate", () => {
//     logo1.render();
//   });

//   animLogo2 = TweenMax.to(logo2.getUniform("progress")!, 3, { value: 0.8, delay: 3, paused: true })
//     .eventCallback("onUpdate", () => {
//       logo2.render();
//     })
//     .eventCallback("onComplete", () => {
//       readyExperence.value = true;
//     });
// });

// export default {
//   components: {
//     ProgressBar
//   },
//   setup() {
//     const readyLogo = ref(true);
//     const readyExperence = ref(false);
//     const loading = ref(false);
//     let animLogo1 = null;
//     let animLogo2 = null;

//     const onLoadingStart = () => {
//       // Add logic for loading start if needed
//     };

//     const onLoadingComplete = () => {
//       readyLogo.value = true;
//       animLogo1 && animLogo1.play();
//       animLogo2 && animLogo2.play();
//     };

//     const startExperence = () => {
//       window.$Bus.$emit("startExperence");
//     };

//     onMounted(() => {
//       window.Logo = { readyLogo, readyExperence, loading, startExperence };

//       window.$Bus.$on("load.start", onLoadingStart);
//       window.$Bus.$on("load.complete", onLoadingComplete);

//       const textureLoader = new THREE.TextureLoader();
//       const textureLogo1 = textureLoader.load("images/logo/whc-wz-a.png");
//       const textureLogo1mask = textureLoader.load("images/logo/whc-wz.jpg");
//       const textureLogo2 = textureLoader.load("images/logo/whc-pi-a.png");
//       const textureLogo2mask = textureLoader.load("images/logo/whc-pi.jpg");

//       const logo1 = new Renderer2D(document.querySelector('#canvas-words-1'), 'logo', [textureLogo1, textureLogo1mask]).setUniformsValue("progress", 0);
//       const logo2 = new Renderer2D(document.querySelector('#canvas-words-2'), 'logo', [textureLogo2, textureLogo2mask]).setUniformsValue("progress", 0);

//       animLogo1 = TweenMax.to(logo1.getUniform("progress"), 5, { value: 0.99, delay: 0, paused: true, ease: Sine.easeOut }).eventCallback("onUpdate", () => {
//         logo1.render();
//       });

//       animLogo2 = TweenMax.to(logo2.getUniform("progress"), 3, { value: 0.8, delay: 3, paused: true })
//         .eventCallback("onUpdate", () => {
//           logo2.render();
//         })
//         .eventCallback("onComplete", () => {
//           readyExperence.value = true;
//         });
//     });

//     onBeforeUnmount(() => {
//       window.$Bus.$off("load.start", onLoadingStart);
//       window.$Bus.$off("load.complete", onLoadingComplete);
//     });

//     return {
//       readyLogo,
//       readyExperence,
//       loading,
//       startExperence
//     };
//   }
// };
</script>

<style lang="less" scoped>
.logo {
  position: absolute;
  top: 60%;
  left: 50%;
  width: 600px;
  height: 480px;
  margin-top: -240px;
  margin-left: -300px;
  z-index: 11;
}

.title {
  top: -50px;
  position: relative;
  display: inline-block;
  width: 320px;
  height: 40px;
  color: #fff;
}

.seal {
  position: absolute;
  top: -130px;
  right: -230px;
  width: 64px;
  height: 64px;
  background: url("../../assets/images/logo/seal.png");
}

.btn-startExperience {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 200px;

  width: 280px;
  height: 80px;
  padding-top: 8px;
  padding-right: 18px;

  cursor: pointer;
  color: #fff;
  border: none;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  background-image: url("../../assets/images/ui/start-experence.png")
}

.canvas-words-1,
.canvas-words-2 {
  position: absolute;
  left: 50%;

  canvas {
    width: 100%;
    height: 100%;
  }
}

/*
.canvas-words-1 {
    top: -60px;
    width: 806px;
    height: 369px;
    margin-left: -403px;
}

.canvas-words-2 {
    top: -16px;
    width: 500px;
    height: 250px;
    margin-left: -250px;
}
*/

.canvas-words-1 {
  top: -150px;
  width: 1156px;
  height: 280px;
  margin-left: -578px;
}

.canvas-words-2 {
  top: 100px;
  width: 900px;
  height: 90px;
  margin-left: -450px;
}
</style>
<style lang="postcss">
.logo {
  .title {
    path {
      fill: currentColor;
    }
  }
}
</style>
