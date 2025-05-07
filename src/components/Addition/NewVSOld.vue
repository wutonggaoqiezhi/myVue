<template>
  <div class="new-vs-old">
    <div class="description">
      <div class="border" style="left:0;top:0;transform:translate(-50%,-70%)"></div>
      <div class="border" style="left:100%;top:100%;transform:translate(-50%,-50%) scale(-1,-1)"></div>
      <h1>{{ $t('Addition.NewVsOld.smriti') }}</h1>
      <p>{{ $t('Addition.NewVsOld.description') }}</p>
    </div>

    <div class="title">
      <p>{{ resources[activeIndex].title }}{{ $t('Addition.NewVsOld.title') }}</p>
    </div>

    <div class="main" @mousemove="onMouseMove($event)" @touchmove="onTouchMove($event)" @mouseup="onMouseUp()"
      @touchend="onTouchEnd()">
      <div class="drag" @mousedown="onMouseDown($event)" @touchstart="onTouchStart($event)"
        :style="{ 'left': `${dragState.x}px` }">
        <span class="ring blink" style="width: 90px;height: 90px;animation-delay:30ms  "></span>
        <span class="ring blink" style="width: 66px;height: 66px;animation-delay: "></span>
      </div>
      <div class="main-item new"
        :style="{ 'background-image': `url(${resources[activeIndex].images.new})`, 'width': `${dragState.x}px` }">
        <!-- <img :src="resources[activeIndex].images.new" /> -->
      </div>
      <div class="main-item old"
        :style="{ 'background-image': `url(${resources[activeIndex].images.old})`, 'width': `${dragState.max - dragState.x}px` }">
        <!-- <img :src="resources[activeIndex].images.old" /> -->
      </div>

    </div>
    <div class="preview">
      <button class="pre-btn left" @click="next()"></button>
      <div class="pre-viewport">
        <ul class="pre-list" :style="{ 'transform': `translateX(${-180 * activeIndex}px)` }">
          <li v-for="(item, index) in resources" :key="index" class="pre-item"
            :class="{ 'active': activeIndex == index }"
            :style="{ 'transform': `translateX(${1}px)`, 'background-image': `url(${item.preview})` }"
            @click="tab(index)">
            <!-- <img :src="" width="100%" height="100%">  -->
            <div class="mask">
              {{ item.title }}<br />
              {{ $t('Addition.NewVsOld.title') }}
            </div>
          </li>
        </ul>
      </div>
      <button class="pre-btn right" @click="prev()"></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
  resources: Array<{ title: string; images: { new: string; old: string }; preview: string }>
}>()

const activeIndex = ref(0)
const dragState = ref({
  max: 600,
  x: 600 * 0.5,
  mousedown: false,
  mouseMoveStartX: 0,
  touch: false,
  touchMoveStartX: 0,
})

const onMouseUp = () => {
  dragState.value.mousedown = false
  document.body.style.cursor = "auto"
}

onMounted(() => {
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mouseleave", onMouseUp);
})

const prev = () => {
  let length = props.resources.length;
  if (activeIndex.value == length) return;
  activeIndex.value = (activeIndex.value + length + 1) % length;
}

const next = () => {
  let length = props.resources.length;
  if (activeIndex.value == 0) return;
  activeIndex.value = (activeIndex.value + length - 1) % length;
}

const tab = (index: number) => {
  activeIndex.value = index;
}

const onMouseDown = (event: MouseEvent) => {
  dragState.value.mousedown = true;
  //this.dragState.x = this.$el.querySelector(".drag").offsetLeft;
  dragState.value.mouseMoveStartX = event.clientX;
  document.body.style.cursor = "e-resize"
}

const onTouchStart = (event: TouchEvent) => {
  dragState.value.touch = true;
  //dragState.value.x = event.clientX;
  dragState.value.touchMoveStartX = event.touches[0].clientX;
}

const onMouseMove = (event: MouseEvent) => {
  if (dragState.value.mousedown) {
    let movementX = event.clientX - dragState.value.mouseMoveStartX;
    dragState.value.x = Math.min(Math.max(dragState.value.x + movementX, 0), dragState.value.max)
    dragState.value.mouseMoveStartX = event.clientX;
  }
}

