<template>
    <div class="pg-repayment-detail">
        <title-bar>还款详情</title-bar>
        <div class="notice-bar" v-if="result.repaymentStatusDesc">
            <h2>{{result.repaymentStatusDesc}}</h2>
            <p v-if="result.repaymentNotes">{{result.repaymentNotes}}</p>
        </div>
        <div class="content">
            <div class="money-info">
                <div class="wrap">
                    <div class="title">本次还款总额</div>
                    <p class="total-money">{{result.totalRepayAmount | reverseYuan}}元</p>
                    <div class="title">还款明细</div>
                    <div class="money">
                        <div class="name">融资金额</div>
                        <div class="fs-16">{{result.actualMoneyAmount | reverseYuan}}元</div>
                    </div>
                    <div class="money">
                        <div class="name" v-if="[20, 30, 40, 50].indexOf(result.capitalAscription) > -1" @click="showPopup = true">服务费 <i class="icon-question"></i></div>
                        <div class="name" v-if="result.capitalAscription === 10" @click="showPopup1 = true">利息 <i class="icon-question"></i></div>
                        <div class="fs-16">{{result.interest | reverseYuan}}元</div>
                    </div>
                    <p class="tip" v-if="![60, 70].includes(result.repaymentStatus)">
                        <template v-if="[20, 40].indexOf(result.capitalAscription) > -1">
                           注：截止当前日期还款总额，请将本次还款总额<span class="text-red">打款至以下银行账号</span>，资方收到还款后方可提车。
                        </template>
                        <template v-if="result.capitalAscription === 10">
                           注：截止当前日期费用，请将还款金额<span class="text-red">充值到企业支付宝（账号一般为XXX@XX.com）</span>，资方收到还款后方可提车。
                        </template>
                        <template v-if="result.capitalAscription === 30">
                            注：截止当前日期费用，请使用账户名为<span class="text-red">“{{result.licenseCompanyName}}”的银行账户</span>,将还款金额转账到如下账户中，并<span class="text-red">在转账附言（或备注）处填写您在网金社开立的民生电子账户</span>，资方收到还款后方可提车。
                        </template>
                        <template v-if="result.capitalAscription === 50">
                            注：截止当前日期还款总额，请将本次还款总额<span class="text-red">充值到苏宁银行贷款专户</span>，资方收到还款后方可提车。
                        </template>
                    </p>
                </div>
            </div>
            <div class="account-info" v-if="![60, 70].includes(result.repaymentStatus) && ![10, 50].includes(result.capitalAscription)">
                <div class="wrap">
                    <h2>收款账户</h2>
                    <div class="accountmsg-container">
                    <div class="account-detail">
                    <div><p class="flex-between"><span class="label">开户名称</span><span class="info">{{result.payeeAccountName}}</span></p></div>
                    <div class="clearfix"><span @click="copy('.copy-btn',result.payeeAccountName)" class="copy-btn">复制</span></div>
                    </div>

                    <div class="account-detail">
                    <div><p class="flex-between"><span class="label">收款账户</span><span class="info">{{result.payeeAccountNo | addSpace}}</span></p></div>
                    <div class="clearfix"><span @click="copy('.copy-btn',result.payeeAccountNo)" class="copy-btn">复制</span></div>
                    </div>
                    <p class="flex-between"><span class="label">开户银行</span><span class="info">{{result.payeeBankName}}</span></p>

                    <div class="account-detail">
                    <template v-if="result.capitalAscription === 30">
                    <div><p class="flex-between"><span class="label">转账备注</span><span class="info">{{result.wjsPayDescription | addSpace}}</span></p></div>
                    <div class="clearfix"><span @click="copy('.copy-btn',result.wjsPayDescription)" class="copy-btn">复制</span></div>
                    </template>
                    </div>
                    </div>
                </div>
                <div class="options">
                    <span @click="copy('.copy-btn',copyText1)" class="copy-btn fill">复制全部</span>
                </div>
            </div>
            <!-- 网金社账户信息 -->
            <div class="car-info">
                <div class="wrap">
                    <h2>车辆信息</h2>
                    <template v-for="car in result.carList">
                        <p>{{car.modelName}}</p>
                        <p>
                            <span>{{car.appearanceColor}}/{{car.interiorColor}}</span>
                            <span class="line-between"></span>
                            <span>车架号: {{car.vin}}</span>
                        </p>
                    </template>
                </div>
            </div>
        </div>
        <fixed-bottom v-if="[10, 20, 40, 50].indexOf(result.repaymentStatus) > -1 || (result.repaymentStatus === 70
        && ([20, 40, 50].indexOf(result.capitalAscription) > -1))">
            <cancel-button style="margin-right: 16px" @click.native="show = true"
                           v-if="[10, 20, 50].indexOf(result.repaymentStatus) > -1">取消还款</cancel-button>

            <som-button :gradients="['#3684FF', '#3665FF']"
                        v-if="[10].indexOf(result.repaymentStatus) > -1"
            @click.native="getPaymentPrompt">确认还款</som-button>

            <som-button :gradients="['#3684FF', '#3665FF']"
                        v-if="[20, 50].indexOf(result.repaymentStatus) > -1" @click="uploadImg"
            >上传转账凭证</som-button>


            <som-button :gradients="['#3684FF', '#3665FF']"
            v-if="[40, 70].indexOf(result.repaymentStatus) > -1 && [20, 40, 50].indexOf(result.capitalAscription) > -1"
            @click.native="seeImg('viewer')">查看转账凭证</som-button>

        </fixed-bottom>

        <som-modal v-model="show"
                   title="确定取消还款申请？"
                   is-confirm
                   cancel-text="返回"
                   @on-confirm="cancel">
        </som-modal>

        <som-modal v-model="show1"
                   :class="{disabled: timer}"
                   :title="paymentPrompt"
                   is-confirm
                   cancel-text="返回"
                   :confirm-text="confirmText"
                   @on-cancel="cancelConfirm"
                   :close-on-confirm="false"
                   @on-confirm="paymentConfirm">
        </som-modal>
        <som-image-viewer ref="viewer"
                          :list="imgViewerList"
                          :action="[{action: 'auto-orient', value: 0}]"
        >
        </som-image-viewer>
        <som-popup v-model="showPopup" height="305px">
            <div class="fee-tip">
                <div class="title">服务费<i class="som-icon-close" @click="showPopup = false"></i>
                </div>
                <div class="container">
                    <section>
                        <p>计算公式：</p>
                        <p v-if="result.financingModeInfo !== 'WD'">服务费总额 = 本次还款金额x用款天数x费率</p>
                        <p v-else>服务费总额 = 订单剩余垫款金额（还款时）×订单剩余垫款的用款天数x费率</p>
                    </section>
                    <section>
                        <template v-if="result.financingModeInfo !== 'WD'">
                            <p>本次还款金额：</p>
                            <p>{{result.actualMoneyAmount | reverseYuan}} 元</p>
                        </template>
                        <template v-else>
                            <p>订单剩余垫款金额（还款时）</p>
                            <p>{{result.remainderAmountOfMoney | reverseYuan}} 元</p>
                        </template>
                    </section>
                    <section>
                        <p>本次回款比例：</p>
                        <p>{{(result.repaymentProportion * 100).toFixed(2)}} %</p>
                    </section>
                </div>
            </div>
        </som-popup>
        <som-popup v-model="showPopup1" height="305px">
            <div class="fee-tip">
                <div class="title">利息<i class="som-icon-close" @click="showPopup1 = false"></i>
                </div>
                <div class="container">
                    <section>
                        <p>计算公式：</p>
                        <p>利息总额 = 订单剩余垫款金额（还款时）×订单剩余垫款的用款天数×利率</p>
                    </section>
                    <section>
                        <p>订单剩余垫款金额（还款时）</p>
                        <p>{{result.remainderAmountOfMoney | reverseYuan}} 元</p>
                    </section>
                    <section>
                        <p>本次回款比例：</p>
                        <p>{{(result.repaymentProportion * 100).toFixed(2)}} %</p>
                    </section>
                </div>
            </div>
        </som-popup>
    </div>
