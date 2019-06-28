<template>
    <div class="pg-order-detail">
        <title-bar>订单详情
            <div slot="right" style="font-size: 0">
                <img src="https://img.souche.com/f2e/297fbe0b57ce6847fbbdc10059d921ec.png"
                     @click="goPage('/instructions')"
                     class="icon">
            </div>
        </title-bar>
        <!--<div class="customer-service-tooltip" v-if="isShowTooltip" @click="closeTooltip">-->
            <!--<img src="//img.souche.com/f2e/47c3047fddc46d439c5ad0a9e8023647.png" width="114px"/>-->
        <!--</div>-->
        <som-scroll-refresh :pull-down="onRefresh"
                             ref="refreshEl">
            <div>
                <steps :currentStep="statusMap.steps" v-if="statusMap.steps" :titleArr="titleArr" :totalSteps="totalSteps"></steps>
                <warn class="mb-12" :text="detail.orderStatusDesc" :subText="detail.orderStatusRemark" :isShowDelay="!!detail.isOverdue"></warn>

                <detail-content class="order-repayment mb-12" :title="'最新还款记录'"
                                v-if="JSON.stringify(newRepayment) !== '{}'"
                                :subContent="[{linkContent: '查看还款/提车记录'}]"
                                @clickLink="goPage('/records/order-repayment')">
                    <div class="order-repayment-content">
                        <p>{{newRepayment.dateCreate}}</p>
                        <p class="car-num">{{newRepayment.carNum}} 辆</p>
                        <p>{{newRepayment.repaymentStatusDesc}}</p>
                        <p v-if="[160, 200, 170].indexOf(code) > -1">还款已结清</p>
                        <p v-if="code === 150" class="red">剩余车辆由平台处理</p>
                        <p v-else-if="newRepayment.unRepayCarNum" class="red">剩余{{newRepayment.unRepayCarNum}}辆待还款</p>
                    </div>
                </detail-content>

                <div class="repayment-list mb-12" v-if="Object.keys(unRepayData).length > 0">
                    <h4>待还款总额<span>（截止今日）</span></h4>
                    <section>
                        <p>
                            <span class="left">待还本金</span>
                            <span class="right">{{unRepayData.toRepayPrinAmt | reverseYuan}} 元</span>
                        </p>
                        <p>
                            <span class="left">待还利息/服务费（费率{{(unRepayData.rate * 100).toFixed(2)}}%）</span>
                            <span class="right">{{unRepayData.toRepayIntAmt | reverseYuan}} 元</span>
                        </p>
                    </section>
                    <section class="sub-repayment-list">
                        <p>
                            <span class="left">待还款总额</span>
                            <span class="right">{{unRepayData.toRepayTotal | reverseYuan}} 元</span>
                        </p>
                    </section>
                </div>

                <detail-content class="predict mb-12" :content="predict$$"
                                v-if="code < 60"
                                :isShowBorderBottom="false" :isBoldNum="true" :isRedNum="true"></detail-content>

                <div class="account-wrapper mb-12" v-if="code === 60 || code === 70 || code === 80">
                    <detail-content class="account" :title="'首付款收款账户'" :content="account$$" :isShowBorderBottom="false" :isBoldNum="true" :isRedNum="true"></detail-content>
                    <div class="account-copy">
                        <input type="text" id="textcopy1" class="hide-input"
                               :value="copyText1">
                        <input type="text" id="textcopy2" class="hide-input"
                               :value="copyText2">
                        <div @click="copy('.copy1')" class="copy1" data-clipboard-target="#textcopy1">复制全部</div>
                        <div @click="copy('.copy2')" class="copy2" data-clipboard-target="#textcopy2">复制账号</div>
                    </div>
                </div>
                <detail-content class="predict mb-12" :title="'融资信息'"
                                v-if="code >= 60 && !isClosed"
                                :content="borrow$$" :subContent="subBorrow$$"
                                :isShowBorderBottom="!!subBorrow$$[0].content"
                                @clickLink="seeActualMoneyImgs" :isBoldNum="true" :isRedNum="true"></detail-content>
                <!--合同签署状态：0 未签署；1 已签署,-->
                <!--合同类型 contractPartyType：0 第三方，1 搜车-->
                <detail-link v-for="(item, key) in contractList"
                             :key="item.contractName + key"
                             v-if="item && item.signStatus && item.contractPartyType && item.innerContractImgURLs.length >= 1"
                             :title="`${item.contractName}已签署`" :content="'查看合同'"
                             @click.native="seeBigImg(item.innerContractImgURLs, 0)" class="mb-12" ></detail-link>
                <detail-link :title="code === 40 ? '验车待确认' : '验车已确认'"
                             :content="code === 40 ? '查看验车单' : '查看验车函'"
                             v-if="code >= 40 && !isClosed"
                             @click.native="goPage(code === 40 ? '/inspection-sheet' : '/inspection-letter')"
                             class="mb-12" ></detail-link>

                <detail-content class="supplier" :title="'仓库信息'" :content="warehouse$$" :isReverseYuan="false" :isShowSubBorderBottom="true"></detail-content>

                <detail-content class="supplier" :title="'账户信息'" :content="supplier$$" :isReverseYuan="false" :isShowSubBorderBottom="true"></detail-content>

                <detail-content :title="'车辆信息'" :content="carInfo$$" :isRedNum="true"></detail-content>
                <car-card :carList="detail.orderDetailCarInfo"
                          class="car-info mb-12"
                          :isShowVin="true"
                          @switchVinOpen="switchVinOpen"></car-card>

                <div class="see-big-img" v-if="imgs.length > 0">
                    <h4>资料及附件<span>（采购合同、车辆清单）</span></h4>
                    <div>
                        <section>
                            <img v-for="(item, index) in imgs" :src="item"
                                 @click="seeBigImg(imgs, index)"
                                 :height='imgHeight'
                                 :width='imgWidth'
                                 v-show="isImgOpen ? true : index < 3"/>
                        </section>
                        <p class="switch-img-open" v-if="imgs.length > 3" @click="switchIsImgOpen">
                            <span>{{!isImgOpen ? '查看' : '收起'}}更多图片</span>
                            <img src="~@/assets/images/right-arrow.png" width="5" height="8" :style="{transform: isImgOpen? 'rotate(-90deg)' : 'rotate(90deg)'}">
                        </p>
                    </div>
                </div>

                <detail-content class="order-info" :title="'订单信息'" :content="orderInfo$$" :isReverseYuan="false"></detail-content>
            </div>
            <!--占位块 为了兼容下拉刷新的高度和title-bar，滚动出现在底部，否则滚到底部以后margin-bottom会永远把refresh组件挤到顶部-->
            <div class="margin65"></div>
        </som-scroll-refresh>
        <my-button v-if='btn.btnText && code !== 10'
                   :text="btn.btnText" :text2="btn.leftBtnText"
                   @click='clickBlueBtn' @click2='clickGreyBtn'
                   :isFixed="true" :is2Btn="!!btn.leftBtnText"></my-button>

        <fixed-bottom v-if="code === 10">
            <cancel-button style="width: 100%" @click.native="cancelOrderShow = true">取消订单</cancel-button>
        </fixed-bottom>
        <som-modal v-model="cancelOrderShow"
                   title="确定取消订单？"
                   is-confirm
                   cancel-text="返回"
                   @on-confirm="operateOrder(1)">
        </som-modal>
        <som-modal v-model="confirmContractShow"
                   title="请确认已签署借款合同"
                   content="若过程中遇到问题，请联系客服"
                   confirm-text="我知道了"
                   @on-confirm="confirmContract">
        </som-modal>
        <overdue-modal v-model="overdueShow" :data="myBankOverdueData"></overdue-modal>
        <som-image-viewer ref="imgViewer"
                          :deletable="false"
                          :action="[{action: 'auto-orient', value: 0}]"
                          :list="imgViewerArr"
        ></som-image-viewer>
    </div>
