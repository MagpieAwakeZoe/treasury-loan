<template>
    <div class="pg-pickup-list-allorder">
        <no-data v-if="orderCarList.length === 0 && !searchFlag && !loading">暂无可提车辆</no-data>
        <div class="search-result" v-else>
            <som-scroll-refresh :prevent-default="true" v-if="orderCarList.length" :pull-up="getData">
                <div class="list">
                <div class="order" v-for="(order, $index) in orderCarList"
                :key="$index"
                        :class="{'disabled': (checkOrder !== '' && checkOrder !== order.orderId) || orderStatus(order.carInfoList)}">
                    <input type="radio"  :value="order.orderId"  v-model="checkOrder" style="display:none">
                    <div>
                        <div class="title">
                            <span>订单号: {{order.orderNo}}</span>
                            <span>共 {{order.orderCarNum}} 辆</span>
                        </div>
                        <ul class="car-list">
                            <li v-for="(car, $index) in order.carInfoList" :key="$index"
                            @click="carClick(order.orderId, car)"
                                :class="{'disabled': carStatus(order.orderId, car)}">
                                <input type="checkbox"  :value="car.carId+','+car.carIdHessian" class="icon-checkbox" v-model="checklist"
                                        :id="'car'+ car.carId"
                                        :disabled="order.orderId | carStatus(car, checkOrder)">
                                <label :for="'car'+ car.carId">
                                    <list-car-info :data="car"></list-car-info>
                                </label>
                                <span class="status">{{car.stockStatusStr}}</span>
                                <img src="~@/assets/images/deal-doing.png" class="status-img" v-if="car.alyPayDeposit">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </som-scroll-refresh>
            <no-data v-else-if="searchFlag">未搜索到结果</no-data>
        </div>
        <fixed-bottom v-if="orderCarList.length > 0">
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
/*
    stockStatus:
    10, "待起运",
    20, "待入库",
    30, "待出库",
    40, "已出库",
    50, "已交车";
*/

export default {
    name: 'pickupListAllOrder',
    data () {
        return {
            results: {},
            orderCarList: [],
            oldOrderCarList: [],
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
        fuzzyQueryParam: function() {
            return this.$store.state.pickupList.fuzzyQueryParam;
        },
        checkOrder: function () {
            for (let i = 0, len = this.oldOrderCarList.length; i < len; i ++) {
                let currentValue = this.oldOrderCarList[i];
                let isInclude = currentValue.carInfoList.find((value) => {
                    return this.checklist.includes(`${value.carId},${value.carIdHessian}`);
                });
                if (isInclude) {
                    return currentValue.orderId;
                }
            }
            return '';
        }
    },
    watch: {
        orderCarList: function (val) {
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
        carStatus: (orderId, car, checkOrder) => {
            return (checkOrder !== '' && checkOrder !== orderId) ||
            car.stockStatus !== 30 || car.alyPayDeposit;
        }
    },
    methods: {
        carStatus (orderId, car) {
            return (this.checkOrder !== '' && this.checkOrder !== orderId) ||
            car.stockStatus !== 30 || car.alyPayDeposit;
        },
        orderStatus (carInfoList) {
            let num = 0;
            for (let value of carInfoList.values()) {
                if (value.stockStatus !== 30 || value.alyPayDeposit) {
                    // eslint-disable-next-line
                    num += 1;
                }
            }
            return carInfoList.length === num;
        },
        submit () {
            if (this.checklist.length === 0) {
                return this.$som.toast.text('请选择车辆');
            }
            let carIds = [];
            let carCodes = [];
            for (let i = 0, len = this.checklist.length; i < len; i++) {
                let arr = this.checklist[i].split(',');
                carIds.push(arr[0]);
                carCodes.push(arr[1]);
            }
            // 跳转录入提车人
            this.$router.push({
                path: '/add-car-lift',
                query: {
                    orderId: this.checkOrder,
                    carIds: carIds
                }
            });
        },
        search () {
            this.page.current = 0;
            this.orderCarList = [];
            this.searchFlag = true;
            this.getData();
        },
        carClick (orderId, car) {
            if (this.checkOrder !== '' && this.checkOrder !== orderId) {
                return this.$som.toast.text('请选择同一订单的车辆');
            }
            if (car.stockStatus !== 30) {
                return this.$som.toast.text('未入库的车辆不可提车');
            }
            if (car.alyPayDeposit) {
                return this.$som.toast.text('车辆交易中，不可提车');
            }
        },
        getData (e) {
            this.page.current ++;
            if (this.results.totalPage !== 0 && this.results.totalPage < this.page.current) {
                e && e.completed();
                return;
            }
            this.loading = true;
            Api.fsc.v1_carApi_getAllCarToPickAllOrders({
                ...this.page,
                fuzzyQueryParam: this.fuzzyQueryParam
            }).then((res) => {
                e && e.loaded();
                this.loading = false;
                this.results = res;
                this.orderCarList = this.orderCarList.concat(res.orderCarList);
                this.oldOrderCarList = this.oldOrderCarList.concat(this.orderCarList); // 保存原列表数据,用于搜索时过滤跨订单的选择
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


.pg-pickup-list-allorder{
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