</template>

<script>
import Api from '@/api';
import SomImageViewer from '@souche-ui/som-image-viewer';
import Clipboard from 'clipboard';
import fixedBottom from '@/components/fixed-bottom.vue';
import cancelButton from '@/components/cancel-button.vue';

//repaymentStatus (integer):
// 还款状态 10:申请中，待回款 (网商)
// 20:申请中，待上传回款凭证 (自有资金)
// 30:回款中，待资金方扣款 (网商)
// 40:回款凭证已提交，待资金方审核 (自有资金 查看转账凭证)
// 50:回款凭证审核不通过，待重新上传 (自有资金)
// 60:已失效
// 70:已回款

export default {
    name: 'RepaymentDetail',
    data () {
        return {
            show: false,
            show1: false,
            showPopup: false,
            showPopup1: false,
            result: {
                attachmentList: []
            },
            copyText1: '',          //所有内容
            copyText2: '',          //转账备注
            paymentPrompt: '', // 还款确认提示文字
            confirmText: '确认还款（5）',
            timeout: 5,
            timer: null
        };
    },
    components: {
        fixedBottom,
        cancelButton,
        SomImageViewer
    },
    computed: {
        imgViewerList () {
            let arr = [];
            let imgList = (this.result.attachmentList.length && JSON.parse(this.result.attachmentList[0].attachmentContent)) || [];
            imgList.forEach((item) => {
                arr.push({
                    src: item
                });
            });
            return arr;
        }
    },
    methods: {
        copy (el, target) {
            let clipboard = new Clipboard(el, {
                text: function() {
                    return target;
                }
            });
            clipboard.on('success', (e) => {
                this.$som.toast.text('复制成功');
                e.clearSelection();
            });
            clipboard.on('error', () => {
                this.$som.toast.text('不支持复制');
            });
        },
        uploadImg () {
            this.$router.push({
                name: 'uploadPaymentVoucher',
                query: {
                    orderId: this.result.orderId,
                    repaymentId: this.result.repaymentId
                }
            });
        },
        cancel () {
            Api.fsc.v1_repaymentApi_cancelRePayment({repaymentId: this.result.repaymentId}).then(() => {
                this.getData();
            });
        },
        getData () {
            Api.fsc.v1_repaymentApi_getRepaymentRecordInfo({
                repaymentId: this.$route.query.repaymentId || this.result.repaymentId,
                orderId: this.$route.query.orderId,
                carId: this.$route.query.carId
            }).then((res) => {
                this.result = res;
                this.copyText1 = `开户名称  ${res.payeeAccountName}\n银行账号 ${res.payeeAccountNo}\n开户银行 ${res.payeeBankName}\n还款总额 ${res.totalRepayAmount / 100}元\n`;
                if (this.result.capitalAscription === 30) {
                        this.copyText1 = this.copyText1.concat('转账备注 ') + res.wjsPayDescription;
                }
            });
        },
        seeImg () {
            this.$refs.viewer.show(0);
        },
        cancelConfirm () {
            setTimeout(() => {
                clearInterval(this.timer);
                this.timer = null;
                this.timeout = 5;
                this.confirmText = '确认还款（5）';
            }, 500);
        },
        getPaymentPrompt () {
            Api.fsc.v1_repaymentApi_getPaymentPrompt({
                orderId: this.$route.query.orderId
            }).then((res) => {
                this.confirmText = '确认还款（5）';
                this.paymentPrompt = res;
                this.show1 = true;
                this.timer = setInterval(() => {
                    this.confirmText = `确认还款（${--this.timeout}）`;
                    if (this.timeout === -1) {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.timeout = 5;
                        this.confirmText = '确认还款';
                    }
                }, 1000);
            });
        },
        paymentConfirm () {
            if (this.timer) return;
            Api.fsc.v1_repaymentApi_getPaymentConfirm({
                repaymentId: this.result.repaymentId
            }).then(() => {
                this.show1 = false;
                this.getData();
            });
        }
    },
    filters: {
        addSpace: (value = '', space = 4) => {
            // eslint-disable-next-line
            let regx = new RegExp('(\\S{' + space + '})(?=\\S)', 'g');
            return value.replace(/\s/g, '').replace(regx, '$1 ');
        }
    },
    mounted () {
        this.getData();
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-repayment-detail{
    margin-bottom: 68px;
    .notice-bar{
        background: #FFFAEB;
        padding: 14px 16px;
        h2{
            font-size: 17px;
            margin-bottom: 0;
        }
        p{
            margin-top: 6px;
            font-size: 14px;
        }
        color: #FF982A;
    }
    .content{
        background: #fff;
    }
    h2{
        font-size: 18px;
        font-weight: bold;
        margin: 0 16px 22px 0;
    }
    .money-info,.car-info {
        padding: 32px 0 0 16px;
        .wrap {
            padding: 0 16px 20px 0;
        }
    }
    .money-info{
        .wrap{
            .border-bottom();
        }
        .title{
            font-size: 14px;
            font-weight: bold;
            margin: 0 16px 16px 0;
        }
        .total-money{
            font-size: 24px;
            color: @primary;
            font-weight: bold;
            margin-bottom: 30px;
            line-height: 1;
        }
        .money{
            display: flex;
            justify-content: space-between;
            line-height: 1;
            margin-bottom: 12px;
        }
        .tip{
            color: #666;
            font-size: 12px;
            line-height: 21px;
            padding-top: 4px;
            margin-bottom: 12px;
        }
    }
    .car-info{
        p{
            line-height: 1;
            margin-bottom: 12px;
        }
    }
    .account-info{
        padding: 32px 0 0 0;
        .wrap {
            padding: 0 16px 24px 16px;
            .accountmsg-container{
                .copy-btn{
                    display: block;
                    width: 44px;
                    height: 20px;
                    border-radius: 8px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    margin: 2px 0 9px 0px;
                    float: right;
                    .border(#cccccc);
                     &:after{
                         border-radius: 8px;
                     }
                }
                .flex-between{
                    line-height: 20px;
                }
            }
        }
        p{
            line-height: 1.4;
        }
        span.label{
            width: 60px;
            margin-right: 20px;
        }
        span.info{
            flex: 1;
            text-align: right;
        }
        .options{
            .fill{
                width: 100%;
            }
            display: flex;
            .border-bottom();
            .border-top();
            height: 49px;
            line-height: 49px;
            text-align: center;
            span{
                width: 50%;
                color: @blue;
                &:first-child{
                    .border-right();
                }
            }
        }
    }
    .flex-between{
        display: flex;
        justify-content: space-between;
    }
    .hide-input{
        position: absolute;
        top:-10000px;
        opacity: 0;
        z-index:-10;
    }
    .line-between{
        .border-right();
        margin: 0 8px;
        height: 10px;
        display: inline-block;
    }
    .som-popup.som-popup-dialog{
        background: #fff;
    }
    .fee-tip{
        .title{
            font-size: 18px;
            padding: 24px 0 20px 0;
            line-height: 1;
            text-align: center;
            position: relative;
            .som-icon-close{
                position: absolute;
                right: 16px;
                top: 16px;
                z-index: 1;
                width: 16px;
                height: 16px;
                color: #ccc;
            }
        }
        .container{
            padding: 0 16px;
        }
        section{
            margin-bottom: 20px;
        }
        p{
            line-height: 20px;
        }
    }
}
.som-modal.disabled{
    .som-modal__btn.som-modal__btn_primary{
        color: #999;
    }
}
</style>
