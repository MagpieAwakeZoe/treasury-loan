<template>
    <div class="pg-order-pickup-list">
        <title-bar>提车申请</title-bar>
        <no-data v-if="carList.length === 0 && !loading">暂无可提车辆</no-data>
        <template v-else>
            <div class="search-result">
                <div class="order" :class="{'disabled': orderStatus(carList)}" v-if="carList.length">
                        <div>
                            <div class="title">
                                <span>订单号: {{results.orderNo}}</span>
                                <span>共 {{carList.length}} 辆</span>
                            </div>
                            <ul class="car-list">
                                <li v-for="car in carList" @click="carClick(car)"
                                    :class="{'disabled': carStatus(car)}">
                                    <input type="checkbox"  :value="car.carId+','+car.carIdHessian" class="icon-checkbox" v-model="checklist"
                                           :id="'car'+ car.carId"
                                           :disabled="carStatus(car)">
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
            <fixed-bottom v-if="carList.length > 0">
                <som-button :gradients="['#3684FF', '#3665FF']" @click.native="submit">确定</som-button>
            </fixed-bottom>
        </template>
    </div>
</template>

<script>
import Api from '@/api';
import ListCarInfo from '@/components/list-car-info.vue';
import FixedBottom from '@/components/fixed-bottom.vue';
import NoData from '@/components/no-data.vue';
/*
    stockStatus:
    10, "待起运",
    20, "待入库",
    30, "待出库",
    40, "已出库",
    50, "已交车";
*/

export default {
    name: 'orderPickupList',
    data () {
        return {
            results: [],
            carList: [],
            checklist: [],
            loading: true
        };
    },
    components: {
        ListCarInfo,
        FixedBottom,
        NoData
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
            return car.stockStatus !== 30 || car.alyPayDeposit;
        }
    },
    methods: {
        carStatus (car) {
            return car.stockStatus !== 30 || car.alyPayDeposit;
        },
        orderStatus (carList) {
            let num = 0;
            for (let value of carList.values()) {
                if (value.stockStatus !== 30 || value.alyPayDeposit) {
                    // eslint-disable-next-line
                    num += 1;
                }
            }
            return carList.length === num;
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
                    orderId: this.$route.query.orderId,
                    carIds: carIds
                }
            });
        },
        carClick (car) {
            if (car.stockStatus !== 30) {
                return this.$som.toast.text('未入库的车辆不可提车');
            }
            if (car.alyPayDeposit) {
                return this.$som.toast.text('车辆交易中，不可提车');
            }
        },
        getData () {
            this.loading = true;
            Api.fsc.v1_carApi_getAllCarToPick({
                orderId: this.$route.query.orderId
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


.pg-order-pickup-list{
    .search-result{
        margin-bottom: 62px;
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
</style>
