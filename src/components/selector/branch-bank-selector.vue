<template>
    <div v-if="value" class="branch-bank-selector">
        <title-bar @leftBarEvent="goBack" :isLeftEventDefault="false">{{title}}</title-bar>
        <dl
            @touchstart="touchstart"
            @touchmove="touchmove"
            class="item-list" v-if="!showSearchPannel">
            <dt>省份</dt>
            <dd
                v-for="(province,index) in provinceList"
                :key="index + '' + province.id"
                :class="{'item-selected': activeProvinceIndex === index}"
                @click="selectProvince(index)">{{province.name}}</dd>
        </dl>
        <transition name="city-list">
            <div v-if="cityListShow && !showSearchPannel" class="city-list">
                <h6>{{activeProvinceIndex > -1 && provinceList[activeProvinceIndex].name}}</h6>
                <dl class="item-list">
                    <dt>城市</dt>
                    <dd
                        v-for="(city,index) in cityList"
                        :key="index + '' + city.id"
                        :class="{'item-selected': activeCityIndex === index}"
                        @click="selectCity(index)">{{city.name}}</dd>
                </dl>
            </div>
        </transition>

        <div class="search-pannel" v-if="showSearchPannel">
            <div class="search-frame">
                <div class="search-box">
                    <img class="search-box-icon" src="~@/assets/images/search-icon.png">
                    <input
                        class="search-box-input"
                        type="text"
                        ref="searchBoxInput"
                        @blur="showSearchCancel = false"
                        @focus="showSearchCancel = true"
                        placeholder="请输入支行名称"
                        v-model.trim="searchBankWd">
                    <img
                        v-if="searchBankWd.length > 0"
                        class="clear-wd"
                        @click="clearSearchWd"
                        src="~@/assets/images/clear-wd.png">
                </div>
                <span v-if="showSearchCancel" class="search-cancel" @click="cancelSearch">取消</span>
            </div>
            <ul class="search-res">
                <li v-for="bank in searchRes" :key="bank.code" @click="selectBank(bank)">{{bank.name}}</li>
            </ul>
            <no-search-result v-if="!isInitStatus && searchRes.length < 1" />
        </div>
    </div>
</template>

<script>
import Api from '@/api';
import comCommonFunc from '@/mixins/com-common-func';
import NoSearchResult from '@/components/no-search-result';

