<template>
    <div class="video-end">
        <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div v-if="isEnd" class="ending">
                <div class="tips" :style="{ 'background-image':`url(${$t('End.tipTitleUrl')})` }"></div>
                <div class="tips-content" :style="{ 'background-image':`url(${$t('End.tipContentUrl')})` }"></div>
            </div>
        </transition>

        <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <button class="btn-again" v-if="isEnd" @click="tralvelAgain()"></button>
        </transition>

        <div v-if="!isEnd">
            <canvas id="canvas" width="1920" height="1173"></canvas>
            <video id="video" autoplay="" name="media" controls crossorigin="anonymous">
                <source :src="src" type="video/mp4">
            </video>
            <button class="btn-skip" @click="onVideoComplete()">{{$t('Video.btnSkip')}}</button>
        </div>
    </div>
</template>
<script>

import * as THREE from 'three'
import Renderer2D from "@/utils/Renderer2D.js";

let video;
let render;
let animShow;
let animHide;
export default {
    data() {
        return {
            src: `video/end-${localStorage.getItem("wuhouci-lang") || 'zh'}.mp4`,
            isEnd: false,
        }
    },
    created() {

        this.$Bus.$on("audio.muted", this.onAudioMuted);

    },
    mounted() {

        video = this.$el.querySelector('#video')

        const videoTexture = new THREE.VideoTexture(video)
        videoTexture.minFilter = THREE.NearestFilter

    
        render = new Renderer2D(
            this.$el.querySelector('#canvas'),
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

        animShow = TweenMax.to({ value: 0 }, 2, { value: 1, paused: true, ease: Sine.easeIn })
        .eventCallback("onStart", ()=>{
            video.play();
        })
        .eventCallback("onUpdate", (params) => {
            render.setUniformsValue("progress", params.ratio);
        }, ["{self}"])
        .eventCallback("onComplete", ()=>{
            this.isMask = false;
        })

        animHide = TweenMax.to({ value: 0 }, 2, { value: 1, paused: true, ease: Sine.easeIn })
        .eventCallback("onUpdate", (params) => {
            render.setUniformsValue("progress", 1 - params.ratio);
            video.volume = 1 - params.ratio
        }, ["{self}"])
        .eventCallback("onComplete", ()=>{
            this.$Bus.$emit("endVideo.complete")
            this.isEnd = true;
        })
        video.addEventListener('ended', () => {

            this.onVideoComplete();

        }, false)

        loopRender()
    
        this.play();
    },
    methods: {
        play() {
            animShow.play();
        },
        onVideoComplete() {
            animHide.play();
        },
        tralvelAgain() {
            
            this.$Bus.$emit("travelAgain");

        },
        onAudioMuted( muted ) {
            video.muted = muted;
        }
    }
}
</script>

<style lang="less" scoped>
.video-end {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    >div {
        width: 100%;
        height: 100%;
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
        display:block;
        position: fixed;
        right: 50px;
        bottom: 80px;

        width: 70px;
        height: 70px;
        
        color:#860000;
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

    .ending {
        background: url("~@/assets/images/end-bg.png") no-repeat center center;
        background-size: cover;

        .tips {
            position: absolute;
            width: 815px;
            height: 203px;
            top: 20%;
            left: 50%;
            margin-left: -405px;

            background-repeat: no-repeat;
            background-position:center;
            background-size: contain;

            

        }

        .tips-content {
            position: absolute;
            width: 815px;
            height: 116px;
            bottom: 5%;
            left: 50%;
            margin-left: -405px;
            background-repeat: no-repeat;
            background-position:center;
            background-size: contain;
        }
    }

    .btn-again {

        position: absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);

        width: 70px;
        height: 70px;
        
        color:#25CBAF;
        cursor: pointer;
        border: none;
        background-color: transparent;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-image: url("~@/assets/images/ui/loop-normal.png");
        transition: color 0.2s ease-in-out;


        &:hover
        {
            background-image: url("~@/assets/images/ui/loop-active.png");
        }
        

    }
}
</style>