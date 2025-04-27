<template>
    <transition appear name="custom-classes-transition" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <div class="addition">
            <div class="menu">
                <button class="bg-normal" @click="$emit('hide')">{{ $t('Addition.menu.itemBack') }}</button>
                <button :class="index == 1 ? 'bg-active':'bg-normal'" @click="tab(1)">{{ $t('Addition.menu.item1') }}</button>
                <button :class="index == 2 ? 'bg-active':'bg-normal'" @click="tab(2)">{{ $t('Addition.menu.item2') }}</button>           
                <button :class="index == 3 ? 'bg-active':'bg-normal'" @click="tab(3)">{{ $t('Addition.menu.item3') }}</button>
            </div>
            
            <div class="content">
                <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <relic-details v-if="index==1" :resources="resource.RelicDetails" ></relic-details>
                </transition>
                <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">                
                    <new-vs-old v-if="index==2" :resources="resource.NewVsOld" ></new-vs-old>
                </transition>
                <transition appear name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <sanguo-map v-if="index==3" :resources="resource.Map"></sanguo-map>
                </transition>
                
            </div>
            

        </div>
    </transition>
</template>
<script>

import Resource from './Resource'

import NewVsOld from './NewVSOld'
import RelicDetails from './RelicDetails'
import SanguoMap from './SanguoMap'

export default {
    components:{
        NewVsOld,
        RelicDetails,
        SanguoMap
    },
    data() {
        return {
            index: 1,
            resource: Resource[localStorage.getItem('wuhouci-lang')] || Resource['zh']
        }
    },
    created() {

        this.$Bus.$on("lang.change", this.onLangChange);

    },
    methods: {

        tab( index )
        {
            this.index = index;
        },

        onLangChange( lang ) 
        {
            this.resource = Resource[lang];
        }
    }
}
</script>

<style lang="less" scoped>

    .addition {
        position: absolute;
        left:0;
        top:0;
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
               
                border:none;
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
