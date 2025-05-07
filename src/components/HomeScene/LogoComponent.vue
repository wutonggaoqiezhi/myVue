<template>
  Logo
</template>

<script setup lang="ts">
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
