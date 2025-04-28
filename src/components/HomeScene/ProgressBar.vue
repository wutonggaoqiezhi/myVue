<template>
  <div class="progress-bar" :class="{ 'hide': hide }">
    <h4>{{ progressText }}</h4>
    <canvas id="canvasProgress" :width="600" :height="40"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';

import * as THREE from 'three';
import { TweenLite } from 'gsap'
import Renderer2D from "@/utils/Renderer2D.js";

import type { Emitter } from 'mitt';

let renderer: Renderer2D

const hide = ref(false)
const progressText = ref('00')

const emitter = inject('$emitter') as Emitter<Record<string, unknown>>


onMounted(() => {
  const textureLoader = new THREE.TextureLoader();
  const texuture = textureLoader.load("images/loader-bar/bar.png"),
    mask = textureLoader.load("images/loader-bar/mask.png");

  renderer = new Renderer2D(document.querySelector('#canvasProgress')!, 'loader', [texuture, mask]).setUniformsValue("progress", 0);
})

const onLoadingProgress = (progress: string) => {
  progressText.value = Math.min(100, Math.max(0, parseInt(progress) * 100)).toString()
  TweenLite.to(renderer.getUniform("progress"), 0.8, { value: progress }).eventCallback("onUpdate", () => { renderer.render() })
}

const onLoadingComplete = () => {
  hide.value = true;
}

emitter.on('load.progress', onLoadingProgress as (event: unknown) => void);
emitter.on('load.complete', onLoadingComplete);

</script>

<style lang="less" scoped>
.progress-bar {
  top: 235px;
  position: relative;
  height: 40px;
  opacity: 0.8;
  transition: opacity 0.5s 500ms ease-out;
  pointer-events: none;

  h4 {
    position: absolute;
    top: -120px;
    left: 50%;
    width: 500px;
    height: 70px;
    margin-left: -250px;
    text-align: center;
    font-family: BRUX, sans-serif;
    font-size: 48px;
    color: #000;
    letter-spacing: 15px;
  }

  canvas {
    width: 100%;
    height: 100%;
  }
}

.hide {
  opacity: 0;
}
</style>
