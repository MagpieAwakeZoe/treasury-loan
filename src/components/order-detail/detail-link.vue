<template>
    <div class="co-detail-link">
        <slot></slot>
        <h4 v-if="title">{{title}}</h4>
        <a>{{content}}</a>
        <img src="~@/assets/images/right-arrow.png" height="13px" />
    </div>
</template>

<script>
    export default {
        name: 'detail-link',
        props: {
            title: {
                type: String,
                default: ''
            },
            content: {
                type: String,
                default: ''
            }
        }
    };
</script>

<style lang="less" scoped>
    .co-detail-link {
        display: flex;
        padding: 0 16px;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        .title {
            flex: 2.5;
        }
        a {
            flex: 1;
            text-align: right;
        }
        img {
            flex: 0 0 8px;
            padding-left: 16px;
        }
        h4 {
            font-size: 18px;
            margin: 14px 0;
        }
    }
</style>
