<template>
    <div v-if="value" class="car-selector car-selector-theme-define">
        <title-bar @leftBarEvent="closeComponent" :isLeftEventDefault="false">{{title}}</title-bar>
        <som-car-selector-b
            :scene="1"
            :getBrandData="getBrandData"
            :getSeriesData="getSeriesData"
            :getModelData="getModelData"
            @onSelectedBrand="onSelectedBrand"
            @onSelected="onSelected" />
    </div>
</template>

<script>
import SomCarSelectorB from '@souche-ui/som-car-selector-b';
import Api from '@/api';
import comCommonFunc from '@/mixins/com-common-func';

const originDataStr = JSON.stringify({
    modelPriceMarginLeft: Math.floor(window.innerWidth * (30 / 375)),
    // 选择的品牌
    selectedBrand: {},
    // 通过车系code 获取 车系信息
    seriesCode2series: {}
});

// 监测 selected 事件
export default {
    name: 'carSelector',
    components: {
        SomCarSelectorB
    },
    mixins: [comCommonFunc],
    data() {
        return JSON.parse(originDataStr);
    },
    props: {
        // 显示/隐藏
        value: {
            required: true,
            type: Boolean,
            default: false
        }
    },
    watch: {
        // 重置数据
        value(val) {
            if (val) {
                this.reloadData();
            }
        }
    },
    methods: {
        reloadData() {
            this.openComponent();
            const originData = JSON.parse(originDataStr);
            Object.keys(originData).forEach((key) => {
                this[key] = originData[key];
            });
            this.title = '选择品牌车型';
        },
        onSelectedBrand(brand = []) {
            if (brand.length > 0) {
                this.selectedBrand = brand[0];
            } else {
                this.selectedBrand = {};
            }
        },
        // 获取品牌列表
        getBrandData() {
            return new Promise((resolve) => {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc.v1_carApi_getCarBrandList().then((res) => {
                    const arr = [];
                    res.forEach(({ brandCode, brandName, brandNameInitial }) =>
                        arr.push({
                            code: brandCode,
                            name: brandName,
                            initialsLetter: brandNameInitial,
                            image: false
                        })
                    );
                    resolve(arr);
                });
            });
        },
        // 获取车系列表
        getSeriesData(brandCode) {
            const selectedBrandName = this.selectedBrand.name;

            return new Promise((resolve) => {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc
                    .v1_carApi_getCarSeriesList({ brandCode })
                    .then((res) => {
                        const arr = [];
                        const seriesCode2series = {};
                        res.forEach(({ seriesCode, seriesName }) => {
                            const item = {
                                code: seriesCode,
                                name: seriesName,
                                subBrandName: selectedBrandName
                            };
                            arr.push(item);
                            seriesCode2series[item.code] = item;
                        });
                        this.seriesCode2series = seriesCode2series;
                        resolve(arr);
                    });
            });
        },
        // 获取车型列表
        getModelData(seriesCode) {
            const seriesName = this.seriesCode2series[seriesCode].name;
            return new Promise((resolve) => {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc
                    .v1_carApi_getCarModelList({ seriesCode })
                    .then((res) => {
                        const arr = [];
                        res.forEach(
                            ({
                                guidePrice = '',
                                guidePriceStr = '',
                                modelCode,
                                modelName
                            }) =>
                                arr.push({
                                    code: modelCode,
                                    guidePrice,
                                    guidePriceStr,
                                    modelName,
                                    // eslint-disable-next-line
                                    name: `<div class="model-price"><span>${modelName}</span><em style="margin-left:${
                                        this.modelPriceMarginLeft
                                    }px">${guidePriceStr}</em></div>`,
                                    modelYear: seriesName
                                })
                        );
                        resolve(arr);
                    });
            });
        },
        onSelected(data) {
            const brand = data[0];
            const series = brand.series[0];
            const model = series.model[0];

            this.closeComponent();
            this.$emit('selected', {
                brandName: brand.name,
                brandCode: brand.code,
                seriesName: series.name,
                seriesCode: series.code,
                modelName: model.modelName,
                modelCode: model.code,
                guidePrice: model.guidePrice,
                guidePriceStr: model.guidePriceStr
            });
        }
    }
};
</script>

<style lang="less">
.car-selector-theme-define {
    .som-selector-group__content--inner--title {
        font-weight: bold;
    }
    .som-selector-group {
        position: fixed;
        top: 44px;
    }
    .som-selector-list-item-label-selected {
        color: @blue;

        .model-price {
            em {
                color: @blue;
            }
        }
    }
    .som-selector-alphabet__content--item {
        color: @blue;
    }
    .model-price {
        display: flex;
        justify-content: space-between;

        em {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            min-width: 75px;
            text-align: right;
            font-style: normal;
            color: #666;
        }
    }
}
</style>
<style lang="less" scoped>
.car-selector {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    background: #fff;
    -webkit-overflow-scrolling: touch;

    .selector-item-body-custom {
        display: flex;
        flex-wrap: wrap;
        padding: 16px;

        .card-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 48px;

            .card-item-span {
                font-size: 12px;
                margin-top: 10px;
                color: #1a1a1a;
            }
            .card-item-image {
                width: 32px;
            }

            &.card-item-selected .card-item-span {
                color: @blue;
            }
        }
    }
}
</style>
