<template>
  <transition appear name="custom-classes-transition" enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut">
    <div class="addition">
      <div class="menu">
        <button class="bg-normal" @click="$emit('hide')">{{ $t('Addition.menu.itemBack') }}</button>
        <button :class="index == 1 ? 'bg-active' : 'bg-normal'" @click="tab(1)">{{ $t('Addition.menu.item1') }}</button>
        <button :class="index == 2 ? 'bg-active' : 'bg-normal'" @click="tab(2)">{{ $t('Addition.menu.item2') }}</button>
        <button :class="index == 3 ? 'bg-active' : 'bg-normal'" @click="tab(3)">{{ $t('Addition.menu.item3') }}</button>
      </div>

      <div class="content">
        <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut">
          <RelicDetails v-if="index == 1" :resources="resource.RelicDetails"></RelicDetails>
        </transition>
        <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut">
          <NewVSOld v-if="index == 2" :resources="resource.NewVsOld"></NewVSOld>
        </transition>
        <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut">
          <sanguo-map v-if="index == 3" :resources="resource.Map"></sanguo-map>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import emitter from '@/utils/bus';
import Resource from './Resource';
import RelicDetails from './RelicDetails.vue';
import NewVSOld from './NewVSOld.vue';
import SanguoMap from './SanguoMap.vue';

const index = ref(1)
const lang = (localStorage.getItem('wuhouci-lang') || 'zh') as keyof typeof Resource;
const resource = ref(Resource[lang]);

const tab = (idx: number) => {
  index.value = idx;
}

const onLangChange = (lang: unknown) => {
  resource.value = Resource[lang as keyof typeof Resource];
}

emitter.on("lang.change", onLangChange);
</script>

<style lang="less" scoped>
.addition {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;

  background-image: url("../../assets/images/addition/background.png");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;


  .menu {

    position: absolute;
    right: 6rem;
    top: 20%;
    z-index: 2;

    width: 60px;

    button {

      width: 88px;
      height: 88px;

      display: block;
      justify-content: center;
      align-items: center;
      padding: 24px;
      margin: 20px 0;
      font-size: 14px;
      color: #fff;
      cursor: pointer;

      border: none;
      background-color: transparent;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .bg-normal {
      background-image: url("../../assets/images/addition/menu-normal.png")
    }

    .bg-active {
      background-image: url("../../assets/images/addition/menu-active.png")
    }
  }

  .content {

    width: 100%;
    height: 100%;
    z-index: 1;
    background: rgba(0, 0, 0, 0);

  }
}
</style>
