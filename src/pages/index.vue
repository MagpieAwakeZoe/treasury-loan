<template>
    <div class="pg-car-loan-index">
        <title-bar @leftBarEvent="closeWebView" :isLeftEventDefault="false">库融贷
            <div slot="right" style="font-size: 0">
                <img src="https://img.souche.com/f2e/1bc073300d67fd104a53aa9d7c8e95e4.png"
                     @click="goPage('/authorize')"
                     class="icon sub-right-icon">
                <img src="https://img.souche.com/f2e/297fbe0b57ce6847fbbdc10059d921ec.png"
                     @click="goPage('/instructions')"
                     class="icon">
            </div>
        </title-bar>
        <som-scroll-refresh  :show-back-top="true"
                             :pull-down="onReload"
                             :offset-h="15"
                             :pull-up="getOrderList">
            <div>
                <div class="order-top-bg">
                    <img class="order-top-bg-img" src="https://img.souche.com/f2e/737c2a69262c9917593fce48b25bf549.png">
                </div>
                <div class="order-top"
                     :style="{backgroundImage: showSecondFloor ? `url('https://img.souche.com/f2e/cc802f80694a7b8a75cd494ace3766ff.png')` : `url('https://img.souche.com/f2e/cc802f80694a7b8a75cd494ace3766ff.png')`}">
                    <div v-if="isHasBeenVerified" class="order-top-box-verified"
                         @click="showSecondFloor = !showSecondFloor">
                        <div class="first-floor">
                            <section>
                                <p>授信额度</p>
                                <p>{{creditInfo.totalCredit}}<span>万</span></p>
                            </section>
                            <section>
                                <p>可贷额度</p>
                                <p>{{creditInfo.totalRemainLoanAmount}}<span>万</span></p>
                            </section>
                            <section>
                                <p>在贷总额</p>
                                <p>{{creditInfo.totalCurrentLoanAmount}}<span>万</span></p>
                            </section>
                        </div>
                        <div class="second-floor" v-if="showSecondFloor">
                            <section>
                                <p>资金方</p>
                                <p>授信额度</p>
                                <p>可贷额度</p>
                                <p>在贷总额</p>
                            </section>
                            <section v-for="(item, $index) in creditInfo.capitalInfoList" :key="$index">
                                <p>{{item.capitalProvider}}</p>
                                <p>{{item.credit}}<span>万</span></p>
                                <p>{{item.remainLoanAmount}}<span>万</span></p>
                                <p>{{item.currentLoanAmount}}<span>万</span></p>
                            </section>
                        </div>
                    </div>
                    <div class="order-top-box-unverified" v-else @click="applyForCertificate">
                        <span>您还未进行业务准入认证</span>
                        <button>申请认证</button>
                    </div>
                </div>
                <div class="upstairs" v-if="isHasBeenVerified && creditInfo.capitalInfoList && creditInfo.capitalInfoList.length > 0" @click="showSecondFloor = !showSecondFloor">
                    <img src="https://img.souche.com/f2e/57379c9d5c197eefa63abbf2cba8f4bc.png"
                         :style="{transform: showSecondFloor ? '' : 'rotateZ(180deg)'}"
                         width="16">
                </div>
                <div class="order-button">
                    <section @click="goPage('/start-order')">
                        <img src="~@/assets/images/start-get-car.png" width="32">
                        <p>发起订单</p>
                    </section>
                    <section @click="goPage('/repayment-list')">
                        <img src="~@/assets/images/repay.png" width="32">
                        <p>还款</p>
                    </section>
                    <section @click="goPage('/pickup-list/allorder')">
                        <img src="~@/assets/images/get-car.png" width="32">
                        <p>提车</p>
                    </section>
                </div>
                <h3 class="order-title" v-if="isHasBeenVerified || orderList.length > 0">我的订单</h3>
                <div class="order-item">
                    <my-order :data="orderList"
                              @showConfirmCarModal="showConfirmCarModal"
                              v-if="orderList.length > 0"></my-order>
                    <div class="order-no-one" v-else-if="isHasBeenVerified && !orderList.length">
                        <no-data><span>暂无订单</span></no-data>
                    </div>
                    <div class="order-not-verified" v-else-if="!isHasBeenVerified">
                        <no-data><span>请先通过资质认证后再发起订单</span></no-data>
                    </div>
                </div>
            </div>
        </som-scroll-refresh>
        <som-modal v-model="showApplyModal"
                   title="申请认证"
                   cancel-text="返回"
                   confirm-text="联系客服"
                   content="您还未进行准入认证，请联系专属客服进行准入认证"
                   is-confirm
                   @on-cancel="showApplyModal=false"
                   @on-confirm="call">
        </som-modal>
        <som-modal v-model="showApplyModal2"
                   title="申请认证"
                   confirm-text="我知道了"
                   content="您还未完成准入认证，如需了解认证进度，请线下联系业务人员"
                   @on-confirm="showApplyModal2=false">
        </som-modal>
        <som-popup v-model="showAccessModal" :show-mask="true">
            <div class="access-popup">
                <div class="access-header">
                    <h1>请选择要做业务车辆类型<span @click="showAccessModal = false">&times;</span></h1>
                </div>
                <div class="access-body">
                    <section class="access-body-ZG" @click="chooseAccessModal(2, 1, isZGAccess)">
                        <img src="//img.souche.com/f2e/a0b5265cb344da1a825fae6b1f81fc4a.png"
                             :style="{filter: isZGAccess ? 'initial' : 'opacity(30%)'}"
                             width="117" height="73">
                        <p :class="{'is-grey': !isZGAccess}">中规车</p>
                        <p class="is-grey is-small" v-if="!isZGAccess">您暂时不能做此业务</p>
                    </section>
                    <section class="access-body-PX" @click="chooseAccessModal(3, 2, isPXAccess)">
                        <img src="//img.souche.com/f2e/f68af9ff410aea19a0ddf84e75c595d0.png"
                             :style="{filter: isPXAccess ? 'initial' : 'opacity(30%)'}"
                             width="117" height="73">
                        <p :class="{'is-grey': !isPXAccess}">平行进口车</p>
                        <p class="is-grey is-small" v-if="!isPXAccess">您暂时不能做此业务</p>
                    </section>
                </div>
            </div>
        </som-popup>
    </div>
