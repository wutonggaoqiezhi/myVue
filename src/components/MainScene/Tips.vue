<template>
    <ul>
        <li>
            <div>
                <div class="key-line">
                    <span class="keys up is-active"></span>
                </div>
                <div class="key-line">
                    <span class="keys left"></span>
                    <span class="keys down is-active"></span>
                    <span class="keys right"></span>
                </div>
            </div>
            <p>{{$t('Tips.tipArrow')}}</p>
        </li>
        <li>
            <div>
                <span class="mouse">
                        <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 20">
                        <path class="st0" d="M14.3,3.3c-2,0-3.6,1.6-3.6,3.6v13.8l-0.4-0.4c-0.6-0.7-1.5-1.1-2.4-1.2c-0.9-0.1-1.8,0.3-2.5,0.9
                            c-1.4,1.3-1.5,3.6-0.3,5l6.1,7.1c0,0,0.1,0.1,0.1,0.1c0.4,0.5,1.4,1.8,3.4,1.8h11.4c2.2,0,4.1-1.9,4.1-4.2V18c0-1.7-1.4-3-3-3h-9.3
                            v-8C17.9,4.9,16.3,3.3,14.3,3.3z M27.3,16.8c0.7,0,1.2,0.5,1.2,1.2v12c0,1.3-1,2.4-2.2,2.4H14.8c-1.1,0-1.6-0.7-2-1.1
                            c-0.1-0.1-0.1-0.1-0.2-0.2l-6.1-7.1c-0.6-0.7-0.6-1.8,0.1-2.5C7,21.2,7.3,21,7.7,21c0,0,0.1,0,0.1,0c0.4,0,0.8,0.2,1.1,0.6l3.6,4.2
                            V6.9c0-1,0.8-1.8,1.8-1.8s1.8,0.8,1.8,1.8v9.8H27.3z"/>
                        </svg> -->
                </span>
            </div>
            <p>{{$t('Tips.tipFingger')}}</p>
        </li>
    </ul>
</template>
<script>
import IconFdage from "../SvgIcons/FDageFont";
export default {
    components: {
        IconFdage
    }
}
</script>
<style lang="less" scoped>



ul {

    position: absolute;
    bottom: 300px;

    width: 100%;

    li {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        max-width: 200px;

        >div {
            position: relative;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-direction: column;
            flex-direction: column;
            -ms-flex-align: center;
            align-items: center;
            -ms-flex-pack: center;
            justify-content: center;
            height: 72px;
            font-size: 0;
            margin-bottom: 1.4rem;
        }
    }

    .key-line {
        display: block;
        text-align: center;
        width: 100%;
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .keys {
        height: 20px;
        width: 19px;
        position: relative;
        display: inline-block;
        border: 2px solid #fefefe;
        border-radius: 2px;
        margin: 0 2px;
        opacity: .3;

        &:before {
            content: "";
            display: block;
            position: absolute;
            display: inline-block;

            width: 0;
            height: 0;
            font: 0/0 serif;
            border-top: 0;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
            border-bottom: 4.5px solid #fefefe;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -40%)
        }

        &.is-active {
            opacity: 1
        }

        &.left:before {
            transform: translate(-50%, -40%) rotate(-90deg)
        }

        &.right:before {
            transform: translate(-50%, -40%) rotate(90deg)
        }

        &.down:before {
            transform: translate(-50%, -40%) rotate(180deg)
        }

        &.up,
        &.down {
            animation: instructionKeyAnimation 3s linear infinite
        }

        &.down {
            animation-delay: 1.5s
        }
    }

    .mouse {
        height: 60px;
        width: 37px;
        margin-top: -7px;
        transform-origin: 50% 100%; 
        animation: instructionMouseAnimation 6s ease-in-out infinite;

        background-image: url('../../assets/images/ui/mouse.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;

        svg{
            width:100%;
            height: 100%;
            path{
                fill:#fefefe;
            }
        }
    }

    p {
        font-size: 14px;
        color: #fefefe;
        font-weight: bold;
    }

}
</style>
