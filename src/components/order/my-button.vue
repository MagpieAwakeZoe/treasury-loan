<template>
    <div :class="['co-my-button', {'co-my-fixed-button': isFixed, 'co-my-two-button': is2Btn}]">
        <button :class="[clickClass2, {'button-grey': is2Btn}]" @click="click2nd" ref="btn2" v-if="is2Btn">{{text2}}</button>
        <button :class="[clickClass, {'button-grey': isGrey}]" :disabled="disabled" ref="btn" @click="changeStatus">{{text}}</button>
    </div>
</template>

<script>
    export default {
        name: 'my-button',
        props: {
            text: {
                type: String,
                default: ''
            },
            text2: {
                type: String,
                default: ''
            },
            delayTime: {
                type: [Number, String],
                default: 2000
            },
            disabled: {
                type: Boolean,
                default: false
            },
            isFixed: {
                type: Boolean,
                default: false
            },
            is2Btn: {
                type: Boolean,
                default: false
            },
            isGrey: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                clickClass: 'canclick',
                clickClass2: 'canclick'
            };
        },
        methods: {
            changeStatus () {
                this.clickClass = 'noclick';
                this.$emit('click');
                setTimeout(() => {
                    this.clickClass = 'canclick';
                }, parseInt(this.delayTime));
            },
            click2nd () {
                this.clickClass2 = 'noclick';
                this.$emit('click2');
                setTimeout(() => {
                    this.clickClass2 = 'canclick';
                }, parseInt(this.delayTime));
            }
        }
    };
</script>

<style lang="less" scoped>
    .co-my-button {
        .canclick {
            pointer-events: auto;
        }
        .noclick {
            pointer-events: none;
        }
        display: inline-block;
        button {
            border-radius: 50px;
            color: #fff;
            background: linear-gradient(to right, #3b92ff , #3665ff);
            border: none;
            padding: 6px 14px;
            line-height: 1;
            min-width: 80px;
            &.button-grey {
                background: #F0F0F0;
                color: #333;
            }
        }
        &.co-my-fixed-button {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #fff;
            height: 52px;
            display: flex;
            justify-content: center;
            align-items: center;
            button {
                flex: 1;
                padding: 12px 0;
                margin: 0 25px;
                font-weight: bold;
            }
        }
        &.co-my-two-button {
            padding: 0 5px;
            button {
                margin: 0 5px;
            }
        }
    }
</style>
