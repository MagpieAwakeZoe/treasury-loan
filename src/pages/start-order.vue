<template>
    <div :class="[{'isAlipay': isAlipay}, 'pg-start-order']">
        <title-bar :isLeftEventDefault="false" @leftBarEvent="leftBarEvent">
            {{title}}
            <div slot="right" style="font-size: 0">
                <img src="https://img.souche.com/f2e/297fbe0b57ce6847fbbdc10059d921ec.png"
                     @click="goInstruction"
                     class="icon">
            </div>
        </title-bar>
        <div class="content">
            <steps :currentStep="currentStep" :titleArr="titleArr" :totalSteps="totalSteps"></steps>
            <warn class="mb-12" :subText="'说明：申请库融贷的车辆，生产日期需为距当前日期的一年以内'"></warn>
            <div class="bg-white">
                <form-item-title :text="'车辆信息'"></form-item-title>
                <form-item-content :text="'添加车辆'" @clickItem="addCar" class="add-car-title"></form-item-content>
                <car-card :carList="detail.orderDetailCarInfo"></car-card>
            </div>

            <div class="bg-white">
                <form-item-title :text="'仓库信息'"></form-item-title>
                <form-item-content :text="'选择仓库'"
                                   @clickItem="addArea(2)"
                                   :mainContent="detail.warehouseName"
                                   :subContent="detail.warehouseAddress"></form-item-content>
            </div>

            <div class="bg-white">
                <form-item-title :text="'账户信息'"></form-item-title>
                <form-item-content :text="'收款账户'" class="supplier-content"
                                   :mainContent="detail.dealerBankAccountNumber"
                                   :subContent="detail.dealerAccountName"
                                   :thirdContent="detail.dealerBankName"
                                   :placeholder="'请选择'"
                                   @clickItem="getAccount">
                </form-item-content>
            </div>

            <form-item-title :text="''">
                <p slot="title">上传资料及附件 <b>（采购合同、车辆清单）</b></p>
            </form-item-title>
            <som-image-upload :imgList.sync="detail.attachmentList[0].attachmentContent"
                              :max="100"
                              :action="action"
                              :height="imgWH.height" :width="imgWH.width"
                              :lazy="false"
                              :deletable="true"></som-image-upload>
            <my-button :isFixed="true" :text="'下一步'" @click="nextStep"></my-button>
        </div>

        <som-modal v-model="modalShow"
                   title="信息将被清空"
                   is-confirm
                   cancel-text="返回"
                   :closeOnConfirm="false"
                   @on-confirm="backIndex">
        </som-modal>

        <area-selector :type="areaType"
                       v-model="showArea"
                       @selected="selectedArea"></area-selector>
    </div>
</template>

