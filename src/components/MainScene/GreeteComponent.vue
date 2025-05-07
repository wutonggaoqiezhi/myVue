<template>
  <transition appear name="custom-classes-transition" enter-active-class="animated slideInUp"
    leave-active-class="animated zoomOut">
    <div class="tips" :style="{ 'background-image': `url(${$t('Tips.tipUrl')})` }">
      <div class="buttons">
        <button class="active travel" @click.stop="$emit('beginTravel')">{{ $t('Tips.btnStartTravel') }}</button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
</script>

<style lang="less" scoped>
.tips {
  position: absolute;
  top: 45%;
  left: 50%;
  width: 600px;
  height: 480px;
  margin-top: -240px;
  margin-left: -300px;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: contain;
}

.buttons {

  position: absolute;
  bottom: 12rem;
  width: 100%;
  text-align: center;

  button {

    width: 280px;
    height: 80px;
    padding-top: 8px;
    padding-right: 18px;

    color: white;
    cursor: pointer;
    border: none;
    background-color: transparent;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url("~@/assets/images/ui/start-experence.png")
  }
}
</style>
