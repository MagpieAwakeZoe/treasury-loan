<template>
    <div class="co-my-order" v-if="data.length > 0">
        <div class="order-item" v-for="(item, index) in data" @click="toDetailPage(item)" :key="item.orderNo + index">
            <div class="item-top">
                <span class="date">{{item.dateCreate.split(' ')[0]}}</span>
                <span class="order-number">订单号：{{item.orderNo}}</span>
            </div>
            <div class="item-content">
                <section class="item-content-car" v-for="(car) in item.carInfo">
                    <h3>{{car.modelName}}</h3>
                    <h3 class="float-right">{{car.quantity}}辆</h3>
                </section>
                <p>融资金额:
                    <i v-if="item.orderVoStatus < 60 || item.orderVoStatus >= 998">--</i>
                    <i v-else class="red">{{item.actualMoneyAmount | reverseYuan}}元</i>
                </p>
                <p>仓库名称: {{item.warehouseName}}</p>
                <img src="~@/assets/images/delayed-icon.png" width="50" v-if="item.isOverdue"/>
            </div>
            <div class="item-bottom">
                <span :class="{'is-grey': item.orderVoStatus >= 998}">{{item.orderStatusDesc}}</span>
                <my-button :text="getBtnText(item)"
                           @click.native.stop="clickBlueBtn(item)"
                           v-if="getBtnText(item) && item.orderVoStatus !== 160"></my-button>
                <!--首页不可发起提车 item.orderVoStatus===160时只有提车按钮，直接隐藏-->
                <my-button :text="leftBtnText" :isGrey="true"
                           @click.native.stop="goPage('/logistics-detail', item)"
                           v-if="leftBtnText"></my-button>
            </div>
            <overdue-modal v-model="overdueShow" :data="myBankOverdueData"></overdue-modal>
        </div>
        <som-modal v-model="confirmCarShow"
                   title="请确定车辆状况无误"
                   is-confirm
                   cancel-text="返回"
                   @on-confirm="confirmCar(item)">
        </som-modal>
        <som-modal v-model="confirmContractShow"
                   title="请确认已签署借款合同"
                   content="若过程中遇到问题，请联系客服"
                   confirm-text="我知道了"
                   @on-confirm="confirmContract">
        </som-modal>
    </div>
</template>

<script>
    import myButton from '@/components/order/my-button';
    import Api from '@/api';
    import overdueModal from '@/components/order/overdue-modal.vue';
    import map from '@/components/order-detail/status-map';

    export default {
        name: 'my-order',
        components: {myButton, overdueModal},
        computed: {
            leftBtnText (item) {
                const statusMap = map[item.orderVoStatus] || {};
                if (120 === item.orderVoStatus) {
                    // 只有查看物流的时候有灰色按钮
                    return statusMap.leftBtnText;
                } else {
                    return '';
                }
            }
        },
        props: {
            data: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                confirmContractShow: false,
                overdueShow: false,
                myBankOverdueData: {},
                confirmCarShow: false,
                map,
                currCar: {}
            };
        },
        methods: {
            confirmContract() {
                location.reload();
            },
            getBtnText (item) {
                if (map[item.orderVoStatus]) {
                    if ([120, 125, 130, 140].indexOf(item.orderVoStatus) > -1) {
                        if (item.unRepayCarNum === 0) {
                            // 无可还款车辆
                            return '';
                        }
                    }
                    return map[item.orderVoStatus].btnText;
                }
                return '';
            },
            toDetailPage(item) {
                this.$router.push({path: `/order-detail/${item.orderId}`});
            },
            goPage (path, item) {
                this.$router.push({path, query: {orderId: item.orderId}});
            },
            clickBlueBtn(item) {
                this.currCar = item;
                switch (item.orderVoStatus) {
                    case 10:  // 申请已提交，待审核
                    case 20:  // 信息审核不通过，请修改申请
                    case 998: // 重新下单
                    case 999: // 重新下单
                        this.goPage('/start-order', item);
                        break;
                    case 40:
                        this.$emit('showConfirmCarModal', item.orderId);
                        break;
                    case 60:
                    case 70:
                    case 90:
                    case 91:
                        this.toDetailPage(item);
                        break;
                    case 120:
                    case 125:
                    case 130:
                        // 还款申请
                        this.goPage('/order-repayment-list', item);
                        break;
                    case 140:
                        if (item.isMyBank) {
                            // 网商资金
                            Api.fsc.v1_repaymentApi_consultInventoryOutInfo({
                                orderId: item.orderId
                            }).then((res) => {
                                this.myBankOverdueData = res;
                            });
                            this.overdueShow = true;
                        } else {
                            // 还款申请
                            this.goPage('/order-repayment-list', item);
                        }
                        break;
                }
            },
            /*operateOrder (item) {
                // 确认订单
                Api.fsc.v1_orderApi_operateOrder({
                    orderId: item.orderId,
                    operateType: 3 // 1.取消 2.删除 3.确认 4.驳回
                }).then((res) => {

                });
            }*/
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .co-my-order{
        margin-bottom: 12px;
        color: #666;
        font-size: 14px;
        background-color: #F2F2F2;
        .float-right{
            float: right;
        }
        .red {
            color: @primary;
            font-weight: bold;
        }
        .order-item{
            margin-bottom: 12px;
            padding-left: 16px;
            background-color: #fff;
            .item-top {
                padding-right: 16px;
                .border-bottom(#DCDCDC);
                span{
                    line-height: 46px;
                    &.order-number{
                        float: right;
                    }
                }
            }
            .item-content {
                line-height: 1;
                padding: 11px 16px 11px 0;
                .border-bottom(#DCDCDC);
                h3 {
                    color: #1a1a1a;
                    font-size: 16px;
                    display: inline-block;
                    font-size: 16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                    max-width: 80vw;
                    &:last-of-type {
                        float: right;
                    }
                    padding: 5px 0;
                }
                p {
                    padding: 5px 0;
                }
                img {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
                i {
                    font-size: 14px;
                    font-style: normal;
                }
                .item-content-car {
                    margin: 0;
                    padding: 0
                }
            }
            .item-bottom {
                font-size: 0;
                span {
                    color: @primary;
                    line-height: 50px;
                    max-width: ~"calc(100vw - 16px - 112px)";
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                    display: inline-block;
                    &.is-grey {
                        color: #999;
                    }
                }
                .co-my-button {
                    padding: 12px 16px;
                    float: right;
                    font-size: 13px;
                    button.clickClass {
                        min-width: 80px;
                        &.button-grey {
                            margin-right: -25px;
                        }
                    }
                }
            }
        }
        .som-dialog {
            .som-modal__button {
                color: @blue;
            }
            .som-modal__bd {
                text-align: center;
            }
        }
    }
</style>
