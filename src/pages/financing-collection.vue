<template>
    <div class="financing-collection financing-collection-inner-use">
        <title-bar v-if="alipayAuthSuccess === null">融易收</title-bar>
        <div v-else class="alipay-tips">
            <img v-if="alipayAuthSuccess" class="alipay-tips-img" src="~@/assets/images/rys-success.png">
            <img v-else class="alipay-tips-img" src="~@/assets/images/rys-warning.png">
            <div class="alipay-tips-text">
                <span class="alipay-tips-head" v-if="alipayAuthSuccess">支付宝授权成功</span>
                <span class="alipay-tips-head" v-if="!alipayAuthSuccess">{{alipayAccountType == 1 ? '融易收开通失败' : '无效的授权'}}</span>
                <p class="alipay-tips-cont">{{wordShowInAlipay}}</p>
            </div>
        </div>
        <template v-if="pageType===PT.notOpen || pageType===PT.notAudit || pageType===PT.openSucess">
            <div class="pass-audit" v-if="pageType===PT.notOpen || pageType===PT.notAudit">
                <div class="status-info" v-if="pageType===PT.notAudit">
                    <img class="status-icon" src="~@/assets/images/financing-collection-pass.png">
                    <span>审核通过，请复制开户链接使用电脑浏览器打款验证账户</span>
                </div>
                <div class="open-account">
                    <span class="open-account-title">融易收账户开户链接：</span>
                    <p class="open-account-link">{{openAccountLink}}</p>
                    <div class="open-account-tips">注：请刷新后复制链接至电脑浏览器访问</div>
                    <div class="btn-wrap">
                        <div @click="reloadPage" class="o-a-btn reload-page">刷新页面</div>
                        <div @click="copyLink" class="o-a-btn copy-link" data-clipboard-target=".open-account-link">复制链接</div>
                    </div>
                </div>
            </div>
            <div class="open-sucess" v-if="pageType===PT.openSucess">
                <img class="status-icon" src="~@/assets/images/financing-collection-success.png">
                <div class="acc-info">
                    <span>融易收开通成功</span>
                    <p>账户名：{{accountName}}</p>
                </div>
            </div>
            <div class="one-pixel"></div>
            <ul class="rys-instruction">
                <li>1.复制链接去PC端开通融易收账户，（注：每次进入将会获取新的链接，链接使用一次后失效）</li>
                <li>2.提交开通融易收账户开户资料，审核需1-2个工作日，以短信方式告知审核结果</li>
                <li>3.审核通过后，重新获取开户链接复制到PC端打款验证账户</li>
                <li>4.开户完成，即可发起融资申请</li>
            </ul>
        </template>
        <som-modal v-model="modalShow"
                :content="nowIsInAlipay ? '支付宝授权后请确认' : modalText"
                :confirm-text="nowIsInAlipay ? '确认' : '我知道了'"
                @on-confirm="onConfirm">
            </som-modal>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import Api from '@/api';

