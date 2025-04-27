<template>
    <div class="app-footer">
        <div class="left">
            <span class="icon-button" @click="switchMuted()">
                <span class="icon" :class=" muted ? 'sound-off': 'sound-on'"  ></span>
                {{ $t("Footer.btnSound") }}
            </span >
            <span class="icon-button" @click="switchLanguage()">
                <span class="icon" :class="`lang-${lang}`"></span>
                {{ $t("Footer.btnLang") }}
            </span>
        </div>
        <div class="right">
           <a target="_blank" href="http://4dage.com/" class="icon-fdage">
                <span>
                    <icon-fdage></icon-fdage>
                </span>
            </a>   
        </div>
    </div>
</template>
<script>

import IconFdage from "../SvgIcons/FDageFont";


export default {
    components: {
        IconFdage,

    },
    data() {
        return {
            muted: false,
            lang: localStorage.getItem('wuhouci-lang') || 'zh'
        };
    },
    created(){

    },
    methods: {
        
        switchMuted() {

            this.muted = !this.muted;
            this.$Bus.$emit("audio.muted", this.muted);

        },
        switchLanguage() {

            this.lang == 'zh' ? this.lang = 'en' : this.lang = 'zh';
            this.$Bus.$emit("lang.change", this.lang);

        }
    }
};
</script>

<style lang="less" scoped>

    .app-footer {

        display: flex;
        justify-content:space-between;
        align-items: center;

        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3.6rem;
        padding: 0 20px;

        background: rgba(188,195,195,0.5);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        z-index: 101;
        
        color:#FFFFFF;

        

        svg,path {
            width: 100%;
            height: 100%;
            fill: #860000;
        }

        .icon-button {

            display: inline-block;
            margin: 0 5px;  

            cursor: pointer;     

            .icon {
                
                display: inline-block;
                
                width: 14px;
                height: 14px;

                transform: translateY(3px);
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;

                &.sound-on {
                    background-image: url("../../assets/images/ui/sound-on.png");
                }

                &.sound-off {
                    background-image: url("../../assets/images/ui/sound-off.png");
                }

                &.lang-zh {
                    background-image: url("../../assets/images/ui/language-zh.png");
                }

                &.lang-en {
                    background-image: url("../../assets/images/ui/language-en.png");
                }
            }
        }

        .icon-fdage {

            display: inline-block;
            height: 1rem;
            width: 10rem;

        }

    }

</style>