<script>
    import myButton from '@/components/order/my-button';
    import steps from '@/components/order/steps';
    import warn from '@/components/order/warn';
    import formItemTitle from '@/components/order/form-item-title';
    import formItemContent from '@/components/order/form-item-content';
    import carCard from '@/components/order/car-card';
    import Api from '@/api';
    import AreaSelector from '@/components/selector/area-selector';
    import SomImageUpload from '@souche-ui/som-image-upload';
    import Helper from '@/utils/helper';

    const detailModel = {
        dealerMobile: '',
        paymentNotes: '',
        departureAddress: '', // 始发地详细地址
        orderDetailCarInfo: [{
            brandCode: '',
            brandName: '',
            seriesCode: '',
            seriesName: '',
            modelCode: '',
            modelName: '',
            guidePrice: '', // 指导价
            decorateList: [{
                warn: false, // 是否正在显示数量标红
                vinCount: 0, // 当前填写的vin个数
                vinArr: [], // vin的数组形式
                vin: '', //  字符串 提交时转成数组
                vins: [], //  vin提交时的字段名
                quantity: '', // 车辆数量
                interiorColorCode: '', //内饰颜色编码
                interiorColor: '', // 内饰颜色
                appearanceColorCode: '', // 外观颜色编码
                appearanceColor: '', //外观颜色
                contractPrice: '', // 合同单价
                totalDeposit: '' // 已支付定金总额
            }],
        }],
        hasInvoice: false, // 是否开增值税发票 true:开 false:不开
        departureProvinceCode: '', // 始发地省编码
        departureProvinceName: '', // 始发地省名称
        departureCityCode: '', // 始发地市编码
        departureCityName: '', // 始发地市名称
        destinationProvinceCode: '', // 目的地省编码
        destinationProvinceName: '', // 目的地省名称
        destinationCityCode: '', // 目的地市编码
        destinationCityName: '', // 目的地市名称
        warehouseConfigId: '', // 仓库配置 id
        warehouseName: '', // 仓库名称
        warehouseAddress: '', // 仓库地址
        storageCode: '', // 仓库服务的Code
        CNAPSCode: '', // 开户行联行号
        attachmentList: [{
            attachmentType: 1, // 附件类型 1:订单附件 2:保证金 支付凭证
            attachmentContent: [] // 附件 URL 地址 []
        }],
        dealerBankName: '', //库融贷车商开户行名称
        dealerAccountName: '', //库融贷车商户名
        dealerCNAPSCode: '', //库融贷车商联行号
        dealerBankAccountNumber: '', //库融贷车商银行账号
        dealerHeadCNAPSCode: '', // 经销商总行联行号
        dealerBankType: 0, //库融贷车商账号类型 0对公 1对私
        businessMode: 2, // 1接车 2 库容
        carType: 1 // 1 中规 2平行  接车贷定死是1
    };
    let routerFrom = {}; // 路由来源


    export default {
        components: {SomImageUpload, warn, AreaSelector, myButton, steps, formItemTitle, formItemContent, carCard},
        data () {
            return {
                orderId: '',
                title: '',
                areaType: 1, // 1始发地 2目的地
                showArea: false,
                currentStep: 1,
                titleArr: ['提交申请', '入库验车', '合同签署', '资方放款', '还款提车'],
                totalSteps: 5,
                modalShow: false,
                detail: JSON.parse(JSON.stringify(detailModel)),
                imgWH: {},
                isAlipay: Helper.isAlipay(),
                action: [{
                    action: 'quality',
                    q: 75
                }, {
                    action: 'auto-orient',
                    value: 0
                }]
            };
        },
        computed: {
            userData () {
                return this.$store.state.userData;
            },
            accessInfo () {
                return this.$store.state.accessInfo;
            }
        },
        mounted() {
            this.title = '库融贷申请';
            this.imgWH = Helper.setUploadImageWH(document.getElementsByClassName('som-image-upload')[0].clientWidth - 18);
            const car = JSON.parse(localStorage.getItem('treasury-loan-car-list'));
            const carDetail = JSON.parse(localStorage.getItem('treasury-loan-detail'));
            const account = JSON.parse(localStorage.getItem('treasury-loan-account'));
            account && (account.dealerBankAccountNumber = account.dealerBankAccountNumber.replace(/\s/ig, '').replace(/(\d{4})/g, '$1 '));
            this.orderId = this.$route.query.orderId || '';
            if (this.orderId) {
                if (carDetail && +this.orderId === +carDetail.orderId && routerFrom.path !== '/index') {
                    // 读取修改过的订单数据
                    this.detail = {...carDetail, ...account};
                    if (car) this.detail.orderDetailCarInfo = car;
                    this.getIsChangeOrder();
                } else {
                    this.getOrderDetail(this.getIsChangeOrder);
                }
            } else {
                if (carDetail) this.detail = {...carDetail, ...account};
                if (car) this.detail.orderDetailCarInfo = car;
            }
        },
        beforeRouteEnter(to, from, next) {
            routerFrom = from;
            next();
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'index' || to.name === 'orderDetail') {
                if (JSON.stringify(this.detail) !== JSON.stringify(detailModel) && !this.modalShow) {
                    this.modalShow = true;
                    next(false);
                } else {
                    if (process.env.NODE_ENV !== 'development') {
                        localStorage.removeItem('treasury-loan-car-list');
                        localStorage.removeItem('treasury-loan-account');
                        localStorage.removeItem('treasury-loan-detail');
                    }
                    next();
                }
            } else {
                next();
            }
        },
        methods: {
            getIsChangeOrder() {
                const isClosed = this.detail.orderVoStatus && (this.detail.orderVoStatus === 999 || this.detail.orderVoStatus === 998);
                if (!isClosed) {
                    this.title = '修改订单';
                }
            },
            getAccount () {
                localStorage.setItem('treasury-loan-car-list', JSON.stringify(this.detail.orderDetailCarInfo));
                localStorage.setItem('treasury-loan-detail', JSON.stringify(this.detail));
                this.$router.push({path: '/select-payment-account', query: {orderId: this.orderId}});
            },
            goInstruction() {
                localStorage.setItem('treasury-loan-car-list', JSON.stringify(this.detail.orderDetailCarInfo));
                localStorage.setItem('treasury-loan-detail', JSON.stringify(this.detail));
                this.$router.push({path: '/instructions'});
            },
            leftBarEvent() {
                this.backIndex();
            },
            getOrderDetail(cb) {
                Api.fsc.v1_orderApi_getOrderByOrderId({
                    orderId: this.orderId
                }).then((res) => {
                    this.detail = Object.assign({}, this.detail, res);
                    this.detail.orderDetailCarInfo.forEach((car, index, arr) => {
                        arr[index].decorateList.forEach((deco, i, list) => {
                            list[i].totalDeposit /= 100;
                            list[i].contractPrice /= 100;
                        });
                    });
                    cb && cb();
                });
            },
            addArea(type) {
                this.areaType = type;
                this.showArea = true;
            },
            selectedArea(res) {
                if (this.areaType === 2) {
                    this.detail = Object.assign({}, this.detail, {
                        destinationProvinceCode: res.locationProvinceCode, // 目的地省编码
                        destinationProvinceName: res.locationProvinceName, // 目的地省名称
                        destinationCityCode: res.cityCode, // 目的地市编码
                        destinationCityName: res.cityName, // 目的地市名称
                        warehouseName: res.warehouseName,
                        warehouseConfigId: res.warehouseConfigId,
                        warehouseAddress: res.warehouseAddress,
                        storageCode: res.code, // 仓库服务的Code
                    });

                }
            },
            backIndex() {
                //this.$router.push({path: '/index'});
                this.$router.go(-1);
            },
            addCar() {
                localStorage.setItem('treasury-loan-car-list', JSON.stringify(this.detail.orderDetailCarInfo));
                localStorage.setItem('treasury-loan-detail', JSON.stringify(this.detail));
                this.$router.push({path: '/add-car', query: {orderId: this.orderId}});
            },
            isValid () {
                const data = this.detail;
                let flag = true;
                const toast = (msg) => {
                    if (!flag) return;
                    this.$som.toast.text(msg);
                    flag = false;
                };
                if (data.orderDetailCarInfo.length > 0) {
                    const carList = data.orderDetailCarInfo;
                    if (carList[0].brandCode === '' || carList[0].modelCode === '') {
                        toast('请先添加车辆');
                    } else if (carList[0].decorateList.length > 0 && carList[0].decorateList[0].quantity === 0) {
                        toast('车辆数量不能为0');
                    }
                } else {
                    toast('请先添加车辆');
                }
                if (data.warehouseAddress === '' && data.warehouseName === '') toast('请选择仓库');
                if (data.dealerBankAccountNumber === '' && data.dealerBankName === '') toast('请选择车商收款账户');
                if (data.attachmentList[0] && data.attachmentList[0].attachmentContent.length === 0) toast('请先上传资料及附件');
                return flag;
            },
            nextStep () {
                if (this.isValid()) {
                    localStorage.setItem('treasury-loan-car-list', JSON.stringify(this.detail.orderDetailCarInfo));
                    localStorage.setItem('treasury-loan-detail', JSON.stringify(this.detail));
                    this.$router.push({path: '/add-car-vin', query: {orderId: this.orderId}});
                }
            }
        }
    };