</template>

<script>
    import myButton from '@/components/order/my-button';
    import steps from '@/components/order/steps';
    import warn from '@/components/order/warn';
    import carCard from '@/components/order/car-card';
    import detailContent from '@/components/order-detail/detail-content';
    import detailLink from '@/components/order-detail/detail-link';
    import Api from '@/api';
    import Clipboard from 'clipboard';
    import fixedBottom from '@/components/fixed-bottom.vue';
    import cancelButton from '@/components/cancel-button.vue';
    import overdueModal from '@/components/order/overdue-modal.vue';
    import map from '@/components/order-detail/status-map';
    import Helper from '@/utils/helper';
    import SomImageViewer from '@souche-ui/som-image-viewer';

    /* eslint no-eval: 0 */

    export default {
        components: {SomImageViewer, overdueModal, myButton, steps, warn, carCard, detailContent, fixedBottom, cancelButton, detailLink},
        data () {
            return {
                titleArr: ['提交申请', '入库验车', '合同签署', '资方放款', '还款提车'],
                totalSteps: 5,
                copyText1: '',
                copyText2: '',
                isImgOpen: false,
                newRepayment: {},
                unRepayData: {}, // 待还款总额
                imgViewerArr: [],
                shopCode: '',
                cancelOrderShow: false,
                confirmContractShow: false,
                overdueShow: false,
                myBankOverdueData: {}, // 网商资金 订单逾期
                contractList: [], // 合同图片列表
                totalMarginImgs: [], // 首付款、保证金支付凭证
                actualMoneyImgs: [], // 放款、垫款凭证
                statusMap: {}, // 状态码对应的对象
                code: 0, // detail.orderVoStatus 订单状态码
                isClosed: false, // 订单是否被关闭
                isShowTooltip: false, // 咨询客服提示窗
                orderId: this.$route.params.orderId,
                detail: {},
                imgs: [], // 资料及附件（采购合同、已支付定金凭证、手续函照片）
                borrow$$: [{
                    key: 'totalMargin',
                    title: '已支付首付款',
                    content: '',
                    linkContent: '查看凭证',
                    isNotShowLink: 'this.code < 70 || this.totalMarginImgs.length === 0',
                    isNotShow: 'this.detail.isMyBank === 0' // 是否是网商资金 0:否 1:是,
                }],
                subBorrow$$: [{
                    key: 'actualMoneyAmount',
                    title: '实际融资总额',
                    content: '',
                    isNotShowLink: 'this.code < 110 || this.actualMoneyImgs.length === 0',
                    linkContent: '查看凭证'
                }],
                predict$$: [{
                    key: 'actualMoneyAmount',
                    title: '预计融资金额',
                    content: ''
                }, {
                    key: 'totalMargin',
                    title: '预计支付首付款',
                    content: '',
                    isNotShow: 'this.detail.isMyBank === 0' // 是否是网商资金 0:否 1:是,
                }],
                carInfo$$: [{
                    key: 'totalQuantity',
                    title: '车辆数',
                    content: ''
                }, {
                    key: 'totalContractAmount',
                    title: '合同总额',
                    content: ''
                }],
                orderInfo$$: [{
                    key: 'orderNo',
                    title: '订单号',
                    content: ''
                }, {
                    key: 'dateCreate',
                    title: '创建时间',
                    content: ''
                }, {
                    key: 'loanTime',
                    title: '放款时间',
                    content: '',
                    isNotShow: 'this.code < 110 || this.code > 200'
                }, {
                    key: 'latestRepaymentDate',
                    title: '还款结清时间',
                    content: '',
                    isNotShow: 'this.code < 160 || this.code > 998'
                }],
                account$$: [{
                    key: 'payeeAccountName',
                    title: '开户名称',
                    content: ''
                }, {
                    key: 'payeeAccountNo',
                    title: '收款账号',
                    content: ''
                }, {
                    key: 'payeeBankName',
                    title: '开户银行',
                    content: ''
                }, {
                    key: 'totalMargin',
                    title: '需支付首付款',
                    content: ''
                }],
                warehouse$$: [{
                    key: 'warehouseName',
                    title: '仓库名称',
                    content: ''
                }, {
                    key: 'warehouseAddress',
                    title: '仓库地址',
                    content: ''
                }],
                supplier$$: [{
                    key: 'dealerAccountName',
                    title: '户名',
                    content: ''
                }, {
                    key: 'dealerBankAccountNumber',
                    title: '收款账号',
                    content: ''
                }, {
                    key: 'dealerBankName',
                    title: '开户银行',
                    content: ''
                }],
                imgList: []
            };
        },
        mounted() {
            this.getOrderByOrderId();
            this.getIsShowTooltip();
            this.getOrderRepayment();
            this.getContractsSignStatus();
            // 更新消息已读
            /*Api.cheoo.csl_openApi_updateJcdMessage({
                API_METHOD: 'get',
                U: this.userData.userToken,
                oid: this.orderId,
                version: '44' // 168服务规定的版本号,不可随意改动
            });*/
            this.imgWH = Helper.setUploadImageWH(document.body.clientWidth - 18);
        },
        computed: {
            imgWidth() {
                return `${this.imgWH.width}px`;
            },
            imgHeight() {
                return `${this.imgWH.height}px`;
            },
            userData () {
                this.shopCode = this.$store.state.userData.storeId;
                return this.$store.state.userData;
            },
            btn () {
                if (this.btnText === '') {
                    return {
                        btnText: this.leftBtnText,
                        leftBtnText: ''
                    };
                }
                return {
                    btnText: this.btnText,
                    leftBtnText: this.leftBtnText
                };
            },
            leftBtnText () {
                if (this.statusMap.leftBtnText) {
                    if ([120, 125, 130, 140].indexOf(this.code) > -1) {
                        if (this.detail.canPickCarNum > 0) {
                            this.statusMap.leftBtnText = `发起提车（${this.detail.canPickCarNum}）`;
                        } else {
                            this.statusMap.leftBtnText = '';
                        }
                    }
                    return this.statusMap.leftBtnText;
                }
            },
            btnText () {
                if ([120, 125, 130, 140].indexOf(this.code) > -1) {
                    // 还款按钮文字处理
                    if (JSON.stringify(this.newRepayment) !== '{}') {
                        // '还款' 改成 "继续还款"
                        this.statusMap.btnText = '继续还款';
                    } else {
                        this.statusMap.btnText = '还款';
                    }
                    if (this.newRepayment && this.newRepayment.unRepayCarNum === 0) {
                        // 无可还款车辆
                        this.statusMap.btnText = '';
                    }
                }
                if (this.code === 160) {
                    // 发起提车
                    if (this.detail.canPickCarNum <= 0) {
                        this.statusMap.btnText = '';
                    } else {
                        this.statusMap.btnText = `发起提车（${this.detail.canPickCarNum}）`;
                    }
                }
                return this.statusMap.btnText;
            }
        },
        methods: {
            switchVinOpen (deco) {
                deco.isVinOpen = !deco.isVinOpen;
            },
            confirmContract() {
                location.reload();
            },
            operateOrder (type) {
                Api.fsc.v1_orderApi_operateOrder({
                    orderId: this.orderId,
                    operateType: type // 操作类型：1.取消 2.删除 3.确认 4.驳回
                }).then(() => {
                    location.reload();
                });
            },
            seeActualMoneyImgs (index) {
                if (index === 0) {
                    this.seeBigImg(this.totalMarginImgs, 0);
                } else {
                    this.seeBigImg(this.actualMoneyImgs, 0);
                }
            },
            onRefresh () {
                location.reload();
            },
            getOrderRepayment() {
                Api.fsc.v1_repaymentApi_getOrderLastRepaymentRecord({
                    orderId: this.orderId
                }).then((res) => {
                    this.newRepayment = res;
                });
            },
            clickBlueBtn() {
                switch (this.detail.orderVoStatus) {
                    case 10:  // 申请已提交，待审核
                    case 20:  // 信息审核不通过，请修改申请
                    case 998: // 重新下单
                    case 999: // 重新下单
                        this.goPage('/start-order');
                        break;
                    case 40:
                        this.goPage('/inspection-sheet');
                        break;
                    case 60:
                    case 70:
                        this.goPage('/order-upload-img');
                        break;
                    case 90:
                    case 91:
                        // 跳转服务合同
                        if (this.contractList.length === 1) {
                            const item = this.contractList[0];
                            this.goPage('/contract', {
                                contractName: item.contractName,
                                contractTemplateId: item.contractTemplateId || '',
                                contractType: item.contractType || '',
                            });
                        } else if (this.contractList.length > 1) {
                            this.goPage('/contract-list');
                        } else if (this.contractList.length === 0) {
                            this.$som.toast.text('当前没有合同可供签署');
                        }
                        break;
                    case 120:
                    case 125:
                    case 130:
                        // 还款申请
                        this.goRepayment();
                        break;
                    case 140:
                        if (this.detail.isMyBank) {
                            // 网商资金
                            Api.fsc.v1_repaymentApi_consultInventoryOutInfo({
                                orderId: this.orderId
                            }).then((res) => {
                                this.myBankOverdueData = res;
                            });
                            this.overdueShow = true;
                        } else {
                            // 还款申请
                            this.goRepayment();
                        }
                        break;
                    case 160:
                        if (this.detail.canPickCarNum > 0) {
                            // 发起提车
                            this.goPage('/order-pickup-list');
                        }
                        break;
                }
            },
            goRepayment() {
                if (this.newRepayment && this.newRepayment.unRepayCarNum === 0) {
                    // 无可还款车辆
                    if (this.detail.canPickCarNum) {
                        // 发起提车
                        this.goPage('/order-pickup-list');
                        return false;
                    }
                }
                this.goPage('/order-repayment-list');
            },
            clickGreyBtn() {
                switch (this.detail.orderVoStatus) {
                    case 120:
                    case 125:
                    case 130:
                    case 140:
                        if (this.detail.canPickCarNum) {
                            // 发起提车
                            this.goPage('/order-pickup-list');
                        }
                }
            },
            goPage (path, otherQuery) {
                this.$router.push({path, query: {orderId: this.orderId, ...otherQuery}});
            },
            copy (el) {
                let clipboard = new Clipboard(el);
                clipboard.on('success', (e) => {
                    this.$som.toast.text('复制成功');
                    e.clearSelection();
                });
                clipboard.on('error', () => {
                    this.$som.toast.text('不支持复制');
                });
            },
            getProp (item, key, res, keyLayer) {
                item[key] = keyLayer && keyLayer.length && keyLayer.reduce((prev, cur) => {
                    if (prev instanceof Array) return prev[0][cur];
                    return prev[cur] || '';
                }, res);
            },
            getAttachments(res) {
                res.attachmentList && res.attachmentList.forEach((item) => {
                    const attachmentList = item.attachmentContent;
                    switch (item.attachmentType) {
                        case 1:
                            // 资料及附件（采购合同、已支付定金凭证、手续函照片）
                            this.imgs = attachmentList;
                            break;
                        case 2:
                            // 首付款、保证金支付凭证
                            this.totalMarginImgs = attachmentList;
                            break;
                        case 3:
                            // 放款、垫款凭证
                            this.actualMoneyImgs = attachmentList;
                            break;
                    }
                });
            },
            getContractsSignStatus() {
                Api.fsc.v2_contractApi_getContractsSignStatus({
                    orderId: this.orderId
                }).then((res) => {
                    this.contractList = res;
                });
            },
            getOrderUnRepayInfo() {
                if ([110, 120, 125, 130, 140].indexOf(this.code) > -1) {
                    Api.fsc.v1_orderApi_getOrderUnRepayInfo({
                        orderId: this.orderId
                    }).then((res) => {
                        this.unRepayData = res;
                    });
                }
            },
            getOrderByOrderId () {
                this.$som.loading.show({
                    text: '正在获取...'
                });
                Api.fsc.v1_orderApi_getOrderByOrderId({
                    orderId: this.orderId
                }).then((res) => {
                    this.detail = res;
                    this.detail.orderDetailCarInfo.forEach((car, index, arr) => {
                        arr[index].decorateList.forEach((deco, i, list) => {
                            list[i].totalDeposit /= 100;
                            list[i].contractPrice /= 100;
                            list[i].isVinOpen = false;
                            list[i].vins = list[i].vins.filter(item => item);
                        });
                    });
                    this.code = res.orderVoStatus;
                    this.isClosed = this.code === 998 || this.code === 999;
                    this.statusMap = map[res.orderVoStatus] || {}; // 获取相对应状态码的map对象
                    this.getAttachments(res);
                    this.getOrderUnRepayInfo();
                    this.fillDataProps();  // 填满data中$$结尾的对象

                    this.copyText1 = `开户名称 ${res.payeeAccountName}
                                    收款账号 ${res.payeeAccountNo}
                                    开户银行 ${res.payeeBankName}
                                    需支付首付款 ${(res.totalMargin / 100).toFixed(2)}元`;
                    this.copyText2 = res.payeeAccountNo;
                    this.$som.loading.hide();
                }).catch(() => {
                    this.$som.loading.hide();
                });
            },
            fillDataProps() {
                function evalInContext(context, js) {
                    //# Return the results of the in-line anonymous function we .call with the passed context
                    return function() { return eval(js); }.call(context);
                }
                for (let key in this) {
                    if (Object.prototype.hasOwnProperty.call(this, key)) {
                        const isDetailProp = key.indexOf('$$') !== -1 && key.indexOf('_') === -1;
                        const isArray = this[key] instanceof Array;
                        if (isDetailProp && isArray) {
                            this[key].forEach((item) => {
                                const keyLayer = item.key && item.key.split('.'); // 返回嵌套的对象层级
                                if (evalInContext(this, item.isNotShow)) { // 间接eval调用
                                    item.title = '';
                                    item.linkContent = '';
                                } else if (Object.prototype.hasOwnProperty.call(item, 'small')) {
                                    this.getProp(item, 'small', this.detail, keyLayer);
                                } else {
                                    this.getProp(item, 'content', this.detail, keyLayer);
                                }
                                if (evalInContext(this, item.isNotShowLink)) {
                                    item.linkContent = '';
                                }
                                if (item.key === 'payeeAccountNo' || item.key === 'dealerBankAccountNumber') {
                                    item.content = item.content && item.content.replace(/(\d)(?=(\d{4})+$)/g, '$1 '); // 首付款收款账户 收款账号 隔4位加空格
                                }
                                if (item.key === 'totalQuantity') item.content = `${item.content} 辆`;
                            });
                        }
                    }
                }
            },
            getIsShowTooltip () {
                const tooltipObj = JSON.parse(localStorage.getItem('treasury-loan-customer-service-tooltip'));
                this.isShowTooltip = !tooltipObj;
                localStorage.setItem('treasury-loan-customer-service-tooltip', JSON.stringify({hasShowed: true}));
            },
            closeTooltip () {
                this.isShowTooltip = false;
            },
            seeBigImg (imgs, index) {
                this.imgViewerArr.length = 0;
                imgs.forEach((item) => {
                    this.imgViewerArr.push({
                        src: item
                    });
                });
                if (imgs.length >= 1) {
                    this.$refs['imgViewer'].show(index);
                } else {
                    this.$som.toast.text('图片正在生成中，请稍候…');
                }
            },
            switchIsImgOpen () {
                const ele = document.querySelector('.see-big-img section');
                if (this.isImgOpen) {
                    // 为了增加transition过渡，增加了height的具体高度
                    ele.style.height = this.imgHeight;
                } else {
                    const rows = Math.ceil(this.imgs.length / 3);
                    const rowHeight = this.imgWH.height + 16;
                    ele.style.height = `${(rows * rowHeight) - 16}px`;
                }
                this.isImgOpen = !this.isImgOpen;
            }
        }
    };
