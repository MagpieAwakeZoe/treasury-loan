<template>
    <div class="pg-user-login">
        <h1>密码登录</h1>
        <form action="javascript:void(0)">
            <div class="input-item">
                <som-input  type="tel" placeholder="请输入手机号" v-model="form.username"></som-input>
            </div>
            <div class="input-item">
                <som-input :type="pwdType" placeholder="请输入密码" v-model="form.password">
                    <span slot="right" class="toggle-pwd" :class="{'visible': pwdVisible}" @click="togglePwd"></span>
                </som-input>
            </div>
            <som-button :gradients="['#3684FF', '#3665FF']" @click="submit" class="submit" :delayTime="2000">登录</som-button>
            <div class="options">
                <router-link to="get-password">忘记密码？</router-link>
                <!-- <div @click="showRegModal = true">立即注册</div> -->
            </div>
        </form>
         <som-modal v-model="showRegModal"
                   title="暂不能注册"
                   cancel-text="取消"
                   confirm-text="联系客服"
                   is-confirm
                   @on-cancel="showApplyModal = false"
                   @on-confirm="call">
                   <div class="regmodal-content">
                       本业务暂未开放自主注册<br/>请联系客服进行申请
                   </div>
        </som-modal>
    </div>
</template>

<script>
    import Api from '@/api';
    import SsoInstance from '@/api/sso/instance';

    export default {
        name: 'login',
        data () {
            return {
                form: {
                    username: '',
                    password: ''
                },
                showRegModal: false,
                pwdVisible: false
            };
        },
        computed: {
            pwdType () {
                return this.pwdVisible ? 'text' : 'password';
            }
        },
        methods: {
            togglePwd () {
                this.pwdVisible = !this.pwdVisible;
            },
            call () {
                location.href = 'tel:400-222'; // 总部自营渠道暂没有客服电话
                this.showRegModal = false;
            },
            submit () {
                if (!this.form.username || this.form.username.length !== 11) {
                    return this.$som.toast.text('请输入11位手机号码');
                }
                if (!this.form.password) {
                    return this.$som.toast.text('请输入密码');
                }
                Api.sso.accountApi_loginMerge(this.form).then((res) => {
                    let callbackUrl = `${location.origin}${location.pathname}#/index?channel=zbzy`;
                    location.href = `${SsoInstance.baseUrl()}${res}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
                });
            }
        },
        mounted () {
            this.$setBodyBack('#fff');
        }
    };
</script>

<style lang="less">

    .pg-user-login {
        padding: 0 24px;
        h1{
            margin: 50px 0;
            color: #292F41;
            font-size: 32px;
            font-weight: bold;
        }
        form{
            .input-item{
                margin-bottom: 16px;
                color: #292F41;
                .border-bottom(#D2D5D8);
                .som-list-item{
                    padding: 0;
                    height: 40px;
                    font-size: 16px;
                    line-height: 40px;
                }
            }
            .toggle-pwd{
                width: 20px;
                height: 14px;
                display: inline-block;
                background: center / contain no-repeat url('~@/assets/images/eye.png');
                margin: 0 0 0 8px;
                vertical-align: sub;
                &.visible{
                    background: center / contain no-repeat url('~@/assets/images/eye-blue.png');
                }
            }
            .submit{
                margin-top: 48px;
            }
            .options{
                margin-top: 12px;
                display: flex;
                justify-content: space-between;
            }
        }
        .regmodal-content{
            margin-top: 16px;
        }
    }
</style>
