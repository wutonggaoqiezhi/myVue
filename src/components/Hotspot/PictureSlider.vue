<template>
    <div class="container" @click.stop="$emit('hide')">
        <ul class="list" >

            <li :class="{ 'transparent': viewIndex != index, 'list-item': true }" v-for="(img, index) in imgs" :key="index" :style="{'background-image':`url(${img.url})`}" :title="img.title" @click.stop ></li>
        </ul>   
        
        <button class="buttons buttons-left bg-left" @click.stop ="prev()"></button>
        <button class="buttons buttons-right bg-right" @click.stop ="next()"></button>
    </div>
</template>
<script>
export default {
    props: {
        imgs: Array
    },
    data() {
        return {
            viewIndex: 0,
        }
    },
    created() { 

    },
    methods: {

        next(event) {
        
            this.viewIndex = (this.viewIndex  + this.imgs.length + 1) % this.imgs.length;
            
        },

        prev(event) {

            this.viewIndex = (this.viewIndex + this.imgs.length -1) % this.imgs.length;
            
        }
    
    }
}
</script>

<style scoped>

    .bg-left {
        background-image: url("../../assets/images/ui/left-normal.png");
    }

    .bg-right {
        background-image: url("../../assets/images/ui/right-normal.png");
    }
    .container {

        height: 100%;
        width: 100%;
        z-index: 10;
        pointer-events: all;

    }
    .list {

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        height: 100%;
        width: 100%;

    }
    .list-item {
        
        position: fixed;

      
        width: 70%;
        height: 70%;

        background-repeat: no-repeat;
        background-size:contain;
        background-position: center;

        transition: opacity 0.2s ease-in-out;
        
    }

    .buttons {

        pointer-events: all;
        position: absolute;
        width: 50px;
        height: 80px;
        top:50%;
        transform: translateY(-50%);

        border: none;
        background-color: transparent; 
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        pointer-events: all;
        cursor: pointer;

    }

    .buttons-left {

        left: 4.5rem;

    }

    .buttons-right {

        right: 4.5rem;
    }

    .transparent {

        opacity: 0;


    }

</style>
