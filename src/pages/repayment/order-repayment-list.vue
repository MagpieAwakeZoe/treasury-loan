<template>
    <div class="pg-order-repayment-list">
        <title-bar>还款申请</title-bar>
        <no-data v-if="carList.length === 0 && !searchFlag && !loading">暂无需还款的车辆</no-data>
        <template v-else>
            <div class="fixed-top">
                <som-search-bar type="light" placeholder="请输入车型/车架号后六位" :is-cancel="searchFocus"
                            v-model="fuzzyQueryParam"
                            @on-focus="searchFocus = true"
                            @on-cancel="searchCancel"
                            ref="search"
                            @on-submit="search"></som-search-bar>
                <div class="total">
                    <span>共计 {{results.totalAmount}}辆</span>
                </div>
            </div>
            <div class="search-result">
                <div class="list" v-if="carList.length">
                    <div class="order"
                         :class="{'disabled': orderStatus(carList)}">
                        <div>
                            <div class="title">
                                <span>订单号: {{results.orderNo}}</span>
                                <span>共 {{carList.length}} 辆</span>
                            </div>
                            <ul class="car-list">
                                <li v-for="(car, $index) in carList" @click="carClick(car)" :key="$index"
                                    :class="{'disabled': carStatus(car)}">
                                    <input type="checkbox"  :value="car.carId" class="icon-checkbox" v-model="checklist"
                                           :id="'car'+ car.carId"
                                           :disabled="car.stockStatus <= 10">
                                    <label :for="'car'+ car.carId">
                                        <list-car-info :data="car"></list-car-info>
                                    </label>
                                    <span class="status">{{car.stockStatusStr}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <no-data v-else-if="searchFlag">未搜索到结果</no-data>
            </div>
            <fixed-bottom v-if="carList.length > 0">
                <som-button :gradients="['#3684FF', '#3665FF']" @click="submit" :delayTime="2000">确定</som-button>
            </fixed-bottom>
        </template>
        <overdue-modal v-model="show" :data="overdueResult"></overdue-modal>
    </div>
</template>

<script>
import Api from '@/api';
import FixedBottom from '@/components/fixed-bottom.vue';
import ListCarInfo from '@/components/list-car-info.vue';
import NoData from '@/components/no-data.vue';
import OverdueModal from '@/components/order/overdue-modal.vue';

/*
    stockStatus:
    10, "待起运",
    20, "待入库",
    30, "待出库",
    40, "已出库",
    50, "已交车";
*/

export default {
    name: 'orderRepaymentList',
    data () {
        return {
            fuzzyQueryParam: '',
            results: {},
            carList: [],
            searchFocus: false,
            checklist: [],
            searchFlag: false, // 是否搜索过
            loading: true,
            show: false,
            overdueResult: {}
        };
    },
    components: {
        ListCarInfo,
        FixedBottom,
        NoData,
        OverdueModal
    },
    watch: {
        carList: function (val) {
            if (val.length > 0) {
                this.$setBodyBack('#f2f2f2');
            } else {
                this.$setBodyBack('#fff');
            }
        }
    },
    filters: {
        carStatus: (car) => {
            return car.stockStatus <= 10;
        }
    },
    methods: {
        carStatus (car) {
            return car.stockStatus <= 10;
        },
        orderStatus (carList) {
            let num = 0;
            for (let value of carList.values()) {
                if (value.stockStatus <= 10) {
                    // eslint-disable-next-line
                    num += 1;
                }
            }
            return carList.length === num;
        },
        addRepayment () {
            this.$som.loading.show({
                text: '提交中'
            });
            Api.fsc.v1_repaymentApi_addNewRepayment({data: JSON.stringify({
                orderId: this.$route.query.orderId,
                carIds: this.checklist
            })}).then((res) => {
                this.$router.replace({
                    path: '/repayment-detail',
                    query: {
                        orderId: this.$route.query.orderId,
                        repaymentId: res.repaymentId
                    }
                });
            });
        },
        submit () {
            if (this.checklist.length === 0) {
                return this.$som.toast.text('请选择车辆');
            }
            this.$som.loading.show({
                text: '提交中'
            });
            if (this.results.capitalAscription === 10) { // // 如果选择的是网商订单，需要先判断是否存在网商逾期订单
                Api.fsc.v1_repaymentApi_consultInventoryOutInfo({orderId: this.$route.query.orderId}).then((res0) => {
                    if (res0.argStatus === 'NORMAL') { // 不存在逾期
                        this.addRepayment();
                    } else if (res0.argStatus === 'OVD') { // 存在逾期
                        this.overdueResult = res0;
                        this.show = true;
                    }
                });
            } else {
                this.addRepayment();
            }
        },
        search () {
            this.$refs.search.setBlur();
            this.searchFocus = false;
            this.searchFlag = true;
            this.getData();
        },
        searchCancel () {
            this.fuzzyQueryParam = '';
            this.search();
            this.searchFlag = false;
        },
        carClick (car) {
            if (car.stockStatus === 10) {
                return this.$som.toast.text('待起运的车辆不可还款');
            }
        },
        getData () {
            this.loading = true;
            Api.fsc.v1_carApi_getAllCarToRepay({
                orderId: this.$route.query.orderId,
                fuzzyQueryParam: this.fuzzyQueryParam
            }).then((res) => {
                this.loading = false;
                this.results = res;
                this.carList = res.carList;
            }).catch(() => {
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


.pg-order-repayment-list{
    // reset
    .som-search-bar__result{
        font-size: 14px;
    }
    .fixed-top{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
    }
    .total{
        color: #666;
        background: #f2f2f2;
        line-height: 48px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search-result{
        margin: 136px 0 52px 0;
        height: ~"calc(100vh - 188px)";
        overflow-y: scroll;
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
