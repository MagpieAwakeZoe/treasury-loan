<template>
    <div :class="[{'isAlipay': isAlipay}, 'pg-add-car-vin']">
        <title-bar :isLeftEventDefault="false" @leftBarEvent="leftBarEvent">
            填写车架号
        </title-bar>
        <div class="content">
            <div class="car-vin-card" v-for="(item, index) in carList">
                <div class="car-decorate" v-for="(deco, i) in item.decorateList">
                    <div class="vin-header">
                        <h3 v-if="i === 0">{{item.modelName}}</h3>
                        <p v-if="i === 0">指导价：{{item.guidePrice | reverseWan}} 万</p>
                        <p>{{deco.appearanceColor}}/{{deco.interiorColor}}&nbsp;&nbsp;
                            <span :style="{color: deco.vinCount > deco.quantity ? '#FF571A' : ''}">已填写 {{deco.vinCount || 0}} 辆</span>/共 {{deco.quantity || 0}} 辆
                        </p>
                    </div>
                    <div class="vin-content">
                        <div class="content-editable" contenteditable="true">{{deco.vins}}</div>
                        <textarea placeholder="请输入或粘贴车辆的完整车架号"
                                  :class="{'warn': deco.warn}"
                                  @change="changeVin(deco)"
                                  v-model="deco.vins">
                        </textarea>
                    </div>
                    <p class='vin-clear' @click="clearVin(deco)">清空</p>
                </div>
            </div>
            <my-button text="提交" :isFixed="true" @click="submit"></my-button>
        </div>
        <som-modal v-model="showModal"
                   title="确定清空车架号？"
                   is-confirm
                   @on-cancel="showModal = false"
                   @on-confirm="onConfirm">
        </som-modal>
        <som-modal v-model="showModalLeave"
                   title="车架号未填完整，确定保存？"
                   is-confirm
                   @on-cancel="showModalLeave = false"
                   @on-confirm="addOrder">
        </som-modal>
    </div>
</template>

<script>
    import myButton from '@/components/order/my-button';
    import formItemTitle from '@/components/order/form-item-title';
    import formItemContent from '@/components/order/form-item-content';
    import carDecorate from '@/components/order/car-decorate';
    import { ModalPlugin } from 'som-ui';
    import Api from '@/api';
    import Helper from '@/utils/helper';
    import MathUtils from '@souche-f2e/souche-util/lib/math';

    export default {
        components: {myButton, formItemTitle, formItemContent, carDecorate, ModalPlugin},
        data () {
            return {
                carList: [],
                detail: {},
                showModal: false,
                showModalLeave: false,
                currentDeco: {},
                totalCarCount: 0,
                isAlipay: Helper.isAlipay()
            };
        },
        computed: {
            userData: function () {
                return this.$store.state.userData;
            },
            channel: function () {
                return this.$store.state.channel;
            }
        },
        mounted() {
            this.$setBodyBack('#f2f2f2');
            this.carList = JSON.parse(localStorage.getItem('treasury-loan-car-list'));
            this.detail = JSON.parse(localStorage.getItem('treasury-loan-detail'));
            this.detail.orderDetailCarInfo = this.carList;
            this.carList.forEach((car) => {
                car.decorateList.forEach((deco) => {
                    if (Array.isArray(deco.vins)) {
                        deco.vins = deco.vins.filter(item => item);
                        deco.vinCount = deco.vins.length;
                        deco.vins = deco.vins.join('\r\n');
                    }
                });
            });
        },
        methods: {
            formatDetail() {
                for (let key in this.detail) {
                    if (typeof this.detail[key] === 'string') {
                        this.detail[key] = this.detail[key].replace(/\s/ig, '');
                    }
                }
                const detail = JSON.parse(JSON.stringify(this.detail)); // deep copy
                detail.dealerMobile = this.userData.userPhone;
                detail.dealerId = this.userData.dealerId; // 168渠道需要传
                detail.orderDetailCarInfo.forEach((car, index, arr) => {
                    arr[index].decorateList.forEach((deco, i, list) => {
                        list[i].totalDeposit = MathUtils.compute(list[i].totalDeposit, '*', 100);
                        list[i].contractPrice = MathUtils.compute(list[i].contractPrice, '*', 100);
                        list[i].vins = list[i].vinArr;
                        delete list[i].vinArr;
                        delete list[i].vinCount;
                        delete list[i].warn;
                    });
                });
                detail.channelIdentifier = this.channel;
                detail.carType = this.$store.state.carType; // 1 中规 2平行  接车贷定死是1
                return detail;
            },
            onConfirm() {
                this.currentDeco.vins = '';
                this.currentDeco.vinCount = 0;
                this.showModal = false;
            },
            leftBarEvent() {
                localStorage.setItem('treasury-loan-car-list', JSON.stringify(this.carList));
                localStorage.setItem('treasury-loan-detail', JSON.stringify(this.detail));
                this.$router.go(-1);
            },
            toDetail(orderId) {
                localStorage.removeItem('treasury-loan-car-list');
                localStorage.removeItem('treasury-loan-detail');
                localStorage.removeItem('treasury-loan-account');
                this.$router.replace({
                    path: `/order-detail/${orderId}`,
                    query: {
                        go: -2 // 使订单详情的回退是2步
                    }
                });
            },
            validLength(allVin) {
                this.totalCarCount = 0; // 初始化，避免叠加
                return this.carList.every((car, carIndex) => car.decorateList.every((deco, decoIndex) => {
                    deco.vinArr = (deco.vins && deco.vins.split(/\r*\n/)) || [];
                    deco.vinArr = deco.vinArr && deco.vinArr.filter(item => item.length > 0);  // 清除空字符串
                    this.totalCarCount += +deco.quantity;
                    deco.warn = false;
                    this.$forceUpdate();
                    return deco.vinArr.every((vin) => {
                        if ((vin.length && vin.length !== 17) || deco.vinArr.length > deco.quantity) {
                            deco.warn = true;
                            this.$forceUpdate();
                            return false;
                        }
                        allVin.push({vin, carIndex, decoIndex});
                        return true;
                    });
                }));
            },
            validDuplicated(allVin) {
                let res = true;
                const temp = [];
                allVin.sort((a, b) => a.vin > b.vin).sort((pre, next) => {
                    // 排序过以后相邻相同的是重复项
                    if (pre.vin === next.vin && pre.vin) {
                        temp.push(pre);
                        temp.push(next);
                    }
                    return 0;
                });
                if (temp.length) {
                    res = false;
                    temp.forEach((item) => {
                        const car = this.carList[item.carIndex];
                        car.decorateList[item.decoIndex].warn = true;
                        this.$forceUpdate();
                    });
                }
                return res;
            },
            validIntegrated(allVin) {
                return allVin.length === this.totalCarCount;
            },
            validate() {
                const allVin = [];
                if (!this.validLength(allVin)) {
                    this.$som.toast.text('部分车架号有误，请修改');
                    return false;
                }
                if (!this.validDuplicated(allVin)) {
                    this.$som.toast.text('车架号重复，请修改');
                    return false;
                }
                if (!this.validIntegrated(allVin)) {
                    this.showModalLeave = true;
                    return false;
                }
                return true;
            },
            clearVin(deco) {
                if (deco.vins) {
                    this.showModal = true;
                    this.currentDeco = deco;
                    deco.warn = false;
                    this.$forceUpdate();
                }
            },
            changeVin(deco) {
                deco.vins = deco.vins.replace(/[^a-z0-9]+/gi, '').toUpperCase();
                let textArr = deco.vins.split(/\r*\n/).filter(item => item.length > 0);
                textArr.forEach((vin, index) => {
                    if (vin.length > 17) {
                        textArr[index] = vin.replace(/(.{17})/g, '$1\r\n');
                    }
                });
                deco.vins = textArr.join('\r\n');
                deco.vinCount = deco.vins.split(/\r*\n/).filter(item => item.length > 0).length;
            },
            addOrder () {
                const detail = this.formatDetail();
                const isClosed = detail.orderVoStatus && (detail.orderVoStatus === 999 || detail.orderVoStatus === 998);
                if (this.$route.query.orderId && !isClosed) {
                    const bodyData = {...detail, orderId: this.$route.query.orderId};
                    Api.fsc.v1_orderApi_modifyOrder({
                        data: JSON.stringify(bodyData)
                    }).then(() => {
                        this.toDetail(this.$route.query.orderId);
                    });
                } else {
                    const bodyData = {...detail};
                    delete bodyData.orderCode;
                    delete bodyData.orderId;
                    delete bodyData.orderNo;
                    delete bodyData.orderStatusDesc;
                    delete bodyData.orderVoStatus;
                    Api.fsc.v1_orderApi_addNewOrder({
                        data: JSON.stringify(bodyData) // 提交大量数据的用json格式
                    }).then((res) => {
                        res.orderId && this.toDetail(res.orderId);
                    });
                }
            },
            submit() {
                if (this.validate()) {
                    this.addOrder();
                }
            }
        }
    };
