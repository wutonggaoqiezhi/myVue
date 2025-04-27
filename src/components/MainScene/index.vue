<template>
    <div class="canvas-3d" :class="{'modal': showGreete}" >
        <canvas id="canvasScene" style="width:100%;height:100%" ></canvas>
        <greete v-if="showGreete" @beginTravel="beginTravel()" ></greete>
        
        <div class="buttons" v-show="showSceneUI">
            <button class="button btn-arrow-left" @click.stop="onExsitPanoScene()">
                <span>{{ $t('MainScene.btnBack') }}</span>
            </button>
        </div>

        <button class="button-menu"  @click="toogleDescription()" v-show="showSceneUI"></button>
        <button class="button-audio" v-show="showSceneUI" :class="audioPlaying ? 'bg-hotspot-audio-pause':'bg-hotspot-audio-play'" @click.stop="triggerAudio()"></button>
        
        <div class="scene-description" :class="{ 'hide': !showDescription }">
            {{sceneDescription.content}}
        </div>

        <tips v-if="showTips"></tips>
        

        <button class="btn-rectangle left" @click="setAdditionVisible(true)" v-if="showBtnMore" >{{ $t('MainScene.btnMore') }}</button>
        <button class="btn-rectangle right" @click="endTravel()" v-if="showBtnMore">{{ $t('MainScene.btnStop') }}</button>

        <addition v-if="showAddition" @hide="setAdditionVisible(false)"></addition>

        <minimap v-if="showSceneUI" :flow='flow'></minimap>

    </div>
</template>
<script>
import * as THREE from 'three'
import ScenesDescription from './ScenesDescription';

import Greete from "./Greete";
import Minimap from '../MinMap'
import Addition from '../Addition'
import Tips from './Tips'

export default {
    components: {
        Greete,
        Minimap,
        Addition,
        Tips,
    },
    data() {
        return {
            showGreete: true,
            showSceneUI: false,
            showBtnMore: false,
            showAddition: false,
            showDescription: false,
            showTips: false,

            flow: 0,
            audioPlaying: true,
            sceneDescription: {}
        };
    },
    created() {

        this.$Bus.$on("startExperence", this.onStartExperence);
        this.$Bus.$on("panoScene.enter", this.onEnterPanoScene);
        this.$Bus.$on("flow.open", this.onOpenFlow);
        this.$Bus.$on("flow.close", this.onCloseFlow);
        this.$Bus.$on("audio.play", this.onAudioPlay);

        document.addEventListener('mousedown', ()=> {
            this.showTips = false; 
        })

    },
    methods: {
       
       onStartExperence() {

            this.showGreete = true;
            this.showBtnMore = false;

       },
       beginTravel() {

           this.$Bus.$emit("beginTravel");
           this.showGreete = false;
            this.showBtnMore = true;
       },
       endTravel() {

           this.$Bus.$emit("endTravel");
           this.showGreete = false;
           this.showBtnMore = true;
       },
       setAdditionVisible( visible ) {

           this.showAddition = visible;

            document.body.querySelectorAll(".guidepost").forEach(item =>{
                item.style.zIndex = visible? 0: 2
            })
       },
       onOpenFlow( flow ) {

           this.showBtnMore = false; 

       },
       onCloseFlow() {

           this.showBtnMore = true;

       },
       onEnterPanoScene( flow ) {

            this.showSceneUI = true;
            this.flow = flow;
            this.showTips = true;
            //To Optimize
           let description = ScenesDescription[ localStorage.getItem("wuhouci-lang") || 'zh' ];

            switch (this.flow) {
                case 7:
                    this.sceneDescription = description.LiuBeiDian
                    console.log(this.sceneDescription)
                    break;
            
                case 8:
                    this.sceneDescription = description.WuHouCi
                    break;
            }
       },

        onExsitPanoScene() {

            this.showSceneUI = false;
            this.$Bus.$emit("mainScene.back", this.flow);
        },
        onAudioPlay( )
        {
            this.audioPlaying = true;
        },
        triggerAudio() {

            this.audioPlaying = !this.audioPlaying;
            this.$Bus.$emit("audio.trigger", this.audioPlaying );
            console.log(`热点音频${this.audioPlaying ? "播放中":"暂停中"}`);    
        },
        toogleDescription() {

            this.showDescription = !this.showDescription;

        }
      
    }
};
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


.scene-description{

    position: absolute;

    left: 7rem;
    top: 12rem;

    width: 300px;

    padding: 15px;
    line-height: 20px;
    border-radius: 5px;
    text-indent: 2rem;
    text-align: justify;

    background-color: rgba(0,0,0,0.6);
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
        color:#ffffff;
        border:none;
        background-color:transparent;
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

        background: rgba(0,0,0,0.8)
    }

.buttons {

    display: flex;
    justify-content: space-around;
    align-items: center;

    position: fixed;
    right: 5.5rem;
    bottom: 6.5rem;
    z-index: 10;

    width:250px;
    height: 100px;

    
    button {

        width: 120px;
        height: 60px;

        cursor: pointer;
        color:#820000;
        border:none;
        background-color:transparent;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-image:url("../../assets/images/ui/btn-pano-normal.png");

        &:hover {
            color:#FFFFFF;
            background-image:url("../../assets/images/ui/btn-pano-hover.png");

        }
    }

}


</style>
