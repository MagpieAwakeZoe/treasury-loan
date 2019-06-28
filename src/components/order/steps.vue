<template>
    <div class="co-steps">
        <div class="step-item" v-for="(item, index) in stepArr">
            <div class="item-header-wrapper">
                <div class="item-title" :style="{color: getColor(item, false, true)}">
                    <p>{{titleArr[index]}}</p>
                </div>
                <div class="item-header" :style="{backgroundColor: getColor(item), color: getColor(item)}" v-if="item === 'done'">
                    <img src="~@/assets/images/check.png" width="15">
                </div>
                <div class="item-header" v-else :style="{color: getColor(item)}">{{index + 1}}</div>
            </div>
            <div class="item-tail" :style="{backgroundColor: getColor(item, true)}"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'steps',
        props: {
            totalSteps: {
                type: Number,
                default: 6
            },
            // currentStep带小数位表示当前没有doing项
            currentStep: {
                type: [String, Number],
                default: 0
            },
            color: {
                type: String,
                default: '#FF6666'
            },
            greyColor: {
                type: String,
                default: '#D9D9D9'
            },
            fontGreyColor: {
                type: String,
                default: '#999'
            },
            titleArr: {
                type: Array,
                default: () => ['提交申请', '物流验车', '支付首付款', '资方垫款', '物流运输', '还款提车']
            }
        },
        methods: {
            getColor (item, isTail, isFont) {
                if (item === 'todo') {
                    return this.greyColor;
                }
                if (isTail && item === 'todo') {
                    return this.greyColor;
                }
                if (isFont && item === 'todo') {
                    return this.fontGreyColor;
                }
                return this.color;
            }
        },
        computed: {
            stepArr () {
                let stepArr = [];
                let curArr = [];
                if (typeof this.currentStep === 'string') {
                    curArr = this.currentStep.split(',');
                } else {
                    curArr[0] = this.currentStep;
                }
                const floor = Math.floor(curArr[0]); // currentStep带小数位表示当前没有doing项
                stepArr.length = this.totalSteps;
                stepArr.fill('done');
                for (let i = floor; i < this.totalSteps; i += 1) {
                    stepArr[i] = 'todo';
                }
                curArr.forEach((item) => {
                    item = +item;
                    if (item === Math.floor(item)) {
                        stepArr[item - 1] = 'doing';
                    }
                });
                return stepArr;
            }
        }
    };
</script>

<style lang="less" scoped>
    @width: 22px;
    @height: 22px;
    .co-steps{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        background-color: #fff;
        .step-item {
            flex: 1;
            text-align: center;
            position: relative;
            .item-tail {
                bottom: @height / 2;
                width: calc(~'(50% - 16px) * 2'); // 16px = @width / 2 + margin
                height: 2px;
                position: absolute;
                right: calc(~'50% + 16px');
            }
            &:first-child .item-tail{
                display: none;
            }
            .item-header-wrapper {
                .item-header {
                    width: @width;
                    height: @height;
                    text-align: center;
                    line-height: 18px;
                    border-radius: 100%;
                    display: inline-block;
                    border: 2px solid;
                    margin: 25px 5px 0;
                    box-sizing: border-box;
                }
                .item-title {
                    position: absolute;
                    font-size: 10px;
                    font-weight: lighter;
                    width: 100%;
                    top: 0;
                    p {
                        text-align: center;
                    }
                }
            }
        }
    }
</style>