</script>

<style lang="less">

    .pg-add-car-vin {
        bottom: 84px;
        position: relative;
        top: 0;
        margin-bottom: 70px;
        .car-vin-card {
            background-color: #fff;
            margin-bottom: 12px;
            .car-decorate {
                .vin-header {
                    .border-bottom();
                    .border-top();
                    margin-left: 16px;
                    padding: 16px 0;
                    line-height: 1;
                    h3 {
                        margin: 0;
                        font-weight: 500;
                        font-size: 16px;
                        color: #1A1A1A;
                        line-height: 1.3;
                    }
                    p {
                        padding-top: 10px;
                        color: #666;
                        font-size: 14px;
                        &:first-child {
                            padding: 0;
                        }
                    }
                }
                .vin-content {
                    position: relative;
                    display: block;
                    width: 100%;
                    padding: 0;
                    .content-editable {
                        position: relative;
                        z-index: -1;
                        padding: 20px;
                        opacity: 0;
                        display: block;
                        width: 100%;
                        line-height: 1.5;
                        font-size: 16px;
                        text-align: left;
                        overflow: hidden;
                        word-break: break-all;
                        min-height: 90px;
                        box-sizing: border-box;
                        white-space: pre;  // 保留换行和空白
                    }
                    textarea {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        font-size: 16px;
                        padding: 16px;
                        line-height: 1.5;
                        resize: none;
                        overflow: hidden;
                        background-color: transparent;
                        border: none;
                        transition: height .5s ease;
                        word-break: break-all;
                        /*&::-webkit-input-placeholder {*/
                            /*color: #ccc !important;*/
                        /*}*/
                        /*&::-moz-input-placeholder {*/
                            /*color: #ccc !important;*/
                        /*}*/
                        /*&::-ms-input-placeholder {*/
                            /*color: #ccc !important;*/
                        /*}*/
                        &:focus {
                            outline: none;
                        }
                        &.warn {
                            margin-top: -1px;
                            border: 1px solid @primary;
                        }
                    }
                }
                p.vin-clear {
                    color: @blue;
                    font-size: 16px;
                    text-align: right;
                    padding-bottom: 16px;
                    width: 50px;
                    margin-left: calc(~'100vw - 50px - 16px');
                }
            }
        }
    }
</style>
