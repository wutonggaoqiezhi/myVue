<template>
  <div class="video-intro" :class="{ mask: isMask }" v-if="isShow">
    <canvas id="canvas" width="1920" height="1173"></canvas>
    <video id="video" name="media" controls crossorigin="anonymous">
      <source :src="src" type="video/mp4">
    </video>
    <button class="btn-skip" @click="onVideoComplete()">{{ $t("Video.btnSkip") }}</button>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import emitter from '@/utils/bus';
import * as gsap from 'gsap';
import { TweenMax } from 'gsap';
import Renderer2D from '@/utils/Renderer2D';

const isMask = ref(true);
const isShow = ref(true);
const src = ref(`video/intro-${localStorage.getItem("wuhouci-lang") || 'zh'}.mp4`);

const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)

let video: HTMLVideoElement | null;
let render: Renderer2D;
let animShow: gsap.Animation;
let animHide: gsap.Animation;

const onAudioMuted = (muted: unknown) => {
  video!.muted = muted as boolean;
}

const onVideoComplete = () => {
  animHide.play();
}

const play = () => {
  animShow.play();
}

emitter.on("audio.muted", onAudioMuted);

onMounted(() => {
  video = videoElement.value!.querySelector('#video')

  const videoTexture = new THREE.VideoTexture(video!)
  videoTexture.minFilter = THREE.NearestFilter

  render = new Renderer2D(
    canvasElement.value!.querySelector('#canvas')!,
    'background',
    [
      videoTexture,
      new THREE.TextureLoader().load("images/mask-preloader-half.jpg")
    ]
  ).setUniformsValue("progress", 0)

  const loopRender = () => {
    render.render();
    requestAnimationFrame(loopRender)
  }

  animShow = TweenMax.to({ value: 0 }, 2, { value: 1, paused: true })
    .eventCallback("onStart", () => {
      video!.play();
    })
    .eventCallback("onUpdate", (params) => {
      render.setUniformsValue("progress", params.ratio);
    }, ["{self}"])
    .eventCallback("onComplete", () => {
      isMask.value = false;
    })

  animHide = TweenMax.to({ value: 0 }, 2, { value: 1, paused: true })
    .eventCallback("onUpdate", (params) => {
      render.setUniformsValue("progress", 1 - params.ratio);
      video!.volume = 1 - params.ratio
    }, ["{self}"])
    .eventCallback("onComplete", () => {
      emitter.emit("introVideo.complete")
    })
  video!.addEventListener('ended', () => {
    onVideoComplete();
  }, false)

  loopRender()
  play();
})
</script>

<style lang="less" scoped>
.video-intro {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

  &.mask {
    background-color: #fff;
  }

  canvas {
    width: 100%;
    height: 100%;
  }

  video {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    transform: translate(-100%);
  }

  .btn-skip {
    display: block;
    position: fixed;
    right: 50px;
    bottom: 80px;

    width: 70px;
    height: 70px;

    color: #860000;
    cursor: pointer;
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-image: url("../../assets/images/ui/btn-radiu-normal.png");
    transition: color 0.2s ease-in-out;

    &:hover {

      background-image: url("../../assets/images/ui/btn-radiu-hover.png");
      color: #ffffff
    }

  }
}
</style>