</script>

<style lang="less">

    .pg-start-order {
        ::-webkit-scrollbar { display: none; }
        ::placeholder {
            color: #CCCCCC;
        }
        padding-bottom: 84px;
        .bg-white {
            background-color: #fff;
            div.co-form-item-content:last-child {
                .border-bottom(#fff);
            }
        }
        .co-form-item-content {
            &.add-car-title:after{
                background-color: #fff;
            }
            .border-bottom();
            margin-bottom: 1px;
            &:after {
                left: 16px;
            }
            &.supplier-content {
                div{
                    p {
                        flex: 0 0 100px;
                    }
                    section{
                        flex: 1;
                        display: inline-block;
                        input.supplier-input{
                            width: calc(~'100vw - 100px - 48px');
                        }
                    }
                }
                &.supplier-car-phone {
                    div {
                        p {
                            flex: 0 0 140px;
                        }
                        section input.supplier-input{
                            max-width: calc(~'100vw - 140px - 48px');
                        }
                    }
                }
                .textarea-wrapper {
                    position: relative;
                    display: block;
                    width: 100%;
                    padding: 0;
                    .content-editable {
                        position: relative;
                        z-index: -1;
                        opacity: 0;
                        display: block;
                        width: 100%;
                        line-height: normal;
                        font-size: 16px;
                        text-align: right;
                        overflow: hidden;
                        word-break: break-all;
                    }
                    textarea {
                        text-align: right;
                        font-size: 16px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        line-height: normal;
                        border: none;
                        resize: none;
                        padding: 0;
                        overflow:hidden;
                        word-break: break-all;
                        box-sizing: border-box;
                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
        }
        .supplier-input {
            font-size: 16px;
        }
        .supplier-content {
            input {
                vertical-align: middle;
                line-height: 18px;
                height: 18px;
            }
            .som-radio {
                float: right;
                .som-list-item__hd {
                    width: unset;
                }
                .som-list-item.som-radio__label.som-radio--button {
                    margin: -12px -32px;
                    margin-right: -16px;
                    padding-right: 0;
                }
                .som-list-item:before, .som-list:after {
                    content: none;
                }
            }
        }
        .co-form-item-title {
            b {
                font-weight: normal;
                font-size: 12px;
            }
        }
        .area-selector, .open-account-bank-selector, .branch-bank-selector {
            z-index: 10;
        }
        .co-my-button {
            z-index: 2;
        }
        .som-image-upload {
            padding: 16px;
            padding-right: 0;
            background-color: #fff;
            box-sizing: border-box;
            padding-bottom: 0;
        }
    }
</style>
