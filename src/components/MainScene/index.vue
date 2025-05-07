<template>
  <div class="canvas-3d" :class="{ 'modal': showGreete }">
    <canvas id="canvasScene" style="width:100%;height:100%"></canvas>
    <GreeteComponent v-if="showGreete" @beginTravel="beginTravel()"></GreeteComponent>

    <div class="buttons" v-show="showSceneUI">
      <button class="button btn-arrow-left" @click.stop="onExsitPanoScene()">
        <span>{{ $t('MainScene.btnBack') }}</span>
      </button>
    </div>

    <button class="button-menu" @click="toogleDescription()" v-show="showSceneUI"></button>
    <button class="button-audio" v-show="showSceneUI"
      :class="audioPlaying ? 'bg-hotspot-audio-pause' : 'bg-hotspot-audio-play'" @click.stop="triggerAudio()">
    </button>

    <div class="scene-description" :class="{ 'hide': !showDescription }">
      {{ sceneDescription.content }}
    </div>

    <TipsComponent v-if="showTips"></TipsComponent>

    <button class="btn-rectangle left" @click="setAdditionVisible(true)" v-if="showBtnMore">
      {{ $t('MainScene.btnMore') }}
    </button>
    <button class="btn-rectangle right" @click="endTravel()" v-if="showBtnMore">{{ $t('MainScene.btnStop') }}</button>

    <addition v-if="showAddition" @hide="setAdditionVisible(false)"></addition>

    <MinMap v-if="showSceneUI" :flow='flow'></MinMap>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import emitter from '@/utils/bus';
import GreeteComponent from './GreeteComponent.vue';
import ScenesDescription from './ScenesDescription';
import MinMap from '../MinMap/index.vue'
import Addition from '../Addition/index.vue'
import TipsComponent from './TipsComponent.vue';

const showGreete = ref(true)
const showBtnMore = ref(false)
const showSceneUI = ref(false)
const flow = ref(0)
const showDescription = ref(false)
const audioPlaying = ref(true)
const sceneDescription = ref<{ title: string, content: string }>({ title: '', content: '' })
const showTips = ref(false)
const showAddition = ref(false)

const beginTravel = () => {
  emitter.emit("beginTravel");
  showGreete.value = false;
  showBtnMore.value = true;
}

const onExsitPanoScene = () => {
  showSceneUI.value = false;
  emitter.emit("mainScene.back", flow);
}

const toogleDescription = () => {
  showDescription.value = !showDescription.value;
}

const triggerAudio = () => {
  audioPlaying.value = !audioPlaying.value;
  emitter.emit("audio.trigger", audioPlaying);
  console.log(`热点音频${audioPlaying.value ? "播放中" : "暂停中"}`);
}

const setAdditionVisible = (visible: boolean) => {
  showAddition.value = visible;
  document.body.querySelectorAll(".guidepost").forEach(item => {
    (item as HTMLElement).style.zIndex = visible ? '0' : '2';
  })
}

const endTravel = () => {
  emitter.emit("endTravel");
  showGreete.value = false;
  showBtnMore.value = true;
}

const onStartExperence = () => {
  showGreete.value = true;
  showBtnMore.value = false;
}

const onEnterPanoScene = (num: unknown) => {
  showSceneUI.value = true;
  flow.value = num as number;
  showTips.value = true;
  //To Optimize
  const lang = (localStorage.getItem("wuhouci-lang") || 'zh') as keyof typeof ScenesDescription;
  let description = ScenesDescription[lang];
  switch (flow.value) {
    case 7:
      sceneDescription.value = description.LiuBeiDian
      console.log(sceneDescription)
      break;
    case 8:
      sceneDescription.value = description.WuHouCi
      break;
  }
}

const onOpenFlow = () => {
  showBtnMore.value = false;
}

const onCloseFlow = () => {
  showBtnMore.value = true;
}

const onAudioPlay = () => {
  audioPlaying.value = true;
}


emitter.on("startExperence", onStartExperence);
emitter.on("panoScene.enter", onEnterPanoScene);
emitter.on("flow.open", onOpenFlow);
emitter.on("flow.close", onCloseFlow);
emitter.on("audio.play", onAudioPlay);

document.addEventListener('mousedown', () => {
  showTips.value = false;
})
</script>

<style lang="less" scoped>
button {

  border: none;
  background-color: transparent;
  background-size: cover;
  background-repeat: no-repeat;
  pointer-events: all;
  cursor: pointer;
}

.button-menu {
  display: inline-block;
  position: absolute;
  left: 5rem;
  top: 4rem;
  width: 6rem;
  height: 6rem;

  background-image: url("../../assets/images/ui/menu.png");
}

.button-audio {

  display: inline-block;
  position: absolute;
  right: 5rem;
  top: 4rem;
  width: 5rem;
  height: 5rem;

}

.bg-hotspot-audio-play {
  background-image: url("../../assets/images/ui/hotspot-audio-play.png");
}

.bg-hotspot-audio-pause {
  background-image: url("../../assets/images/ui/hotspot-audio-pause.png");
}


.scene-description {

  position: absolute;

  left: 7rem;
  top: 12rem;

  width: 300px;

  padding: 15px;
  line-height: 20px;
  border-radius: 5px;
  text-indent: 2rem;
  text-align: justify;

  background-color: rgba(0, 0, 0, 0.6);
  color: #ffffff;

  transition: opacity 0.5s 0.2s ease-in-out;

  &.hide {

    opacity: 0;
  }

}

.canvas-3d {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  visibility: visible;
  z-index: 1;

  canvas {
    width: 100%;
    height: 100%;
  }

  .btn-rectangle {

    position: absolute;

    top: 50%;

    width: 100px;
    height: 80px;

    cursor: pointer;
    color: #ffffff;
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-image: url("../../assets/images/ui/border-rectangle2.png");

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }

  }


}

.modal {

  background: rgba(0, 0, 0, 0.8)
}

.buttons {

  display: flex;
  justify-content: space-around;
  align-items: center;

  position: fixed;
  right: 5.5rem;
  bottom: 6.5rem;
  z-index: 10;

  width: 250px;
  height: 100px;


  button {

    width: 120px;
    height: 60px;

    cursor: pointer;
    color: #820000;
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-image: url("../../assets/images/ui/btn-pano-normal.png");

    &:hover {
      color: #FFFFFF;
      background-image: url("../../assets/images/ui/btn-pano-hover.png");

    }
  }

}
</style>
