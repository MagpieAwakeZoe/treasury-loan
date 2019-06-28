<template>
    <div class="pg-pickup-list-noorder">
        <no-data v-if="list.length === 0 && !searchFlag && !loading">暂无可提车辆</no-data>
        <div class="search-result" v-else>
            <som-scroll-refresh v-if="list.length" :prevent-default="true" :pull-up="getData">
                <div class="list">
                <div class="order" v-for="(item, $index) in list"
                :key="$index"
                        :class="{'disabled': (checkWarehouse !== '' && checkWarehouse !== item.warehouseName)}">
                    <input type="radio"  :value="item.warehouseName"  v-model="checkWarehouse" style="display:none">
                    <div>
                        <div class="title">
                            <span>所在仓库: {{item.warehouseName}}</span>
                            <span>共 {{item.wareNameDeleteOrderCarNum}} 辆</span>
                        </div>
                        <ul class="car-list">
                            <li v-for="(car, $index) in item.carList" :key="$index"
                            @click="carClick(item.warehouseName)"
                                :class="{'disabled': carStatus(item.warehouseName)}">
                                <input type="checkbox"  :value="car.carId" class="icon-checkbox" v-model="checklist"
                                        :id="'car'+ car.carId"
                                        :disabled="item.warehouseName | carStatus(checkWarehouse)">
                                <label :for="'car'+ car.carId">
                                    <list-car-info :data="car"></list-car-info>
                                </label>
                                <span class="status">已入库</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </som-scroll-refresh>
            <no-data v-else-if="searchFlag">未搜索到结果</no-data>
        </div>
        <fixed-bottom v-if="list.length > 0">
            <som-button :gradients="['#3684FF', '#3665FF']" @click.native="submit">确定</som-button>
        </fixed-bottom>
    </div>
</template>

<script>
import Api from '@/api';
import ListCarInfo from '@/components/list-car-info.vue';
import FixedBottom from '@/components/fixed-bottom.vue';
import NoData from '@/components/no-data.vue';
import NoticeBar from '@/components/common/notice-bar.vue';
import Pages from '@/mixins/pages';

export default {
    name: 'pickupListNoOrder',
    data () {
        return {
            results: {},
            list: [],
            oldList: [],
            searchFocus: false,
            checklist: [],
            searchFlag: false, // 是否搜索过
            loading: true
        };
    },
    mixins: [Pages],
    components: {
        ListCarInfo,
        FixedBottom,
        NoData,
        NoticeBar
    },
    computed: {
        fuzzyQueryParam: function () {
            return this.$store.state.pickupList.fuzzyQueryParam;
        },
        checkWarehouse: function () {
            for (let i = 0, len = this.oldList.length; i < len; i ++) {
                let currentValue = this.oldList[i];
                let isInclude = currentValue.carList.find((value) => {
                    return this.checklist.includes(value.carId);
                });
                if (isInclude) {
                    return currentValue.warehouseName;
                }
            }
            return '';
        }
    },
    watch: {
        list: function (val) {
            if (val.length > 0) {
                this.$setBodyBack('#f2f2f2');
            } else {
                this.$setBodyBack('#fff');
            }
        },
        fuzzyQueryParam: function () {
            this.search();
        }
    },
    filters: {
        carStatus: (warehouseName, checkWarehouse) => {
            return (checkWarehouse !== '' && checkWarehouse !== warehouseName);
        }
    },
    methods: {
        carStatus (warehouseName) {
            return (this.checkWarehouse !== '' && this.checkWarehouse !== warehouseName);
        },
        submit () {
            if (this.checklist.length === 0) {
                return this.$som.toast.text('请选择车辆');
            }
            // 跳转录入提车人
            this.$router.push({
                path: '/add-car-lift/noorder',
                query: {
                    carIds: this.checklist
                }
            });
        },
        search () {
            this.page.current = 0;
            this.list = [];
            this.searchFlag = true;
            this.getData();
        },
        carClick (warehouseName) {
            if (this.checkWarehouse !== '' && this.checkWarehouse !== warehouseName) {
                return this.$som.toast.text('请选择同一仓库的车辆');
            }
        },
        getData (e) {
            this.page.current ++;
            if (this.results.totalPage !== 0 && this.results.totalPage < this.page.current) {
                e && e.completed();
                return;
            }
            this.loading = true;
            Api.fsc.v1_orderDeletedCarApi_getNotDoingBusinessAllCar({
                ...this.page,
                fuzzyQueryParam: this.fuzzyQueryParam
            }).then((res) => {
                e && e.loaded();
                this.loading = false;
                this.results = res;
                this.list = this.list.concat(res.items);
                this.oldList = this.oldList.concat(this.list); // 保存原列表数据,用于搜索时过滤跨订单的选择
            }).catch(() => {
                e && e.loaded();
                this.$setBodyBack('#fff');
                this.loading = false;
            });
        }
    },
    mounted () {
        this.$setBodyBack();
        this.getData();
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-pickup-list-noorder{
    .search-result{
        height: ~"calc(100vh - 228px)";
        margin-bottom: 52px;
        .list{
            .order{
                background: #fff;
                margin-bottom: 12px;
                &.disabled{
                    .title,li{
                        opacity: .4;
                    }
                }
                &>div{
                    padding-left: 16px;
                }
                .title{
                    display: flex;
                    justify-content: space-between;
                    line-height: 44px;
                    color: #666;
                    padding-right: 16px;
                    .border-bottom();
                }
                li{
                    padding: 16px 16px 16px 0;
                    display: flex;
                    align-items: center;
                    position: relative;
                    .border-bottom();
                    input{
                        margin-right: 12px;
                    }
                    label{
                        flex: 1;
                        margin-right: 10px;
                    }
                    .status{
                        width: 50px;
                        color: @primary;
                        text-align: right;
                    }
                    &.disabled{
                        opacity: .4;
                    }
                }
            }
            .status-img{
                width: 50px;
                position: absolute;
                z-index: 2;
                right: 0;
                bottom: 0;
            }
        }
    }
}
</style>
