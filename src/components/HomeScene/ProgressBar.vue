<template>
    <div class="progress-bar" :class="{'hide': hide }">
        <h4>{{progressText}}</h4>
        <canvas id="canvasProgress" :width="600" :height="40" ></canvas>
    </div>
</template>
<script>
import * as THREE from 'three';
import { TweenLite, TweenMax, Ease } from 'gsap';
import Renderer2D from "@/utils/Renderer2D.js";
import WebGLManager from "@/webgl/GLManager.ts";

let renderer
export default {
    data() {
        return {
            hide: false,
            progressText: '00',
        };
    },
    created() {
       
        this.$Bus.$on('load.progress', this.onLoadingProgress);
        this.$Bus.$on('load.complete', this.onLoadingComplete);

    },
    mounted() {

        let textureLoader = new THREE.TextureLoader();
        let texuture = textureLoader.load("images/loader-bar/bar.png"),
            mask = textureLoader.load("images/loader-bar/mask.png");

        renderer = new Renderer2D(this.$el.querySelector('#canvasProgress'), 'loader', [texuture, mask]).setUniformsValue("progress", 0);

        
    },
    methods: {

        onLoadingProgress( progress ) {

            this.progressText = Math.min(100, Math.max(0, parseInt(progress*100))).toString()
            TweenLite.to(renderer.getUniform("progress"), 0.8, { value: progress } ).eventCallback("onUpdate", () => { renderer.render() })
        },

        onLoadingComplete() {

            this.hide = true;
        }

    }
}
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