<style lang="less">

    .pg-authorize {
        .account-wrapper {
            padding-top: 16px;
            .company-account, .personal-account {
                background-color: #fff;
                padding: 0 16px;
                margin-bottom: 12px;
                .account-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 14px 0;
                    .border-bottom();
                    h3 {
                        flex: 1;
                        font-size: 16px;

                    }
                    p {
                        color: #bbb;
                    }
                    .som-button {
                        flex: 0 0 63px;
                        border-radius: 21px;
                        border-color: @blue;
                        height: 28px;
                        line-height: 100%;
                        color: @blue;
                        font-size: 13px;
                        float: right;
                    }
                    h5 {
                        width: 100%;
                        color: #666;
                        font-size: 14px;
                        margin-top: 9px;
                        margin-bottom: -6px;
                        font-weight: normal;
                        span {
                            float: right;
                            color: @blue;
                        }
                    }
                }
                .account-body {
                    padding: 9px 0;
                    color: #999;
                    line-height: 20px;
                }
            }
            .personal-account {

            }
        }
        .som-modal .som-modal__button {
            font-weight: normal;
            color: @blue;
        }
        .som-button--plain--primary:not(.som-button--plain-disabled):active {
            color: #fff;
        }
    }
</style>

<template>
    <div class="pg-authorize ">
        <title-bar>资金授权</title-bar>
        <section class="account-wrapper">
            <div class="company-account" v-if="pageType === PT.notOpen">
                <div class="account-header">
                    <h3>| 融易收账户开通</h3>
                    <som-button mini @click="toOpenCompanyAccount">去开通</som-button>
                </div>
                <div class="account-body">
                    <p>请使用绑定法人手机号的企业支付宝开通融易收账户，开通后才可为您使用网商银行资金办理业务</p>
                </div>
            </div>
            <div class="company-account" v-if="pageType === PT.notAudit">
                <div class="account-header">
                    <h3>| 融易收账户开通</h3>
                    <som-button mini @click="toOpenCompanyAccount">去认证</som-button>
                </div>
                <div class="account-body">
                    <p>差一步即可开通成功，开通后才可为您使用网商银行资金办理业务</p>
                </div>
            </div>
            <div class="company-account" v-if="pageType === PT.openSucess">
                <div class="account-header">
                    <h3>| 融易收账户开通</h3>
                    <p>已开通</p>
                    <h5>融易收账户: {{companyAccountName}}</h5>
                </div>
                <div class="account-body">
                    <p>已完成融易收账户开通，现在可为您使用网商银行资金办理业务</p>
                </div>
            </div>
            <div class="personal-account" v-if="personalAlipayUserId">
                <div class="account-header">
                    <h3>| 个人支付宝授权</h3>
                    <p>已授权</p>
                    <h5>支付宝昵称: {{personalAlipayUserName}} <span @click="toOpenPersonalAccount">重新授权</span></h5>
                </div>
                <div class="account-body">
                    <p>已完成个人支付宝授权，现在可为您更灵活地使用补充资金办理业务</p>
                </div>
            </div>
            <div class="personal-account" v-if="!personalAlipayUserId">
                <div class="account-header">
                    <h3>| 个人支付宝授权</h3>
                    <som-button mini @click="toOpenPersonalAccount">去授权</som-button>
                </div>
                <div class="account-body">
                    <p>请进行个人支付宝授权，授权后可为您更灵活地使用补充资金办理业务</p>
                </div>
            </div>
        </section>
        <som-modal v-model="modalShow"
                   :title="modalTitle"
                   :content="modalText"
                   :confirm-text="'确认完成'"
                   @on-confirm="onConfirm">
        </som-modal>
    </div>
</template>


