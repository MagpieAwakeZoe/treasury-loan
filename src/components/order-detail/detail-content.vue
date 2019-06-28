<template>
    <div class="co-detail-content">
        <h4 v-if="title">{{title}}</h4>
        <section :class="{'showBorderBottom': isShowBorderBottom}">
            <slot>
                <p v-for="(item) in content" v-if="hasItemContent(item)">
                    <span class="left" v-if="item.title && item.content">{{item.title}}</span>
                    <span :class="['right', {'bold': isBoldNum && isYuan(item), 'red': isRedNum && isYuan(item)}]" v-if="typeof item.content !== 'undefined'  && isYuan(item)">{{item.content | reverseYuan}} 元</span>
                    <span class="right" v-if="typeof item.content !== 'undefined' && !isYuan(item)">{{item.content}}</span>
                    <small v-if="typeof item.small !== 'undefined'">{{item.small}}</small>
                    <detail-link v-if="item.linkContent" :content="item.linkContent" class="content-link" @click.native="$emit('clickLink', 0)"></detail-link>
                </p>
            </slot>
        </section>
        <section v-if="hasContent('subContent')"  :class="{'showBorderBottom': isShowSubBorderBottom}">
            <p v-for="(item) in subContent" v-if="hasItemContent(item)">
                <span class="left" v-if="item.title && item.content">{{item.title}}</span>
                <span :class="['right', {'bold': isBoldNum && isYuan(item), 'red': isRedNum && isYuan(item)}]" v-if="typeof item.content !== 'undefined'  && isYuan(item)">{{item.content | reverseYuan}} 元</span>
                <span class="right" v-if="typeof item.content !== 'undefined'  && !isYuan(item)">{{item.content}}</span>
                <small v-if="typeof item.small !== 'undefined'">{{item.small}}</small>
                <detail-link v-if="item.linkContent" :content="item.linkContent" class="content-link" @click.native="$emit('clickLink', 1)"></detail-link>
            </p>
        </section>
    </div>
</template>

<script>
    import detailLink from '@/components/order-detail/detail-link';

    export default {
        name: 'detail-content',
        components: {detailLink},
        props: {
            title: {
                type: String,
                default: ''
            },
            content: {
                type: Array,
                default: () => []
            },
            subContent: {
                type: Array,
                default: () => []
            },
            isShowBorderBottom: {
                type: Boolean,
                default: true
            },
            isShowSubBorderBottom: {
                type: Boolean,
                default: false
            },
            isReverseYuan: {
                type: Boolean,
                default: true
            },
            isBoldNum: {
                type: Boolean,
                default: false
            },
            isRedNum: {
                type: Boolean,
                default: false
            },
        },
        data () {
            return {

            };
        },
        methods: {
            isYuan (item) {
                return this.isReverseYuan && (typeof item.content === 'number');
            },
            hasItemContent (item) {
                return item.content || item.linkContent || item.small;
            },
            hasContent(contentType) {
                const item = this[contentType][0] || {};
                return item.title || item.content || (item.linkContent && !item.isNotShowLink) || item.small;
            }
        }
    };
</script>

<style lang="less" scoped>
    .co-detail-content {
        background-color: white;
        padding: 14px 0 0 16px;
        line-height: 1.8;
        section {
            padding-top: 16px;
            padding-right: 16px;
            padding-bottom: 16px;
            &:empty {
                padding: 0;
                margin-top: -15px;
                border-bottom: none;
                &:first-of-type {
                    padding-top: 0;
                }
                &.showBorderBottom {
                    .border-bottom(transparent);
                }
            }
            &:first-of-type {
                padding-top: 2px;
            }
            &.showBorderBottom {
                .border-bottom();
            }
            p {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                span {
                    flex: 0 0 115px;
                    &.right {
                        flex: 1;
                        text-align: right;
                    }
                }
                small {
                    flex: 0 0 100%;
                    text-align: right;
                    color: #999;
                    font-size: 14px;
                    display: block;
                    font-weight: lighter;
                    box-sizing: border-box;
                    padding-left: 70px;
                }
            }
        }
        .co-detail-link.content-link {
            flex: 0 0 calc(~'100% - 16px');
        }
    }
</style>
