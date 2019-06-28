<template>
    <div class="cp-notice-bar" :class="{fixed: fixed}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'noticeBar',
    props: {
        fixed: {
            type: Boolean,
            default: false
        }
    },
    methods: {
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

.cp-notice-bar{
    background: #FFF2BD;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 20px;
    color: @primary;
    box-sizing: border-box;
    &.fixed{
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2;
        width: 100%;
    }
}
</style>
