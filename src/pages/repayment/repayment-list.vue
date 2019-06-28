<template>
    <div class="pg-repayment-list">
        <title-bar>还款申请
            <template slot="right">
                <span @click="$router.push('repayment-record')">还款记录</span>
            </template>
        </title-bar>
        <no-data v-if="orderCarList.length === 0 && !searchFlag && !loading">暂无需还款的车辆</no-data>
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
                <som-scroll-refresh :prevent-default="true" v-if="orderCarList.length" :pull-up="getData">
                    <div class="list">
                        <div class="order" v-for="order in orderCarList"
                             :class="{'disabled': (checkOrder !== '' && checkOrder !== order.orderId) || orderStatus(order.carInfoList)}">
                            <input type="radio"  :value="order.orderId"  v-model="checkOrder" style="display: none">
                            <div>
                                <div class="title">
                                    <span>订单号: {{order.orderNo}}</span>
                                    <span>共 {{order.orderCarNum}} 辆</span>
                                </div>
                                <ul class="car-list">
                                    <li v-for="car in order.carInfoList" @click="carClick(order.orderId, car)"
                                        :class="{'disabled': carStatus(order.orderId, car)}">
                                        <input type="checkbox"  :value="car.carId" class="icon-checkbox" v-model="checklist"
                                               :id="'car'+ car.carId"
                                               :disabled="order.orderId | carStatus(car, checkOrder)">
                                        <label :for="'car'+ car.carId">
                                            <list-car-info :data="car"></list-car-info>
                                        </label>
                                        <span class="status">{{car.stockStatusStr}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </som-scroll-refresh>
                <no-data v-else-if="searchFlag">未搜索到结果</no-data>
            </div>
            <fixed-bottom v-if="orderCarList.length > 0">
                <som-button :gradients="['#3684FF', '#3665FF']" @click="submit" :delayTime="2000">确定</som-button>
            </fixed-bottom>
        </template>
        <overdue-modal v-model="show" :data="overdueResult"></overdue-modal>
        <!-- <som-modal
                v-model="show"
                title="订单逾期通知">
            <div class="modal-content">
                <p>截止今日您的逾期订单待还款金额：</p>
                <p>待还本金: {{overdueResult.toRepayPrinAmt | reverseYuan}} 元</p>
                <p>待还利息: {{overdueResult.toRepayIntAmt | reverseYuan}} 元</p>
                <p>待还总额: <span class="imp">{{overdueResult.toRepayAmt | reverseYuan}} 元</span></p>
                <p>请将逾期的金额充值到您的企业支付宝中，等待资方扣除结清后，您就能还款其他正常订单的车辆</p>
            </div>
            <div slot="footer" @click="show = false" class="sure-btn">我知道了</div>
        </som-modal> -->
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
    name: 'repaymentList',
    data () {
        return {
            fuzzyQueryParam: '',
            page: {
                current: 0,
                pageSize: 20
            },
            results: {},
            orderCarList: [],
            oldOrderCarList: [],
            searchFocus: false,
            checklist: [],
            searchFlag: false, // 是否搜索过
            loading: true,
            show: false,
            overdueResult: {},
            capitalAscription: '' // 资方类型
        };
    },
    components: {
        ListCarInfo,
        FixedBottom,
        NoData,
        OverdueModal
    },
    computed: {
        checkOrder: function () {
            for (let i = 0, len = this.oldOrderCarList.length; i < len; i ++) {
                let currentValue = this.oldOrderCarList[i];
                let isInclude = currentValue.carInfoList.find((value) => {
                    return this.checklist.includes(value.carId);
                });
                if (isInclude) {
                    this.capitalAscription = currentValue.capitalAscription;
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
        }
    },
    filters: {
        carStatus: (orderId, car, checkOrder) => {
            return (checkOrder !== '' && checkOrder !== orderId) ||
            (car.stockStatus !== 20 && car.stockStatus !== 30);
        }
    },
    methods: {
        carStatus (orderId, car) {
            return (this.checkOrder !== '' && this.checkOrder !== orderId) ||
            (car.stockStatus !== 20 && car.stockStatus !== 30);
        },
        orderStatus (carInfoList) {
            let num = 0;
            for (let value of carInfoList.values()) {
                if (value.stockStatus !== 20 && value.stockStatus !== 30) {
                    // eslint-disable-next-line
                    num += 1;
                }
            }
            return carInfoList.length === num;
        },
        addRepayment () {
            this.$som.loading.show({
                text: '提交中'
            });
            let data = JSON.stringify({
                orderId: this.checkOrder,
                carIds: this.checklist
            });
            Api.fsc.v1_repaymentApi_addNewRepayment({data: data}).then((res) => {
                this.$router.push({
                    name: 'repaymentDetail',
                    query: {
                        orderId: this.checkOrder,
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
            if (this.capitalAscription === 10) { // 如果选择的是网商订单，需要先判断是否存在网商逾期订单
                Api.fsc.v1_repaymentApi_consultInventoryOutInfo({orderId: this.checkOrder}).then((res) => {
                    if (res.argStatus === 'NORMAL') { // 不存在逾期
                        this.addRepayment();
                    } else if (res.argStatus === 'OVD') { // 存在逾期
                        this.overdueResult = res;
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
            this.page.current = 0;
            this.orderCarList = [];
            this.searchFlag = true;
            this.getData();
        },
        searchCancel () {
            this.fuzzyQueryParam = '';
            this.search();
            this.searchFlag = false;
        },
        carClick (orderId, car) {
            if (this.checkOrder !== '' && this.checkOrder !== orderId) {
                return this.$som.toast.text('请选择同一订单的车辆');
            }
            if (car.stockStatus === 10) {
                return this.$som.toast.text('待起运的车辆不可还款');
            }
        },
        getData (e) {
            this.page.current ++;
            if (this.results.totalPage !== 0 && this.results.totalPage < this.page.current) {
                e && e.completed();
                return;
            }
            this.loading = true;
            Api.fsc.v1_carApi_getAllCarToRepayForAllOrders({
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


.pg-repayment-list{
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