<script>
    import Api from '@/api';

    export default {
        name: 'authorize',
        components: {},
        data() {
            return {
                alipayAccountType: 1, // 1公司账户 2个人账户
                // 弹窗显示
                modalShow: false,
                // 弹窗文字
                modalText: '若授权遇到问题，请根据提示重新授权',
                modalTitle: '请确认已完成授权',
                alipayUserId: '', // 有没有alipayUserId，表示是否已完成企业支付宝授权
                companyAccountName: '', // 融易收账户名称
                companyAccountId: '', // 融易收账户id
                personalAlipayUserName: '', // 个人支付宝账户昵称
                personalAlipayUserId: '',  // 个人支付宝用户ID
                pageType: 2,
                PT: {
                    // 未开通
                    notOpen: 2,
                    // 开通未认证
                    notAudit: 3,
                    // 完成认证
                    openSucess: 4
                }
            };
        },
        watch: {
            pageType() {
                this.modalShow = false;
            }
        },
        computed: {
            userData() {
                return this.$store.state.userData;
            }
        },
        created() {
            this.$setBodyBack('#F7F7F7');
            this.getAlipayUserInfo();
        },
        methods: {
            toOpenCompanyAccount() {
                this.alipayAccountType = 1;
                if (this.alipayUserId) {
                    this.$router.push({path: '/financing-collection'});  // 已完成企业支付宝授权, 去往financing-collection页面的未开通或者已审核未认证状态
                } else {
                    this.jumpAlipay();
                }
            },
            toOpenPersonalAccount() {
                this.alipayAccountType = 2;
                this.jumpAlipay();
            },
            onConfirm() {
                this.modalShow = false;
                this.reloadPage();
            },
            reloadPage() {
                window.location.reload();
            },
            getAlipayUserInfo() {
                Api.fsc.v1_urlApi_getAlipayUserInfo()
                    .then((res) => {
                        this.personalAlipayUserName = res.personalAlipayUserName || '';  // 个人支付宝信息
                        this.personalAlipayUserId = res.personalAlipayUserId || '';
                        if (
                            res && res.alipayUserId && `${res.alipayUserId}`.trim()  // 有没有alipayUserId，表示是否已完成企业支付宝授权
                        ) {
                            this.alipayUserId = res.alipayUserId;
                            if (+res.alipayEasyPayAccountOpen) {
                                // 已开通融易收,直接展示
                                this.processAcc({
                                    easyPayAccountNo: res.easyPayAccountNo,
                                    easyPayAccountOpen: 1,
                                    alipayUserName: res.alipayUserName
                                });
                            } else {
                                // 未开通认证
                                this.getRYSLinkUrl(res);
                            }
                        } else {
                            // 未完成企业支付宝授权
                            this.processAcc({
                                easyPayAccountOpen: 0
                            });
                        }
                    })
                    .catch(() => {
                        // success 为 false, 亦为没有数据,未完成企业支付宝授权
                        this.processAcc({
                            easyPayAccountOpen: 0
                        });
                    });
            },
            // 获取融易收开通链接
            getRYSLinkUrl({alipayUserId, alipayUserName}) {
                Api.fsc.v1_urlApi_getRYSLinkUrl({
                    data: JSON.stringify({
                        // 支付宝id
                        alipayUserId,
                        // 支付宝用户名
                        alipayUserName: alipayUserName || ''
                    })
                }).then((res) => {
                    if (res) {
                        this.processAcc(res);
                    }
                });
            },
            // 跳转支付宝
            jumpAlipay() {
                this.modalShow = true;
                let redirectUrl = `${window.location.origin}${window.location.pathname}#/financing-collection`;
                redirectUrl = this.setUrlParam(redirectUrl, 'userToken', this.userData.userToken);
                redirectUrl = this.setUrlParam(redirectUrl, 'alipayAccountType', this.alipayAccountType); // "支付宝账户类型：1公司账户 2个人账户"
                // eslint-disable-next-line
                const openauthUrl = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018012302043709&scope=auth_user,auth_base&redirect_uri=${encodeURIComponent(
                    redirectUrl
                )}`;
                const openAlipayUrl = `alipays://platformapi/startapp?appId=20000067&url=${encodeURIComponent(
                    openauthUrl
                )}`;
                // 当前页面处在支付宝中,无需跳转
                window.location.href = /Alipay/i.test(navigator.userAgent) ? openauthUrl : openAlipayUrl;
            },
            // 获取url参数
            setUrlParam(url, key, val) {
                if (this.getUrlParam(key, url)) {
                    return url; // 已有该键
                } else {
                    return `${url}${url.indexOf('?') < 0 ? '?' : '&'}${key}=${val}`;
                }
            },
            // 获取url参数
            getUrlParam(key, url) {
                key = key.trim();
                let val = '';
                if (this.$route.query[key]) {
                    val = this.$route.query[key];
                } else if (url.indexOf(key) > -1) {
                    const match = new RegExp(
                        `${key}\\s*=([^?&#/]+)(?:\\?|&|#|\\/|$)`
                    ).exec(url);
                    if (match) {
                        val = match[1];
                    }
                }
                return val.trim();
            },
            // 处理融易收账户
            processAcc({
                           easyPayAccountNo,
                           easyPayAccountOpen,
                           alipayUserName,
                           rysLinkUrl
                       }) {
                // 0: 未开通融易收, 1: 已开通融易收
                let accOpen = false;
                if (+easyPayAccountOpen === 1) {
                    accOpen = true;
                }
                // 是否有链接
                let haveLink = false;
                if (rysLinkUrl && rysLinkUrl.toString().length > 0) {
                    haveLink = true;
                }
                if (accOpen) {
                    if (haveLink) {
                        // 开通未认证
                        this.pageType = this.PT.notAudit;
                    } else {
                        // 完成认证
                        this.pageType = this.PT.openSucess;

                        this.companyAccountName = easyPayAccountNo;
                        this.companyAccountId = alipayUserName;
                    }
                } else {
                    // 未开通
                    this.pageType = this.PT.notOpen;
                }
            }
        }
    };
</script>
