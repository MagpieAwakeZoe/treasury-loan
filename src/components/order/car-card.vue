<template>
    <div class="co-car-card" v-if='carList.length > 0 && carList[0].modelName'>
        <div class="card-wrapper" v-for="(car, index) in carList">
            <div class="card-wrapper-sub" v-for="(deco, i) in car.decorateList" v-if="car.decorateList.length > 0" >
                <h3>{{car.seriesName}} {{car.modelName}}</h3>
                <p>指导价：{{car.guidePrice | reverseWan}} 万</p>
                <p>{{deco.appearanceColor}} / {{deco.interiorColor}} &nbsp; <i>|</i> &nbsp; {{deco.quantity}}辆</p>
                <p>购车单价：<span class="price">{{deco.contractPrice | formatYuan}} 元</span></p>
                <div class="vin-codes" v-if="isShowVin && deco.vins && deco.vins.length > 0">
                    <div class="vin-codes-content">
                        <aside>车架号：</aside>
                        <section class="vin-codes-content-section" :style="{height: deco.vins.length >= 2 ? '48px' : 'auto'}">
                            <p v-for="(v, num) in deco.vins" v-if='v' v-show="deco.isVinOpen ? true : num < 2">{{v}}</p>
                        </section>
                    </div>
                    <div v-if="deco.vins.length > 2" @click="switchVin(deco, index, i)" class="open-btn">
                        <span>{{deco.isVinOpen?"收起":"查看"}}更多车架号</span>
                        <img src="~@/assets/images/right-arrow.png" width="5" height="8" :style="{transform: deco.isVinOpen? 'rotate(-90deg)' : 'rotate(90deg)'}">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'car-card',
        props: {
            carList: {
                type: Array,
                default: () => []
            },
            isShowVin: {
                type: Boolean,
                default: false
            }
        },
        filters: {
            formatYuan: (value = 0) => {
                if (isNaN(+value)) {
                    return '数据异常';
                }
                if (!value && +value !== 0) {
                    return '';
                }
                let negative = value < 0 ? '-' : '';
                value = `${(Math.abs(+value)).toFixed(2)}`;
                let j = value.length > 6 ? value.length % 3 : 0;
                let top = j ? `${value.substr(0, j)},` : '';
                return negative + top + value.substr(j).replace(/(\d{3})(?=\d)/g, '$1,');
            },
        },
        methods: {
            switchVin(deco, index, i) {
                const ele = document.getElementsByClassName('vin-codes-content-section')[index + i];
                if (deco.isVinOpen) {
                    // 为了增加transition过渡，增加了height的具体高度
                    ele.style.height = '48px';
                } else {
                    ele.style.height = `${deco.vins.length * 24}px`;
                }
                this.$emit('switchVinOpen', deco);
                this.$forceUpdate();  // 更新deco.isVinOpen
            }
        }
    };
</script>

<style lang="less">

    .co-car-card {
        padding-left: 16px;
        padding-right: 0;
        background-color: #fff;
        .card-wrapper {
            .card-wrapper-sub {
                .border-top();
                padding: 14px 16px 16px 0;
                h3 {
                    font-size: 16px;
                    color: #1A1A1A;
                    font-weight: normal;
                }
                p {
                    font-size: 14px;
                    color: #333;
                    line-height: 1;
                    padding: 5px 0;
                    span.price {
                        color: @primary;
                    }
                    i {
                        color: #DCDCDC;
                        font-style: normal;
                    }
                }
                .vin-codes {
                    .vin-codes-content {
                        display: flex;
                        aside {
                            flex: 0 0 60px;
                            padding: 5px 0;
                            line-height: 1;
                        }
                        section {
                            flex: 1;
                            transition: all .3s ease;
                            overflow: hidden;
                        }
                    }
                }
                .open-btn {
                    text-align: center;
                    padding: 10px 0 0;
                    span {
                        color: #999;
                        font-size: 12px;
                        padding-right: 5px;
                    }
                    img {
                        transition: all .5s ease;
                        transform: rotate(90deg);
                    }
                }
            }
        }
    }
</style>