const originDataStr = JSON.stringify({
    // 是初始加载
    isInitStatus: true,
    slideY: 0,
    provinceList: [],
    activeProvinceIndex: -1,
    cityList: [],
    activeCityIndex: -1,
    cityListShow: false,
    // 显示搜索页面
    showSearchPannel: false,
    searchBankWd: '',
    showSearchCancel: false,
    // 所有的搜索数据
    allSearchData: [],
    // 搜索结果
    searchRes: []
});
// 选择仓库
export default {
    name: 'branchBankSelector',
    components: {
        NoSearchResult
    },
    mixins: [comCommonFunc],
    data() {
        return JSON.parse(originDataStr);
    },
    props: {
        bankId: {
            required: true
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
        }
    },
    methods: {
        reloadData() {
            this.openComponent();
            const originData = JSON.parse(originDataStr);
            Object.keys(originData).forEach((key) => {
                this[key] = originData[key];
            });
            this.title = '选择开户支行';

            this.$som.loading.show({
                text: '正在获取...'
            });
            Api.fsc
                .v1_bankApi_queryProvinces({
                    bankId: this.bankId
                })
                .then((res) => {
                    this.provinceList = res;
                });
        },
        touchstart(e) {
            this.slideY = e.changedTouches[0].clientY;
        },
        touchmove(e) {
            if (Math.abs(e.changedTouches[0].clientY - this.slideY) > 10) {
                this.cityListShow = false;
            }
        },
        selectProvince(index) {
            this.activeProvinceIndex = index;
            this.cityListShow = true;
            this.activeCityIndex = -1;

            this.$som.loading.show({
                text: '正在获取...'
            });
            Api.fsc
                .v1_bankApi_queryCitiesByProvinceId({
                    provinceId: this.provinceList[index].id,
                    bankId: this.bankId
                })
                .then((res) => {
                    this.cityList = res;
                });
        },
        selectCity(index) {
            this.activeCityIndex = index;
            this.cityListShow = false;
            this.showSearchPannel = true;

            this.$som.loading.show({
                text: '正在获取...'
            });
            Api.fsc
                .v1_bankApi_queryByCityIdAndBankId({
                    cityId: this.cityList[index].id,
                    bankId: this.bankId
                })
                .then((res) => {
                    this.allSearchData = res;
                    this.searchFunc();
                });
        },
        // 搜索内容
        searchFunc(val = '') {
            this.isInitStatus = false;
            if (val === '') {
                this.searchRes = this.allSearchData;
                return false;
            }
            const valSplitStr = val
                .replace(/\s/g, '')
                .split('')
                .join('.*');
            const valReg = new RegExp(valSplitStr, 'i');

            // 搜索结果
            const searchRes = [];
            this.allSearchData.forEach((item) => {
                if (valReg.test(item.name)) {
                    searchRes.push(item);
                }
            });

            this.searchRes = searchRes;
        },
        // 设置左上角
        goBack() {
            if (this.showSearchPannel) {
                this.showSearchPannel = false;
                this.allSearchData = [];
            } else {
                this.closeComponent();
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
        // 选择银行
        selectBank(item) {
            const pvin = this.provinceList[this.activeProvinceIndex];
            const city = this.cityList[this.activeCityIndex];
            this.closeComponent();
            /*
            * Desc 返回参数格式
            *
            * provinceId  省份id  2
            * provinceName  省份名称  "安徽省"
            * cityId  城市id  23
            * cityName  城市名称  "宣城市"
            * code  银行code  "310290000013"
            * id  银行id  834
            * name  银行名称  "浦发银行"
            *
            */
            this.$emit('selected', {
                provinceId: pvin.id,
                provinceName: pvin.name,
                cityId: city.id,
                cityName: city.name,
                ...item
            });
        }
    }
};
</script>

<style lang="less" scoped>


.city-list-enter,
.city-list-leave-to {
    transform: translate3d(100%, 0, 0);
}
.city-list-enter-active {
    transition: transform 240ms;
}

.branch-bank-selector {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    .item-list {
        margin: 0;
        background: #fff;

        dt {
            height: 28px;
            padding-left: 4.27%;
            color: #666;
            font-size: 12px;
            line-height: 28px;
            background: #f2f2f2;
        }

        dd {
            position: relative;
            height: 48px;
            margin-left: 4.27%;
            color: #1a1a1a;
            font-size: 16px;
            line-height: 48px;
            .border-top(#d9d9d9);

            &:nth-of-type(1):before {
                width: 0;
                height: 0;
            }

            &.item-selected {
                color: @blue;
            }
        }
    }
    .city-list {
        box-sizing: border-box;
        position: fixed;
        top: 0;
        right: 0;
        width: 82.945%;
        height: 100%;
        padding-top: 44px;
        box-shadow: -5px 0px 5px rgba(0, 0, 0, 0.1);
        background: #fff;
        overflow-y: scroll;

        h6 {
            height: 48px;
            margin: 0;
            color: #1a1a1a;
            font-size: 16px;
            line-height: 48px;
            text-align: center;
        }
    }

    .search-pannel {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(~'100% - 44px');
        background: #f2f2f2;

        .search-frame {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            overflow: hidden;
            width: 91.47%;
            height: 30px;
            margin: 8px auto;
            padding: 0 4%;
            background: #f2f2f2;

            .search-box {
                flex: 1;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                overflow: hidden;
                height: 28px;
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
        .search-res {
            flex: 1;
            overflow-y: scroll;
            background: #fff;

            li {
                position: relative;
                margin-left: 4.26%;
                padding: 16px 4.26% 16px 0;
                color: #1a1a1a;
                font-size: 16px;
                .border-bottom(#d9d9d9);

                &:active {
                    color: @blue;
                }
            }
        }
    }
}
</style>
