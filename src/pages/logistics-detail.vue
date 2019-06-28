<template>
    <div class="logistics-list">
        <title-bar>查看物流</title-bar>
        <ul>
            <li
                v-for="(item,logisticsIndex) in logisticsList"
                :key="logisticsIndex + '' + item.carId"
                class="logistics">
                <div class="logistics-item" @click="changeExpand(item)">
                    <div class="logistics-item-main">
                        <div class="car-model-info">
                            <div class="car-model-name">{{item.modelName}}</div>
                            <div class="car-model-config">
                                <div class="car-appearance">{{item.carAppearance}}</div>
                                <div class="split-line"></div>
                                <div class="carframe-number">车架号: {{item.vin}}</div>
                            </div>
                        </div>
                        <div class="logistics-stage">
                            <span>{{item.stockStatusStr}}</span>
                            <img :class="{'open-triangle': item.expand}" src="~@/assets/images/expand-arrow.png">
                        </div>
                    </div>
                    <div class="one-pixel-line"></div>
                </div>
                <ul v-if="item.expand && item.logisticList.length > 0" class="logistics-detail">
                    <li
                        v-for="(detail,processIndex) in item.logisticList"
                        :key="processIndex"
                        class="logistics-detail-one">
                        <div class="logistics-detail-main">
                            <div class="logistics-process-time">{{detail.logisticsProgressTime}}</div>
                            <div class="logistics-process-desc"><em>{{detail.logisticsProgressInformation}}</em></div>
                        </div>
                        <div class="logistics-process-line"></div>
                        <img class="logistics-process-icon logistics-process-curr" src="~@/assets/images/logistics-process-current.png">
                        <img class="logistics-process-icon logistics-process-hist" src="~@/assets/images/logistics-process-history.png">
                    </li>
                </ul>
                <div v-if="item.expand && item.logisticList.length > 0" class="one-pixel-line"></div>
            </li>
        </ul>
    </div>
</template>

<script>
import Api from '@/api';

export default {
    name: 'logisticsDetail',
    data() {
        return {
            logisticsList: []
        };
    },
    created() {
        this.$setBodyBack('#fff');
        Api.fsc
            .v1_carApi_getCarLogisticsInfo({
                orderId: this.$route.query.orderId
            })
            .then((res) => {
                this.processLogistics(res);
            });
    },
    methods: {
        changeExpand(item) {
            if (!item.logisticList || item.logisticList.length < 1) {
                return;
            }
            item.expand = !item.expand;
        },
        processLogistics(d) {
            const logisticsList = [];
            d.forEach(
                ({
                    appearanceColor,
                    modelName,
                    carId,
                    interiorColor,
                    logisticList = [],
                    stockStatusStr = '',
                    vin = ''
                }) =>
                    logisticsList.push({
                        carId,
                        modelName,
                        carAppearance: `${appearanceColor}/${interiorColor}`,
                        // 只显示车驾号后6位
                        vin: `${vin}`.substr(-6),
                        stockStatusStr,
                        expand: false,
                        logisticList
                    })
            );
            logisticsList.length > 0 && (logisticsList[0].expand = true);
            this.logisticsList = logisticsList;
        }
    }
};
</script>
<style lang="less" scoped>
.logistics-list {
    & > ul .logistics {
        padding-left: 4.26%;

        .logistics-item {
            position: -webkit-sticky;
            position: sticky;
            top: 44px;
            z-index: 3;

            .logistics-item-main {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #fff;

                .car-model-info {
                    padding: 16px 0;
                    max-width: 72%;

                    .car-model-name {
                        width: 100%;
                        overflow: hidden;
                        font-size: 16px;
                        line-height: 1.5;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .car-model-config {
                        display: flex;
                        align-items: center;
                        line-height: 1.5;

                        .car-appearance {
                            color: #666;
                        }
                        .split-line {
                            width: 1px;
                            height: 10px;
                            margin: 0 8px;
                            background: #dcdcdc;
                        }
                        .carframe-number {
                            color: #666;
                        }
                    }
                }
                .logistics-stage {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 17px;

                    span {
                        color: @primary;
                        font-size: 14px;
                    }
                    img {
                        width: 13px;
                        height: 8px;
                        margin-left: 25px;
                        transition: transform 0.3s;

                        &.open-triangle {
                            transform: rotateZ(180deg);
                        }
                    }
                }
            }
        }
        .one-pixel-line {
            width: 100%;
            height: 1px;
            background: #dcdcdc;

            // 1px
            @media (-webkit-min-device-pixel-ratio: 3) {
                & {
                    transform: scaleY(0.3333);
                }
            }
            @media (-webkit-min-device-pixel-ratio: 2) {
                & {
                    transform: scaleY(0.5);
                }
            }
            @media (-webkit-min-device-pixel-ratio: 1.5) {
                & {
                    transform: scaleY(0.666);
                }
            }
        }
        .logistics-detail {
            padding: 10px 0 38px;

            .logistics-detail-one {
                position: relative;
                width: 86.63%;
                margin-left: 8.915%;
                padding: 6px 0;

                .logistics-detail-main {
                    box-sizing: border-box;
                    padding: 12px 11px;

                    .logistics-process-time {
                        color: #333;
                        font-size: 14px;
                    }
                    .logistics-process-desc {
                        display: flex;
                        margin-top: 10px;
                        color: #666;
                        font-size: 14px;
                        line-height: 1.5;

                        em {
                            margin-right: 8px;
                            font-style: normal;
                            color: #333;
                        }
                    }
                }
                .logistics-process-line {
                    position: absolute;
                    top: 0;
                    left: -7.72%;
                    z-index: 1;
                    width: 0;
                    height: 100%;
                    border-left: 1px dashed #dcdcdc;
                }

                .logistics-process-icon {
                    position: absolute;
                    top: 50%;
                    left: -7.72%;
                    z-index: 2;
                    width: 16px;
                    height: 16px;
                    margin-top: -8px;
                    margin-left: -8px;
                }
                .logistics-process-curr {
                    display: none;
                }
                .logistics-process-hist {
                    display: block;
                }

                &:nth-of-type(1) {
                    .logistics-process-line {
                        top: 50%;
                        height: 50%;
                    }

                    .logistics-detail-main {
                        border-radius: 4px;
                        background: #f8f8f8;

                        .logistics-process-time {
                        }
                        .logistics-process-desc {
                            em {
                                font-weight: bold;
                            }
                        }
                    }

                    .logistics-process-curr {
                        display: block;
                    }
                    .logistics-process-hist {
                        display: none;
                    }
                }
                &:last-child {
                    .logistics-process-line {
                        height: 50%;
                    }
                }
            }
        }
    }
}
</style>