const onTouchMove = (event: TouchEvent) => {
  if (dragState.value.touch) {
    let movementX = event.touches[0].clientX - dragState.value.touchMoveStartX;
    dragState.value.x = Math.min(Math.max(dragState.value.x + movementX, 0), dragState.value.max)
    dragState.value.touchMoveStartX = event.touches[0].clientX;
  }
}

const onTouchEnd = () => {
  dragState.value.touch = false;
}

// const halfLength = ref(Math.ceil(resource.NewVsOld.length / 2))
</script>

<style lang="less" scoped>
.new-vs-old {

  position: absolute;
  width: 100%;
  height: 100%;


  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .description {

    position: absolute;

    top: 15%;
    left: 80px;
    width: 300px;

    overflow: visible;




    line-height: 2.2rem;
    text-align: justify;
    color: #232323;


    .border {
      position: absolute;
      width: 150px;
      height: 50px;
      z-index: 0;
      background-image: url("../../assets/images/addition/card-border.png")
    }

  }

  .title {

    position: absolute;
    left: 50%;
    top: 5rem;
    transform: translateX(-50%);

    padding-top: 15px;
    padding-bottom: 10px;

    padding-left: 10%;
    padding-right: 10%;

    color: #ffffff;
    font-size: 2.5rem;
    white-space: nowrap;

    background-image: url("../../assets/images/addition/title-bg.png");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;


  }

  .main {

    width: 600px;
    height: 450px;
    min-width: 500px;
    min-height: 280px;
    position: absolute;
    left: 50%;
    top: 150px;
    transform: translateX(-50%);

    display: flex;
    justify-content: center;
    align-items: center;

    // overflow: hidden;

    .main-item {
      position: absolute;

      top: 0;
      height: 100%;
      background-size: 600px 450px;
      background-repeat: no-repeat;
      transition: background-image 0.5s 0.2s ease-in-out;


      &.new {
        left: 0;
        width: 50%;
        background-position: left;
      }

      &.old {
        right: 0;
        width: 50%;
        background-position: right;
      }

    }

    .drag {

      position: absolute;


      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #ffffff;
      z-index: 1;
      transform: translateX(-50%);
      background-image: url("../../assets/images/addition/drag.png");
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;


      &:hover {
        cursor: pointer;
      }

      &:active {
        cursor: e-resize;
      }


      &:hover .ring {
        animation: none;
        transform: translate(-50%, -50%) scale(1.0);
        opacity: 0;
      }


      .ring {


        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: block;

        background-color: transparent;
        border: 1px solid white;
        border-radius: 50%;
        animation-name: blink;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;


      }

    }

  }

  .preview {

    position: absolute;
    bottom: 10rem;
    left: 50%;
    transform: translateX(-50%);


    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 70%;
    height: 150px;

    .pre-viewport {

      position: relative;

      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;

      width: 80%;
      height: 100%;


      .pre-list {

        position: absolute;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        transition: transform 0.5s 0.2s ease-in-out;

      }

      .pre-item {

        width: 160px;
        height: 120px;

        margin: 0 10px;
        cursor: pointer;
        background-origin: border-box;

        transition: border-color 0.5s 0.2s;

        color: #fefefe;
        font-size: 16px;

        &:hover .mask {
          opacity: 0;
        }

        .mask {

          position: absolute;

          display: flex;
          justify-content: center;
          align-items: center;

          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          transition: opacity 0.3s ease-in-out;

        }


        img {
          width: 100%;
          height: 100%;
        }

        &.active {
          border: 4px solid #860000;
        }


      }

    }

    .pre-btn {
      width: 30px;
      height: 80px;
      border: none;
      background-color: transparent;
      background-image: url("../../assets/images/addition/arrow-left-normal.png");
      background-size: contain;
      background-repeat: no-repeat;
      cursor: pointer;

      &:hover {
        background-image: url("../../assets/images/addition/arrow-left-hover.png");
      }

      &.right {
        transform: scaleX(-1);
      }
    }
  }
}


@keyframes blink {
  0% {
    transform: translate(-50%, -50%) scale(1.0);
    opacity: 1;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}
</style>
