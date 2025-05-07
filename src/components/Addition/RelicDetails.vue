<template>
  <div class="relic-details">
    <div class="title">
      <p>{{ $t('Addition.Relics.title') }}</p>
    </div>
    <ul class="pre-list">
      <li v-for="(item, index) in resources" :key="index" class="pre-item" @mouseover="tab(index)"
        @click="showDetail(true)" :style="{
          'background-image': `url(${item.preview})`,
          'transform': `translateX(${(Math.abs(index - activeIndex) >= 3 ? Math.sign(index - activeIndex) * -5 + index - activeIndex : index - activeIndex) * 200}px)
                        scale(${1 - Math.abs((Math.abs(index - activeIndex) >= 3 ? Math.sign(index - activeIndex) * -5 + index - activeIndex : index - activeIndex)) * 0.2}) `,
          'z-index': `${3 - Math.abs((Math.abs(index - activeIndex) >= 3 ? Math.sign(index - activeIndex) * -5 + index - activeIndex : index - activeIndex))}`,
          'opacity': `${1 - Math.abs((Math.abs(index - activeIndex) >= 3 ? Math.sign(index - activeIndex) * -5 + index - activeIndex : index - activeIndex) * 0.3)}`,
          'filter': `blur(${Math.abs((Math.abs(index - activeIndex) >= 3 ? Math.sign(index - activeIndex) * -5 + index - activeIndex : index - activeIndex) * 1)}px)`
        }">
        <!-- <img :src="item.preview" :style="{ }"/> -->
      </li>
    </ul>

    <div class="modal" :class="{ 'hide': !subList.show }" @click="showDetail(false)">
      <ul class="detail-list">
        <button class="detail-btn left" @click.stop="subTab(-1)"></button>
        <li class="detail-item" v-for="(item, index) in resources[activeIndex].images" :key="index"
          :style="{ 'background-image': `url(${item})` }" :class="{ 'hide': subList.index != index }">
        </li>
        <button class="detail-btn right" @click.stop="subTab(1)"></button>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  resources: Array<{ preview: string; images: string[] }>
}>()
const activeIndex = ref(3)
const subList = ref({
  show: false,
  index: 0,
})

const tab = (index: number) => {
  console.log(Math.abs(activeIndex.value - index))
  activeIndex.value = index;
}

const showDetail = (visible: boolean) => {
  subList.value.show = visible;
}

const subTab = (step: number) => {
  let length = props.resources[activeIndex.value].images.length;
  subList.value.index = (subList.value.index + length + step) % length;
}

// halfLength: Math.floor(this.resources.length / 2),
</script>

<style lang="less" scoped>
.relic-details {

  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;


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

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .pre-list {

    position: relative;
    width: 80%;
    min-width: 850px;
    height: 80%;

    display: flex;
    justify-content: center;
    align-items: center;



    .pre-item {

      position: absolute;

      width: 80%;
      max-width: 500px;
      height: 680px;
      cursor: pointer;

      box-shadow: 0 5px 5px #333;

      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;

      transition: all 1s 0.2s ease-in-out;

    }
  }


  .modal {

    position: fixed;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.7);
    transition: transform 0.5s ease-in-out;

    z-index: 10;

    &.hide {
      transform: scale(0);
      opacity: 0;
    }


    .detail-list {

      position: relative;
      z-index: inherit;

      display: flex;
      justify-content: space-around;
      align-items: center;

      width: 80%;
      height: 80%;



    }

    .detail-item {

      position: absolute;
      width: 60%;
      height: 100%;


      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;

      transition: opacity 0.2s ease-in-out, filter 1s 0.2s ease-in-out;
      z-index: 20;


      &.hide {
        filter: sepia(100%);
        opacity: 0;
      }


    }

    .detail-btn {

      position: absolute;

      z-index: 11;

      width: 50px;
      height: 80px;

      cursor: pointer;
      border: none;
      background-color: transparent;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("../../assets/images/addition/arrow-left-normal.png");

      &.left {
        left: 0;
      }

      &.right {
        right: 0;
        transform: scaleX(-1)
      }

      &:hover {
        background-image: url("../../assets/images/addition/arrow-left-hover.png");

      }
    }

  }

}
</style>
