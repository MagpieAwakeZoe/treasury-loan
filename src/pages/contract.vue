<template>
    <div class="pg-contract">
        <title-bar>签署{{contractName}}</title-bar>
        <div class="container">
            <div class="iframe-container">
                <iframe :src="url" scrolling="auto" frameborder="no" border="0" ref="iframe" id="iframe"
                        marginwidth="0"
                        marginheight="0"></iframe>
            </div>
            <som-list label-width="80px">
                <div class="checkbox-item">
                    <input type="checkbox" class="icon-checkbox" v-model="form.checked" id="checkbox">
                    <label for="checkbox">我已阅读合同</label>
                </div>
                <som-input :show-clear="false" title="手机号码"  v-model="userData.userPhone" readonly>
                </som-input>
                <som-input type="text" :show-clear="false" title="验证码" placeholder="请输入短信验证码" v-model="form.captcha">
                    <span slot="right" class="line-between"></span>
                    <span slot="right" :style="{ 'color': timeout !== 61 ? '#8D8E99' : '#508CEE' }"
                          @click="sendCode" >{{codeText}}</span>
                </som-input>
            </som-list>
        </div>
        <fixed-bottom>
            <som-button :gradients="['#3684FF', '#3665FF']" @click.native="submit">签署合同</som-button>
        </fixed-bottom>
        <som-modal v-model="show"
                   is-confirm
                   title="声明"
                   confirm-text="同意"
                   cancel-text="取消"
                   @on-confirm="confirm()">
            <div class="modal-content">
                本人已仔细阅读并充分理解《{{contractName}}》的内容，同意并接受合同中的全部约定条款
            </div>
        </som-modal>
    </div>
</template>

<script>
import Api from '@/api';
import fixedBottom from '@/components/fixed-bottom.vue';

export default {
    name: 'Contract',
    data () {
        return {
            form: {
                captcha: '',
                checked: false
            },
            contractName: '',               //合同名称
            codeText: '获取验证码',
            timeout: 61,
            url: '',
            show: false
        };
    },
    components: {
        fixedBottom
    },
    computed: {
        userData: function () {
            return this.$store.state.userData;
        }
    },
    methods: {
        sendCode () {
            if (this.timeout === 61) {
                Api.fsc.v1_contractApi_getCaptcha({
                    orderId: this.$route.query.orderId,
                    userMobile: this.userData.userPhone
                }).then(() => {
                    let timer = setInterval(() => {
                        this.codeText = `${--this.timeout}s后重发`;
                        if (this.timeout === -1) {
                            clearInterval(timer);
                            this.timeout = 61;
                            this.codeText = '重发验证码';
                        }
                    }, 1000);
                });
            }
        },
        submit () {
            if (!this.form.checked) {
                return this.$som.toast.text('请确认勾选“我已阅读合同”');
            }
            if (!this.form.captcha) {
                return this.$som.toast.text('请输入验证码');
            }
            this.show = true;
        },
        confirm () {
            Api.fsc.v1_contractApi_signServiceContract({
                orderId: this.$route.query.orderId,
                contractTemplateId: this.$route.query.contractTemplateId || '',
                contractType: this.$route.query.contractType || '',
                captcha: this.form.captcha,
                userMobile: this.userData.userPhone
            }).then(() => {
                this.$router.go(-1);
            });
        }
    },
    mounted () {
        this.$som.loading.hide();
        this.url = Api.fsc.v2_contractApi_getContractTemplate({
            _security_token_inc: this.userData.userToken,
            orderId: this.$route.query.orderId,
            contractType: this.$route.query.contractType || '',
            contractTemplateId: this.$route.query.contractTemplateId || ''
        });
        this.contractName = this.$route.query.contractName;
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-contract{
    .container{
        background: #fff;
        margin-bottom: 80px;
    }
    .iframe-container{
        width: 100%;
        height: 50vh;
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        margin-bottom: 30px;
        iframe{
            width: 100%;
            height: 100%;
            border: none;
        }
    }
    .checkbox-item{
        height: 50px;
        line-height: 50px;
        padding-left: 16px;
    }
    .line-between{
        .border-right();
        margin-right:22px;
        height: 10px;
    }
    .modal-content{
        line-height: 22px;
        margin-top: 12px;
        text-align: left;
    }
}
</style>
