<template>
    <div class="co-form-item-title" :style="{backgroundColor, color, padding}" @click="$emit('clickItem')">
        <p>
            <slot name="title">{{text}}</slot>
            <i v-if="showRight">
                <slot>
                    <img src="~@/assets/images/delete.png" height="20">
                </slot>
            </i>
        </p>
    </div>
</template>

<script>
    export default {
        name: 'form-item-title',
        props: {
            text: {
                type: String,
                default: ''
            },
            backgroundColor: {
                type: String,
                default: '#F2F2F2'
            },
            color: {
                type: String,
                default: '#666'
            },
            showRight: {
                type: Boolean,
                default: false
            },
            padding: {
                type: String,
                default: ''
            }
        }
    };
</script>

<style lang="less" scoped>
    .co-form-item-title {
        font-size: 14px;
        padding: 12px 16px;
        line-height: 1;
        i {
            float: right;
            img {
                margin-top: -3px;
            }
        }
    }
</style>
