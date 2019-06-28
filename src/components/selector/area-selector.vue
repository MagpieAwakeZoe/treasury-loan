<template>
    <div v-if="value" class="area-selector area-selector-theme-define">
        <title-bar @leftBarEvent="closeComponent" :isLeftEventDefault="false">{{title}}</title-bar>
        <div class="search-frame">
            <div class="search-box">
                <img class="search-box-icon" src="~@/assets/images/search-icon.png">
                <input
                    class="search-box-input"
                    type="text"
                    ref="searchBoxInput"
                    @blur="showSearchCancel = false"
                    @focus="showSearchCancel = true"
                    placeholder="请输入城市名称"
                    v-model.trim="searchBankWd">
                <img
                    v-if="searchBankWd.length > 0"
                    class="clear-wd"
                    @click="clearSearchWd"
                    src="~@/assets/images/clear-wd.png">
            </div>
            <span v-if="showSearchCancel" class="search-cancel" @click="cancelSearch">取消</span>
        </div>
        <no-search-result v-if="!isInitStatus && searchCityRes.length === 0" />
        <som-car-selector-b
            v-if="resShow && searchCityRes.length > 0"
            :scene="1"
            :getBrandData="somGetCityData"
            :getSeriesData="somGetStoreData"
            :getModelData="selectStoreData" />
    </div>
</template>

<script>
import Api from '@/api';
import SomCarSelectorB from '@souche-ui/som-car-selector-b';
import comCommonFunc from '@/mixins/com-common-func';
import NoSearchResult from '@/components/no-search-result';

const originDataStr = JSON.stringify({
    // 是初始加载
    isInitStatus: true,
    resShow: false,
    // 搜索结果
    searchBankWd: '',
    // 显示取消按钮
    showSearchCancel: false,
    // 通过城市code获取 城市数据
    cityCode2Data: {},
    // 当前所选城市
    selectedCityData: {},
    // 当前城市的,所有仓库数据
    storeData: [],
    // 城市数据
    cityList: [],
    // 搜索城市结果
    searchCityRes: []
});
// 选择仓库
export default {
    name: 'areaSelector',
    components: {
        SomCarSelectorB,
        NoSearchResult
    },
    mixins: [comCommonFunc],
    data() {
        return JSON.parse(originDataStr);
    },
    props: {
        // 1: 始发地, 2: 目的地
        type: {
            type: [String, Number],
            required: true,
            validator: function(val) {
                return +val === 1 || +val === 2;
            }
        },
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
        },
        searchBankWd(val) {
            this.searchFunc(val.trim());
        },
        type() {
            this.getCityData();
        }
    },
    methods: {
        reloadData() {
            this.openComponent();
            const originData = JSON.parse(originDataStr);
            Object.keys(originData).forEach((key) => {
                this[key] = originData[key];
            });
            let title = '';
            if (+this.type === 1) {
                title = '始发地';
            }
            if (+this.type === 2) {
                title = '仓库';
            }
            this.title = `选择${title}`;
            this.getCityData();
        },
        getCityData() {
            // 1: 始发地
            if (+this.type === 1) {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc.v1_areaApi_getDepartureList().then((res) => {
                    const cityList = [];
                    const cityCode2Data = {};
                    res.forEach(
                        ({
                            cityCode,
                            cityName,
                            cityNameInitial,
                            provinceCode,
                            provinceName
                        }) => {
                            const item = {
                                provinceCode,
                                provinceName,
                                code: cityCode,
                                name: cityName,
                                initialsLetter: cityNameInitial,
                                image: false
                            };
                            cityCode2Data[item.code] = item;
                            cityList.push(item);
                        }
                    );

                    this.cityCode2Data = cityCode2Data;
                    this.cityList = cityList;
                    this.searchFunc();
                });
            }
            // 2: 目的地
            if (+this.type === 2) {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc
                    .v1_areaApi_getDestinationList({
                        warehousePartnerCode: 'YCGJ'
                    })
                    .then((res) => {
                        const cityList = [];
                        const cityCode2Data = {};
                        res.forEach(
                            ({
                                cityCode,
                                cityName,
                                cityNameInitial,
                                provinceCode,
                                provinceName
                            }) => {
                                const item = {
                                    provinceCode,
                                    provinceName,
                                    code: cityCode,
                                    name: cityName,
                                    initialsLetter: cityNameInitial,
                                    image: false
                                };
                                cityCode2Data[item.code] = item;
                                cityList.push(item);
                            }
                        );
                        this.cityList = cityList;
                        this.cityCode2Data = cityCode2Data;
                        this.searchFunc();
                    });
            }
        },
        // 消除搜索内容
        clearSearchWd() {
            this.searchBankWd = '';
            this.$refs.searchBoxInput.focus();
        },
        // 取消搜索
        cancelSearch() {
            this.searchBankWd = '';
            this.$refs.searchBoxInput.blur();
        },
        // 为了让组件重新加载
        changeResShow(val) {
            this.resShow = !val;
            this.$nextTick(() => {
                this.resShow = val;
            });
        },
        // 搜索内容
        searchFunc(val = '') {
            this.isInitStatus = false;
            if (val === '') {
                this.searchCityRes = this.cityList;
                this.changeResShow(true);
                return false;
            }
            const valSplitStr = val
                .replace(/\s/g, '')
                .split('')
                .join('.*');
            const valReg = new RegExp(valSplitStr, 'i');

            // 搜索结果
            const searchCityRes = [];
            this.cityList.forEach((item) => {
                if (valReg.test(item.name)) {
                    searchCityRes.push(item);
                }
            });

            this.searchCityRes = searchCityRes;
            this.changeResShow(true);
        },
        // 获取城市列表
        somGetCityData() {
            return new Promise((resolve) => {
                resolve(this.searchCityRes);
            });
        },
        // 获取仓库列表
        somGetStoreData(cityCode) {
            this.selectedCityData = this.cityCode2Data[cityCode];
            if (+this.type === 1) {
                this.closeComponent();
                /*
                * Desc 返回参数格式
                * type  [入参, 1], 始发地
                *
                *
                * provinceCode  省份code
                * provinceName  省份名称
                * cityCode  城市code
                * cityName  城市名称
                *
                * code  [等价 cityCode, 内部使用]城市code
                * name  [等价 cityName, 内部使用]城市名称
                * initialsLetter  [内部使用]城市首字母大写
                *
                * 其它为内部使用
                *
                */
                this.$emit('selected', {
                    cityCode: this.selectedCityData.code,
                    cityName: this.selectedCityData.name,
                    ...this.selectedCityData
                });
                return [];
            }

            return new Promise((resolve) => {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc
                    .v1_areaApi_getWarehouseList({
                        warehousePartnerCode: 'YCGJ',
                        destinationProvinceCode: this.selectedCityData
                            .provinceCode,
                        destinationCityCode: this.selectedCityData.code
                    })
                    .then((res) => {
                        const storeData = [];
                        res.forEach((item) => {
                            const {
                                warehouseAddress,
                                warehouseName,
                                storageCode
                            } = item;
                            storeData.push({
                                subBrandName: '目的地',
                                name: `<div class="area-local"><span>${warehouseName}</span><em>${warehouseAddress}</em></div>`,
                                code: `${storageCode}`,
                                ...item
                            });
                        });
                        this.storeData = storeData;
                        resolve(storeData);
                    });
            });
        },
        // 选择仓库
        selectStoreData(storeCode) {
            // 选择的数据
            let selectData = {
                cityCode: this.selectedCityData.code,
                cityName: this.selectedCityData.name,
                provinceCode: this.selectedCityData.provinceCode,
                provinceName: this.selectedCityData.provinceName
            };
            this.storeData.some((store) => {
                if (store.code === storeCode) {
                    selectData = {
                        ...selectData,
                        ...store
                    };
                }
                return store.code === storeCode;
            });

            this.closeComponent();
            /*
            * Desc 返回参数格式
            * type  [入参, 2], 目的地
            *
            *
            * provinceCode  省份code
            * provinceName  省份名称
            * cityCode  城市code
            * cityName  城市名称
            * storageCode  仓库code
            *
            * code  [等价 storageCode, 内部使用]仓库code
            * name  [内部使用]排版使用,仓库名+地址
            *
            * 其它为 /v1/areaApi/getWarehouseList.json 的直接返回参数
            *
            */
            this.$emit('selected', selectData);
            return [];
        }
    }
};
</script>

