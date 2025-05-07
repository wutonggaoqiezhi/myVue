<template>
  <div class="minmap" :style="{ 'background-image': 'url(' + map.src + ')' }">
    <span class="curr" :style="{ left: position.x + 'px', top: position.y + 'px' }">
      <span class="view-point">
        <svg viewBox="0 0 50 50" class="view-range"
          :style="{ color: '#fff', transform: `translate(-50%, -50%) rotateZ(${rotation}deg)` }">
          <circle cx="25" cy="25" r="12.5" stroke-width="25"></circle>
        </svg>
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue';
import emitter from '@/utils/bus';


const maps = [
  {
    src: "images/mini-map/lbd.png",
    flow: 7,
  },
  {
    src: "images/mini-map/zgld.png",
    flow: 8,
  }
]

const props = defineProps<{
  flow: number
}>()

const map = ref(props.flow == 7 ? maps[0] : maps[1])
const position = ref({ x: 0, y: 0 })
const rotation = ref(-90)

const forward = new THREE.Vector3(0, 0, -1);


const getTransform = (position: { x: number, y: number, z: number }, flow: number) => {
  switch (flow) {
    case 7:
      return {
        x: position.x * 9 - 274,
        y: position.z * 8 + 5
      }
    case 8:
      return {
        x: position.x * 9 - 274,
        y: position.z * 8 + 260
      }
  }
}

const onUpdate = (data: unknown) => {
  const pos = (data as { position: { x: number, y: number, z: number } }).position;
  let direction = (data as { direction: THREE.Vector3 }).direction;

  direction.y = 0;
  direction.normalize()

  rotation.value = direction.x > 0 ? THREE.MathUtils.radToDeg(direction.angleTo(forward)) : -THREE.MathUtils.radToDeg(direction.angleTo(forward))
  position.value = getTransform(pos, props.flow)!
}

onMounted(() => {
  emitter.on("minimap.update", onUpdate);
})
</script>

<style lang="less" scoped>
.minmap {
  position: absolute;
  left: 3rem;
  bottom: 5rem;
  width: 200px;
  height: 200px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;


  .curr {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    transform: rotate(-135deg);
    /*校正角度使默认与相机世界方向一致*/
    z-index: 10;
  }

  .point {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;


    &::before {
      content: "";
      display: block;
      position: absolute;
      height: 1rem;
      width: 1rem;
      top: -.5rem;
      left: -.5rem;
      background: currentColor;
      border-radius: 50%;
      transition: all .15s linear;
    }

    &.visible {
      color: rgb(0, 83, 238);

      &::before {
        height: 1.5rem;
        width: 1.5rem;
        top: -.75rem;
        left: -.75rem;
      }
    }

    span {
      color: #fff;
      font-size: .9rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.is-mobile {
  .minmap {
    right: 0rem;
    bottom: 7rem;
  }
}

.view-point {
  height: 0;
  width: 0;
  /* position: absolute; */
}

.view-point:after,
.view-point:before {
  content: "";
  display: block;
  position: absolute;
  border-radius: 50%;
}

.view-point:before {
  /* height: 2.6rem;
    width: 2.6rem; */
  top: -1.3rem;
  left: -1.3rem;
  /* background: #fff; */
}

.view-point:after {
  height: 7px;
  width: 7px;
  top: 0px;
  left: 0px;
  background: #820000;
  z-index: 2;
}

.view-point .view-range {
  height: 50px;
  width: 50px;
  position: absolute;
  z-index: 1;
  top: 3px;
  left: 3px;
  transform: translate(-50%, -50%) rotate(0deg);
  opacity: 0.4;
  /* animation: viewRangeAnimation 2s infinite ease-in-out;
    animation-direction: alternate; */
}

.view-point circle {
  fill: none;
  stroke: #fff;
  stroke-dasharray: 20.56194 133.51769;
}

@keyframes viewRangeAnimation {
  0% {
    transform: translate(-50%, -50%) rotate(-120deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(-50deg);
  }
}
</style>