export default {
    name: 'financing-collection',
    components: {},
    data() {
        return {
            alipayAccountType: this.$route.query.alipayAccountType,  // "支付宝账户类型：1公司账户 2个人账户"
            alipayAuthSuccess: null,
            wordShowInAlipay: '',
            pageType: 0,
            // 弹窗显示
            modalShow: false,
            // 弹窗文字
            modalText: '',
            // nowIsInAlipay
            nowIsInAlipay: false,
            openAccountLink: '',
            accountName: '',
            accountId: '',
            PT: {
                // 非 168 用户
                not168: 1,
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
            if (this.pageType === this.PT.not168) {
                this.modalShow = true;
            }
        }
    },
    computed: {
        userData() {
            return this.$store.state.userData;
        }
    },
    created() {
        this.$setBodyBack('#fff');
        this.judgeFromSource();
    },
    methods: {
        onConfirm() {
            this.modalShow = false;
            const goBack = () => this.$router.go(-1);
            if (this.nowIsInAlipay) {
                this.judgeFromSource(goBack);
            } else {
                goBack();
            }
        },
        reloadPage() {
            window.location.reload();
        },
        copyLink() {
            const clipboard = new Clipboard('.copy-link');
            clipboard.on('success', (e) => {
                this.$som.toast.text('链接复制成功');
                e.clearSelection();
            });
            clipboard.on('error', () => {
                this.$som.toast.text('不支持复制');
            });
        },
        // 判断来源
        judgeFromSource(cb) {
            this.wordShowInAlipay = '';
            // 获取支付宝回调
            const authCode =
                this.getUrlParam('auth_code') ||
                this.getUrlParam('authCode') ||
                this.getUrlParam('authcode') ||
                this.getUrlParam('auth_Code');
            // 来源支付宝回调
            if (authCode) {
                // 设置 authCode
                this.setAuthorAlipayUserAccount(authCode);
            } else {
                // 获取支付宝信息
                Api.fsc
                    .v1_urlApi_getAlipayUserInfo()
                    .then((res) => {
                        if (
                            res &&
                            res.alipayUserId &&
                            `${res.alipayUserId}`.trim()
                        ) {
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
                            // 没有数据,跳转支付宝授权
                            cb ? cb() : this.jumpAlipay();
                        }
                    })
                    .catch(() => {
                        // success 为 false, 亦为没有数据,跳转支付宝授权
                        cb ? cb() : this.jumpAlipay();
                    });
            }
        },
        // 授权支付宝账户
        setAuthorAlipayUserAccount(authCode) {
            const {alipayAccountType} = this;
            Api.fsc
                .v1_urlApi_setAuthorAlipayUserAccount({ authCode, alipayAccountType })
                .then((res) => {
                    if (res.isSaved) {
                        // 授权成功
                        this.alipayAuthSuccess = true;
                        this.wordShowInAlipay =
                            '您已成功授权，请手动返回被授权的app';
                    } else {
                        // 授权失败
                        this.alipayAuthSuccess = false;
                        this.wordShowInAlipay = Number(alipayAccountType) === 1 ?
                            '使用企业支付宝账户授权后，才能去开通融易收' : '请使用已实名认证的个人支付宝进行授权';
                    }
                })
                .catch((err) => {
                    // 授权失败
                    this.alipayAuthSuccess = false;
                    this.wordShowInAlipay = err.data.message || err.msg;
                });
        },
        // 获取融易收开通链接
        getRYSLinkUrl({ alipayUserId, alipayUserName }) {
            // 取消提示刷新
            this.nowIsInAlipay = false;
            this.modalShow = false;

            Api.fsc
                .v1_urlApi_getRYSLinkUrl({
                    data: JSON.stringify({
                        // 支付宝id
                        alipayUserId,
                        // 支付宝用户名
                        alipayUserName: alipayUserName || ''
                    })
                })
                .then((res) => {
                    if (res) {
                        this.processAcc(res);
                    }
                });
        },
        // 跳转支付宝
        jumpAlipay() {
            // 提示刷新
            this.nowIsInAlipay = true;
            this.modalShow = true;

            const originUrl = this.setUrlParam(
                window.location.href,
                'userToken',
                this.userData.userToken
            );
            // eslint-disable-next-line
            const openauthUrl = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018012302043709&scope=auth_user,auth_base&redirect_uri=${encodeURIComponent(
                originUrl
            )}`;
            const openAlipayUrl = `alipays://platformapi/startapp?appId=20000067&url=${encodeURIComponent(
                openauthUrl
            )}`;
            // 当前页面处在支付宝中,无需跳转
            window.location.href = /Alipay/i.test(navigator.userAgent) ? openauthUrl : openAlipayUrl;
        },
        // 获取url参数
        setUrlParam(url, key, val) {
            url = url || window.location.href;
            if (this.getUrlParam(key, url)) {
                return url;
            } else {
                return `${url}${url.indexOf('?') < 0 ? '?' : '&'}${key}=${val}`;
            }
        },
        // 获取url参数
        getUrlParam(key, url) {
            url = url || window.location.href;
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
        // 处理账户
        processAcc({
            easyPayAccountNo,
            easyPayAccountOpen,
            alipayUserName,
            easyPayOpenResult,
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
                    this.openAccountLink = rysLinkUrl;
                } else {
                    // 完成认证
                    this.pageType = this.PT.openSucess;

                    this.accountName = easyPayAccountNo;
                    this.accountId = alipayUserName;
                }
            } else if (haveLink) {
                // 未开通
                this.pageType = this.PT.notOpen;
                this.openAccountLink = rysLinkUrl;
            } else {
                // 非 168 用户
                this.pageType = this.PT.not168;
                this.modalText = easyPayOpenResult || '';
            }
        }
    }
};
</script>
<style lang="less">
.financing-collection-inner-use {
    -webkit-font-smoothing: antialiased;

    .som-button--plain--primary {
        color: @blue;
    }
    .som-modal__bd {
        margin-bottom: 0;
        font-size: 18px;
        line-height: 1.5;
    }

    .som-button--plain--primary:not(.som-button--plain-disabled):active {
        color: #fff;
        border-color: @blue;
        background-color: @blue;
    }
}
</style>

<style lang="less" scoped>


.financing-collection {
    width: 91.47%;
    margin: 76px auto 0;

    .alipay-tips {
        margin: -44px 2.92% 0;

        .alipay-tips-img {
            float: left;
            width: 14.8%;
            padding-right: 4.9%;
        }
        .alipay-tips-text {
            float: left;
            width: 79%;

            .alipay-tips-head {
                color: #1a1a1a;
                font-weight: bold;
                font-size: 18px;
            }
            .alipay-tips-cont {
                padding-top: 4px;
                font-size: 14px;
            }
        }
    }

    .status-icon {
        width: 48px;
        height: 48px;
    }

    .pass-audit {
        .status-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;

            span {
                margin-left: 16px;
                color: #1a1a1a;
                font-weight: bold;
                font-size: 18px;
            }
        }
        .open-account {
            color: #1a1a1a;
            font-size: 14px;

            .open-account-title {
                font-weight: bold;
                font-size: 16px;
            }
            .open-account-link {
                margin: 4px 0;
                word-break: break-all;
                word-wrap: break-word;
            }
            .open-account-tips {
                color: #666;
            }
            .btn-wrap {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 62.2%;
                margin: 28px auto 32px;

                .o-a-btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 80px;
                    height: 26px;
                    font-size: 13px;
                    border-radius: 100px;

                    &:active {
                        transform: translate(1px, 1px);
                        opacity: 0.9;
                    }
                }
                .reload-page {
                    color: #333;
                    background: #f0f0f0;
                }
                .copy-link {
                    color: #fff;
                    background: linear-gradient(90deg, #3690ff, #3665ff);
                }
            }
        }
    }
    .open-sucess {
        display: flex;
        margin-bottom: 32px;

        .status-icon {
            margin-right: 16px;
        }
        .acc-info {
            span {
                display: block;
                margin-bottom: 10px;
                color: #1a1a1a;
                font-weight: bold;
                font-size: 18px;
            }
            p {
                color: #1a1a1a;
                font-size: 14px;
                word-break: break-all;
                word-wrap: break-word;
            }
        }
    }

    .one-pixel {
        .border-top(#d9d9d9);
    }
    .rys-instruction {
        padding-top: 28px;
        color: #666;
        font-size: 14px;
        line-height: 1.5;
    }
}
</style>