<style lang="less">
.area-selector-theme-define {
    .som-selector-cascader {
        top: 90px;
    }
    .som-selector-group--transition {
        transition: initial;
    }

    .som-selector-list-item-label-selected {
        color: @blue;
    }
    .som-selector-alphabet__content--item {
        color: @blue;
    }

    .area-local {
        * {
            word-wrap: break-word;
            word-break: break-all;
        }
        span {
            display: block;
            color: #1a1a1a;
            font-size: 16px;
        }
        em {
            display: block;
            color: #666;
            font-style: normal;
            font-size: 14px;
        }

        &:active {
            * {
                color: @blue;
            }
        }
    }
    .som-selector-group__content--inner--title {
        font-weight: bold;
    }
}
</style>
<style lang="less" scoped>
.area-selector {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f2f2f2;

    .search-frame {
        display: flex;
        align-items: center;
        height: 46px;
        margin: auto;
        padding: 0 4.26%;
        background: #f2f2f2;

        .search-box {
            flex: 1;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            overflow: hidden;
            height: 30px;
            padding-right: 3%;
            padding-left: 4%;
            border-radius: 15px;
            border: 1px solid #bbb;
            background: #fff;

            .search-box-icon {
                width: 16px;
                height: 16px;
                margin-right: 8px;
            }
            .search-box-input {
                flex: 1;
                border: none;
                height: 20px;
                line-height: 20px;
            }
            .clear-wd {
                width: 16px;
                height: 16px;
            }
        }
        .search-cancel {
            margin-left: 16px;
            color: @blue;
            font-size: 16px;
        }
    }
}
</style>

