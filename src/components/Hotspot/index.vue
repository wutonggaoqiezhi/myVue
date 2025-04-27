<template>
    <transition appear name="custom-classes-transition" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <div class="hotspot-modal" @click="onClose()">

            <div class="hotspot-container">
                <button class="button-back bg-hotspot-back"  @click="onClose()"></button>
                <button class="button-audio" :class="audioPlaying ? 'bg-hotspot-audio-pause':'bg-hotspot-audio-play'" @click.stop="triggerAudio()"></button>

                <section v-if="index == 0" class="top" @click.stop="showModal(true)" :style="{'background-image':`url(${content.preview})`, 'cursor': 'pointer'}"></section>

                <section v-if="index == 1" class="top">
                    <iframe :src="content.modelUrl" frameborder="0" style="width:100%;height:100%" ></iframe>            
                </section>

                <div v-if="content.type == 0" class="modal" :class=" modalShow ? 'modalShow' : 'modalHide'" @click="showModal(false)" >
                    <picture-slider :imgs="content.imageList" @hide="showModal(false)"></picture-slider>
                </div>
            
                <div class="bottom">

                    <div class="article">
                        <h1 class="title"> {{ content.title }} </h1>
                        <div class="content">
                            <p>{{content.description}}</p>                   
                        </div>
                    </div>        

                </div>

        
                <div class="buttons">
                    <span v-if="contentTypes.img">
                        <button class="button-tab bg-picture" :class="{'bg-picture-active': index == 0 }" @click.stop="tab(0)"></button>
                        {{ $t('Hotspot.btnPicture') }}
                    </span>
                    <span v-if="contentTypes.model">
                        <button class="button-tab bg-model" :class="{'bg-model-active': index == 1 }" @click.stop="tab(1)"></button>
                        {{ $t('Hotspot.btnModel') }}
                    </span>           
                </div> 

            </div>

        </div>
    </transition>
</template>
<script>



import PictureSlider from './PictureSlider'


export default {
    components: {
        PictureSlider
    },
    props: {
        hotspot: {}
    },
    data() {
        return {
            index: 0,
            modalShow: false,
            audioPlaying: true,
            contentTypes: {
                img: false,
                model: false,
            },
            content: null,
            // contents: [
            //     {
            //         "type": 0,
            //         "title": "武将廊",
            //         "preview":"hotspots/WuJiangLang/preview.png"
            //         "description": "武将廊位于刘备殿前西面的廊庑中，共14尊塑像，主要塑制蜀汉时期的战将，有赵云、孙乾、张翼、马超、王平、姜维、黄忠、廖化、向宠、傅佥、马忠、张嶷、张南、冯习。",
            //         "imageList": [
            //             {
            //                 "title": "",
            //                 "url": "hotspots/WuJiangLang/1.jpg"
            //             },
            //             {
            //                 "title": "",
            //                 "url": "hotspots/WuJiangLang/2.jpg"
            //             },
            //             {
            //                 "title": "",
            //                 "url": "hotspots/WuJiangLang/3.jpg"
            //             }
            //         ],
            //         "modelUrl":""
            //     },
            //     {
            //         "type": 1,
            //         "title": "赵云",
            //         "description": "赵云，字子龙，常山真定（今河北省正定）人。身长八尺，姿颜雄伟，三国时期蜀汉名将。赵云跟随刘备将近三十年，先后参加过博望坡之战、长坂坡之战、江南平定战，独自指挥过入川之战、汉水之战、箕谷之战，都取得了非常好的战果。赵云去世后，被追谥为“顺平候”，其“常胜将军”的形象在后世被广为流传。",
            //         "imageList": [],
            //         "modelUrl":"4DModel/Model.html?m=ZhaoYun"
            //     }
            // ]
        }
    },
    created() {

        this.contents = this.hotspot.contents;
        this.content = this.contents[this.index];
        this.contents.forEach(item => {
            if(item.type == 0)
            {
                this.contentTypes.img = true
            }
            if(item.type == 1)
            {
                this.contentTypes.model = true;
            }
        })

        this.$Bus.$on("audio.play", this.onAudioPlay)
 
    },
    methods: {
        onClose() {
           
            this.$Bus.$emit("hotspot.close", this.hotspot.hotspotId)
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
        tab( index ) {
            
            this.index = index;
            this.content = this.contents[this.index];
        },
        showModal( show ) {
            this.modalShow = show;
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

    .bg-picture {
        background-image: url("../../assets/images/ui/hotspot-picture-normal.png");
    }

    .bg-picture-active {
        background-image: url("../../assets/images/ui/hotspot-picture-active.png");
    }

    .bg-model {
        background-image: url("../../assets/images/ui/hotspot-model-normal.png");
    }

    .bg-model-active {
        background-image: url("../../assets/images/ui/hotspot-model-active.png");
    }

    .bg-hotspot-back {
        background-image: url("../../assets/images/ui/hotspot-back.png");             
    }

    .bg-hotspot-audio-play {
        background-image: url("../../assets/images/ui/hotspot-audio-play.png");             
    }

    .bg-hotspot-audio-pause {
        background-image: url("../../assets/images/ui/hotspot-audio-pause.png");             
    }

    .hotspot-modal {

        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100% - 3.6rem);

        display: flex;
        justify-content: center;
        align-items: center;

        background: rgba(0,0,0,0.5);
        z-index: 9;
 

         .hotspot-container {

            position: absolute;
            width: 90%;
            height: 90%;

            background: inherit;
            z-index: 10;
            pointer-events: none;

            .top {
                
                width: 100%;
                height: calc(100% - 20rem);
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                pointer-events: auto;            
            }


            .bottom {

                position: absolute;
                width: 100%;
                height: 20rem;

                bottom: 0;
                background: whitesmoke;

                .article {
                    
                    width: 50%;
                    min-width: 350px;
                    margin: 0 auto;
                    padding: 20px 0;


                    .title {
                        color: #860000;
                        font-family: "宋体"
                    }

                    .content {
                        text-indent: 2em;
                        margin-top: 1em;    
                        font-size: 14px;
                        text-align: justify;

                    }
                }

                
            }

            .buttons {

                display: flex;
                justify-content: space-around;

                width: 180px;
                height: 100px;

                position: absolute;
                right: 50px;
                bottom: 100px;
                pointer-events: all;
                font-size: 14px;

                span {

                    display:inline-block;
                    width: 80px;
                    padding: 0 5px;
                    font-size: 0.9rem;
                }

                .button-tab {
                    width: 70px;
                    height: 80px;
                    transform: scale(0.8);
                    pointer-events: all;
                }
            }

            .modal {

                position: absolute;
                left: 0;
                top:0;
                bottom: 0;
                right: 0;
    
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);

                transition: opacity 0.2s ease-out;
                z-index: 100;
                pointer-events: none;
            }

            .modalHide {

                opacity: 0;
                transform: scale(0)
            }

            .modalShow {

                opacity:1;
                transform: scale(1)
            }

            .button-back {
                display: inline-block;
                position: absolute;
                left: 5rem;
                top: 4rem;
                width: 6rem;
                height: 6rem;         
        
            }

            .button-audio {

                display: inline-block;
                position: absolute;
                right: 5rem;
                top: 4rem;
                width: 5rem;
                height: 5rem;
      
            }

        }
    }

   
    
    
</style>