</template>

<script>
    import noData from '@/components/no-data';
    import myOrder from '@/components/order/my-order';
    import Api from '@/api';
    import Tower from '@souche-f2e/tower';
    import CacheUtils from '@souche-f2e/souche-util/lib/cache';

    export default {
        components: {noData, myOrder},
        computed: {
            userData: function () {
                return this.$store.state.userData;
            },
            channel: function () {
                return this.$store.state.channel;
            },
        },
        data () {
            return {
                accessId: '',
                isPXAccess: false,
                isZGAccess: false,
                showAccessModal: false,
                isHasBeenVerified: false,
                showSecondFloor: false,
                shopCode: '',
                creditInfo: {
                    totalCredit: 0, // 万元
                    totalCurrentLoanAmount: 0, // 万元
                    totalRemainLoanAmount: 0, // 万元
                },
                pageSize: 20,
                nextIndex: 1,
                totalNumber: -1,
                orderList: [],
                showApplyModal: false,
                showApplyModal2: false
            };
        },
        mounted() {
            // 查看业务资质申请
            Api.fsc.v1_accessApplyApi_getAccessApplication({
                channelIdentifier: this.channel
            }).then((res) => {
                if (res && res.accessId && res.accessStatus === 40) {
                    this.isHasBeenVerified = true;
                    this.accessId = res.accessId;
                    this.getCreditInfo();
                }
            });
            // 查看经销商信息
            Api.fsc.v1_accessApplyApi_getAccessInfo().then((res) => {
                if (res && res.accessId) {
                    this.accessId = res.accessId;
                    CacheUtils.setCookie('SUPPLY_CHAIN_ACCESS_INFO', JSON.stringify(res));
                    this.$store.commit('setAccessInfo', res);
                }
            });
        },
        methods: {
            chooseAccessModal (type, carType, isAccess) {
                CacheUtils.setCookie('FINANCIAL_TYPE', type);
                CacheUtils.setCookie('CAR_TYPE', carType);
                this.$store.commit('setCarType', carType);
                isAccess && this.$router.push({path: '/start-order'});
            },
            closeWebView () {
                Tower.closeWebView();
            },
            showConfirmCarModal(orderId) {
                this.$router.push({path: '/inspection-sheet', query: {orderId}});
            },
            goPage (path) {
                if (!this.isHasBeenVerified && path !== '/instructions') {
                    this.applyForCertificate();
                    return false;
                }
                if (this.isHasBeenVerified && path === '/start-order') {
                    const accessId = this.accessId;
                    this.$som.loading.show({
                        text: '正在跳转...'
                    });
                    Api.fsc.v1_dealerAccessApi_getDealerBusinessAccess({accessId}).then((res) => {
                        if (res) {
                            this.$som.loading.hide();
                            this.showAccessModal = true;
                            this.isPXAccess = res.isPXAccess;
                            this.isZGAccess = res.isZGAccess;
                        }
                    });
                    return false;
                }
                this.$router.push({path});
            },
            getCreditInfo() {
                Api.fsc.v1_dealerAccessApi_getDealerCapitalAmountInfo().then((res) => {
                    this.creditInfo = res;
                });
            },
            onReload() {
                location.reload();
            },
            getOrderList(e) {
                if (this.totalNumber !== -1 && this.orderList.length >= this.totalNumber) {
                    e.completed();
                    return;
                }
                Api.fsc.v1_orderApi_getOrderList({
                    pageSize: this.pageSize,
                    current: this.nextIndex
                }).then((res) => {
                    e.loaded();
                    this.orderList = this.orderList.concat(res.items);
                    this.nextIndex = res.nextIndex;
                    this.totalNumber = res.totalNumber;
                });
            },
            applyForCertificate () {
                if (this.channel === 'zbzy' || this.channel === 'srp') {
                    this.showApplyModal2 = true;
                } else {
                    this.showApplyModal = true;
                }
            },
            call () {
                Api.fsc.unlogin_unloginApi_getCustomerServicePhone({
                    channelIdentifier: this.channel
                }).then((res) => {
                    window.location.href = `tel:${res}`;
                });
            }
        }
    };
