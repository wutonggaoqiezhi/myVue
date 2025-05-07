<template>
  <div class="sanguo-map">
    <div class="title">
      <p>{{ $t('Addition.Map.title') }}</p>
    </div>
    <div class="description">
      <div class="border" style="left:0;top:0;transform:translate(-50%,-70%)"></div>
      <div class="border" style="left:100%;top:100%;transform:translate(-50%,-50%) scale(-1,-1)"></div>
      <div v-html="resources.description"></div>
    </div>

    <div class="map-container">
      <div class="map">
        <img :src="total" height="100%" />
        <img class="patial wei" :class="{ 'active': selectedIndex == 0 }" :src="wei" height="100%"
          @mouseenter="onMouseEnter(0)" @mouseleave="onMouseOut()" />
        <img class="patial shu" :class="{ 'active': selectedIndex == 1 }" :src="shu" height="100%"
          @mouseenter="onMouseEnter(1)" @mouseleave="onMouseOut()" />
        <img class="patial wu" :class="{ 'active': selectedIndex == 2 }" :src="wu" height="100%"
          @mouseenter="onMouseEnter(2)" @mouseleave="onMouseOut()" />
      </div>
      <div class="info">
        <div class="lines">
          <svg viewBox="0 0 1000 400">
            <path class="path path-wei" d="M 431 183 l 0 -80 l 320 0" />
            <path class="path path-shu" d="M 360 235 l 260 0" />
            <path class="path path-wu" d="M 493 210 l 0 160 l 325 0" />
          </svg>
        </div>
        <div class=" intro wei" @mouseenter="onMouseEnter(0)" @mouseleave="onMouseOut()">
          <div>{{ resources.map.Wei.leader }}</div>
          <div class="name" :class="{ 'active': selectedIndex == 0 }">{{ resources.map.Wei.name }}</div>
          <div class="time" :class="{ 'active': selectedIndex == 0 }">{{ resources.map.Wei.year }}</div>
        </div>
        <div class=" intro shu" @mouseenter="onMouseEnter(1)" @mouseleave="onMouseOut()">
          <div>{{ resources.map.Shu.leader }}</div>
          <div class="name" :class="{ 'active': selectedIndex == 1 }">{{ resources.map.Shu.name }}</div>
          <div class="time" :class="{ 'active': selectedIndex == 1 }">{{ resources.map.Shu.year }}</div>
        </div>
        <div class=" intro wu" @mouseenter="onMouseEnter(2)" @mouseleave="onMouseOut()">
          <div>{{ resources.map.Wu.leader }}</div>
          <div class="name" :class="{ 'active': selectedIndex == 2 }">{{ resources.map.Wu.name }}</div>
          <div class="time" :class="{ 'active': selectedIndex == 2 }">{{ resources.map.Wu.year }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import total from '@/assets/addition/SanguoMap/total.png'
import wei from '@/assets/addition/SanguoMap/wei.png'
import shu from '@/assets/addition/SanguoMap/shu.png'
import wu from '@/assets/addition/SanguoMap/wu.png'

interface MapResources {
  description: string;
  map: {
    Wei: { leader: string; name: string; year: string };
    Shu: { leader: string; name: string; year: string };
    Wu: { leader: string; name: string; year: string };
  };
}

defineProps<{
  resources: MapResources;
}>()

const selectedIndex = ref(-1)

const onMouseEnter = (index: number) => {
  selectedIndex.value = index;
}

const onMouseOut = () => {
  selectedIndex.value = -1;
}
</script>

<style lang="less" scoped>
.sanguo-map {

  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;

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
    font-size: 2.2rem;
    white-space: nowrap;

    background-image: url("../../assets/images/addition/title-bg.png");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;


  }

  .description {
    position: absolute;

    top: 15rem;
    left: 50%;
    transform: translateX(-50%);

    line-height: 2.2rem;
    text-align: center;
    color: #232323;

    .border {
      position: absolute;
      width: 150px;
      height: 50px;
      z-index: 1;
      background-image: url("../../assets/images/addition/card-border.png")
    }
  }

  .map-container {
    position: absolute;
    top: 35rem;

    display: flex;
    justify-content: space-between;

    width: 1000px;
    height: 400px;

    .map {
      position: relative;
      left: 0;
      height: 100%;

      img {
        position: absolute;
      }

      .patial {
        opacity: 0;
        transition: opacity 0.5s 0.2s ease-in-out;
        cursor: pointer;

        &.active {
          opacity: 1;
        }

        &.wei {
          transform: scale(0.45) translate(-528px, -120px);
        }

        &.shu {
          transform: scale(0.36) translate(330px, 178px);
          z-index: 3;
        }

        &.wu {
          transform: scale(0.49) translate(440px, 178px);
        }
      }
    }

    .info {
      position: relative;
      width: 100%;
      height: 100%;

      z-index: 10;
      pointer-events: none;

      svg {
        width: 1000px;
        height: 400px;
      }

      .lines {
        position: absolute;

        pointer-events: none;

        .path {
          stroke-width: 1px;
          fill: none;
          stroke: #000;
        }
      }

      .intro {
        position: absolute;

        height: 100px;
        cursor: pointer;
        pointer-events: all;

        .time {
          width: 200px;
          height: 30px;

          line-height: 35px;
          color: white;

          background-image: url('../../assets/images/addition/time-bg-normal.png');
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          transition: color 0.5s ease-in-out;

          transition: background-image 0.5s 0.2s ease-in-out;

          &.active {
            background-image: url('../../assets/images/addition/time-bg-active.png');
          }

        }

        .name {
          font-size: 1.5rem;
          transition: color 0.5s 0.2s ease-in-out;

          &.active {
            color: #860000;
          }
        }

        &.wei {
          left: 750px;
          top: 50px;
        }

        &.shu {
          left: 620px;
          top: 180px;
        }

        &.wu {
          left: 820px;
          top: 310px;
        }
      }
    }
  }

  .anim-path {
    stroke-dashoffset: 0;
    stroke: #860000;
  }
}

@keyframes animPath {
  from {
    stroke-dasharray: 0;
  }

  to {
    stroke-dasharray: 1000, 1000;
  }
}
</style>
