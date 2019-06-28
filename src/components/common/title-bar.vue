<template>
    <div class="title-bar">
        <div class="title-bar_container">
            <div class="title-bar_left">
                <img src="~@/assets/images/back.png" v-if="isBackShow"
                     @click="leftBarHandler"
                     class="back-img">
                <img src="~@/assets/images/close.png"
                    v-if="closeShow"
                     @click="closeWebView"
                     class="close-img">
                <slot name="left"></slot>
            </div>
            <div class="title-bar_title">
                <slot></slot>
            </div>
            <div class="title-bar_right">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import Tower from '@souche-f2e/tower';

export default {
    name: 'titleBar',
    data () {
        return {
            closeShow: !navigator.userAgent.match(/Alipay/i) && this.$route.path !== '/index'
        };
    },
    props: {
        isBackShow: {
            type: Boolean,
            default: true
        },
        isLeftEventDefault: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        closeWebView () {
            Tower.closeWebView();
        },
        leftBarHandler (e) {
            if (!this.isLeftEventDefault) {
                this.$emit('leftBarEvent', e);
            } else {
                if (this.$route.query.from === 'mc') { // 从消息中心推送的消息链接跳转过来
                     return this.closeWebView();
                }
                if (this.$route.query.go) { // 自定义回退历史的步数
                    return this.$router.go(Number(this.$route.query.go));
                }
                this.$router.go(-1);
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.title-bar{
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    height: 44px;
    .icon {
        width: 20px;
        height: 20px;
        padding: 12px 0;
        &.sub-right-icon {
            padding-right: 20px;
        }
    }
    .title-bar_container{
        .border-bottom();
        padding: 0 16px;
        height: 100%;
        line-height: 44px;
        box-sizing: border-box;
        display: flex;
        align-items: stretch;
        justify-content: space-between;
    }
    .title-bar_title{
        font-size: 18px;
        color: @blue;
        font-weight: bold;
        flex: 4;
        text-align: center;
        line-height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .title-bar_left{
        flex: 2;
        display: flex;
        align-items: center;
        line-height: 44px;
        .back-img{
            margin-right: 24px;
            width: 11px;
        }
        .close-img{
            width: 17px;
            margin-right: 10px;
        }
    }
    .title-bar_right{
        flex: 2;
        text-align: right;
        color: @blue;
        font-size: 16px;
        line-height: 44px;
    }
}
</style>
