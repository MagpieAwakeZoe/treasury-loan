<template>
    <div class="co-warn">
        <p>{{text}}</p>
        <p v-if="subText">{{subText}}</p>
        <img v-if='isShowDelay'
             src="~@/assets/images/delayed-icon.png" width="50"/>
    </div>
</template>

<script>
    export default {
        name: 'warn',
        props: {
            text: {
                type: String,
                default: ''
            },
            subText: {
                type: String,
                default: ''
            },
            isShowDelay: {
                type: Boolean,
                default: false
            }
        }
    };
</script>

<style lang="less" scoped>
    .co-warn {
        background-color: #FFFAEB;
        color: #FF982A;
        padding: 12px 16px;
        position: relative;
        p {
            font-size: 17px;
            font-weight: bold;
            &:nth-child(2) {
                font-size: 14px;
                font-weight: normal;
                padding-top: 5px;
            }
        }
        img {
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
</style>