</script>

<style lang="less">

    .pg-order-detail {
        background-color: #f2f2f2;
        .mb-12 {
            margin-bottom: 12px;
        }
        h4 {
            font-size: 18px;
        }
        a {
            font-size: 14px;
            color: @blue;
        }
        .bold {
            font-weight: bold;
            font-size: 16px;
        }
        .red {
            color: @primary;
        }
        .hide-input{
            position: absolute;
            top:-10000px;
            opacity: 0;
            z-index:-10;
        }
        .customer-service-tooltip {
            z-index: 2;
            position: fixed;
            top: 0;
            right: 60px;
        }
        .co-detail-content.order-repayment {
            section {
                div.order-repayment-content {
                    p {
                        display: block;
                        &.car-num {
                            float: right;
                            width: auto;
                        }
                    }
                }

            }
        }
        .see-big-img, .repayment-list {
            background-color: white;
            padding: 14px 0 0 16px;
            line-height: 1.6;
            h4 {
                span {
                    font-size: 12px;
                }
            }
            div {
                .border-bottom();
                padding-bottom: 30px;
                section {
                    /*display: grid;
                    margin-right: 16px;
                    grid-column-gap: 14px;
                    grid-row-gap: 16px;
                    justify-items: stretch;
                    align-items: stretch;
                    grid-template-columns: 1fr 1fr 1fr;
                    grid-template-rows: 80px;*/
                    overflow: hidden;
                    transition: all .3s ease;
                    img {
                        margin-bottom: 12px;
                        margin-right: 14px;
                    }
                }
                .switch-img-open {
                    text-align: center;
                    padding-top: 16px;
                    span {
                        color: #999;
                        font-size: 12px;
                        padding-right: 5px;
                    }
                    img {
                        transition: all .5s ease;
                        transform: rotate(90deg);
                    }
                }
            }
        }
        .repayment-list {
            section {
                .border-bottom();
                padding-bottom: 16px;
                padding-right: 16px;
                p {
                    display: flex;
                    flex-wrap: wrap;
                    span {
                        flex: 0 0 160px;
                        &.right {
                            flex: 1;
                            text-align: right;
                            color: @primary;
                        }
                    }
                }
            }
            .sub-repayment-list {
                padding-top: 16px;
                p {
                    font-size: 16px;
                    span {
                        &.right {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
        .predict {
            span.right {
                font-size: 16px;
                color: @primary;
            }
        }
        .account-wrapper {
            .account-copy {
                overflow: hidden;
                div {
                    width: 50%;
                    float: left;
                    box-sizing: border-box;
                    display: inline-block;
                    text-align: center;
                    color: @blue;
                    line-height: 48px;
                    .border-top();
                    background-color: white;
                    height: 48px;
                    &:first-of-type {
                        .border-right();
                    }
                }
            }
        }
        .order-info {
            section {

            }
        }
        .fixed-bottom {
            .cancel-button div, .som-button {
                font-weight: bold;
            }
        }
        .som-dialog {
            .som-modal__button {
                color: @blue;
            }
        }
        .som-scroll-refresh {
            overflow-y: scroll;
            height: calc(~'100vh - 44px');
        }
        .margin65 {
            height: 65px;
            width: 100px;
        }
    }
</style>
