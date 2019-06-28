<template>
    <div class="co-form-item-content" @click="$emit('clickItem')">
        <div>
            <p>
                <i v-if="isNecessary">*</i>
                <i v-else>&nbsp;</i>
                <span>{{text}}</span>
            </p>
            <section>
                <span v-if="mainContent" class="main-content">{{mainContent}}</span>
                <span v-if="placeholder && !mainContent" class="placeholder">{{placeholder}}</span>
                <slot>
                    <img src="~@/assets/images/right-arrow.png" height="13px" />
                </slot>
            </section>
        </div>
        <p v-if="subContent" class="sub-content">{{subContent}}</p>
        <p v-if="thirdContent" class="sub-content">{{thirdContent}}</p>
    </div>
</template>

<script>
    export default {
        name: 'form-item-content',
        props: {
            text: {
                type: String,
                default: ''
            },
            isNecessary: {
                type: Boolean,
                default: true
            },
            mainContent: {
                type: String,
                default: ''
            },
            subContent: {
                type: String,
                default: ''
            },
            thirdContent: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            }
        }
    };
</script>

<style lang="less" scoped>
    .co-form-item-content {
        background-color: #fff;
        color: #1A1A1A;
        font-size: 16px;
        padding: 12px 16px;
        line-height: 22px;
        div {
            display: flex;
            justify-content: space-between;
            p {
                flex: 0 0 120px;
                i {
                    vertical-align: middle;
                    padding-right: 5px;
                    color: @red;
                    font-size: 10px;
                }
                span {
                    vertical-align: middle;
                }
            }
            section {
                text-align: right;
                input {
                    border: none;
                    max-width: calc(~'100vw - 120px - 48px');
                    text-align: right;
                }
                span.main-content {
                    font-size: 16px;
                    color: #1A1A1A;
                    display: inline-block;
                    vertical-align: middle;
                    max-width: calc(~'100vw - 120px - 84px');
                }
                .placeholder {
                    color: #CCCCCC;
                    vertical-align: middle;
                }
                img {
                    margin-left: 10px;
                    vertical-align: middle;
                }
            }
        }
        p.sub-content {
            text-align: right;
            color: #666666;
            font-size: 14px;
            margin-right: 20px;
            margin-left: 40%;
            word-break: break-all;
            line-height: 1.5;
            padding-top: 6px;
            margin-bottom: -4px;
        }
    }
</style>