</script>

<style lang="less">
    .pg-car-loan-index {
        background-color: #fff;
        .access-popup {
            height: 240px;
            background-color: #fff;
            .access-header {
                h1 {
                    font-size: 16px;
                    color: #1A1D33;
                    text-align: center;
                    margin: 0;
                    padding: 25px;
                    position: relative;
                    font-weight: normal;
                    span {
                        position: absolute;
                        right: 16px;
                        top: 16px;
                        font-size: 24px;
                        line-height: 12px;
                        color: #C4C5CC;
                    }
                }
            }
            .access-body {
                display: flex;
                padding: 19px 10px 0;
                section {
                    flex: 1;
                    text-align: center;
                    justify-content: space-around;
                    p {
                        font-size: 14px;
                        padding-top: 2px;
                        color: #1a1d33;
                        &.is-grey {
                            color: #999;
                        }
                        &.is-small {
                            padding-top: 0;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .order-top-bg {
            font-size: 0;
            img.order-top-bg-img {
                padding: 4px 5px;
                width: 100%;
                margin-bottom: -10px;
                box-sizing: border-box;
            }
        }
        .order-top {
            background: url("~@/assets/images/index-top-bg.png") no-repeat center;
            background-size: 100% 100%;
            width: calc(~'100% - 32px');
            min-height: 80px;
            margin: 0 16px;
            position: relative;
            color: #fff;
            transition: all .3s;
            border-radius: 4px;
            .order-top-box-verified {
                height: 100%;
                text-align: center;
                margin: 0 10px;
                .first-floor {
                    display: flex;
                    height: 80px;
                    align-items: center;
                    section {
                        flex: 1;
                        p:first-child {
                            font-weight: lighter;
                            font-size: 12px;
                        }
                        p:last-child {
                            font-size: 20px;
                            span {
                                font-size: 12px;
                            }
                        }
                    }
                }
                .second-floor {
                    border-top: 1px dashed rgba(256, 256, 256, 0.3);
                    padding: 16px 0;
                    section {
                        display: flex;
                        p {
                            line-height: 20px;
                            font-size: 12px;
                            flex: 1;
                        }
                    }
                }
            }
            .order-top-box-unverified {
                display: flex;
                align-items: center;
                height: 80px;
                justify-content: space-between;
                padding: 0 16px;
                button {
                    color: #fff;
                    border: 1px solid #fff;
                    background: none;
                    border-radius: 2px;
                    padding: 3px 7px;
                }
            }
        }
        .upstairs {
            background: url("//img.souche.com/f2e/bdc531bd64630e1f4b0aec4663aa795b.png") no-repeat center;
            background-size: 58px 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content:center;
            img {
                transition: all .3s;
            }
        }
        .order-button {
            display: flex;
            height: 84px;
            align-items: center;
            text-align: center;
            section {
                color: #333333;
                font-size: 12px;
                flex: 1;
            }
        }
        .order-title {
            font-size: 14px;
            color: #666;
            line-height: 38px;
            padding-left: 16px;
            margin: 0;
            background-color: #F2F2F2;
            font-weight: normal;
        }
        .order-item {
            .order-not-verified {
                height: calc(~'100vh - 170px');
            }
            .order-no-one {
                height: calc(~'100vh - 170px - 84px - 38px');
            }
        }
        .som-modal__bd {
            text-align: left;
        }
        .som-scroll-refresh {
            overflow-y: scroll;
            height: calc(~'100vh - 44px');
        }
    }
</style>
