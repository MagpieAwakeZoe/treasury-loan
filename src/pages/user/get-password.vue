<template>
    <div class="pg-user-getpassword">
        <h1>重置密码</h1>
        <form action="javascript:void(0)">
            <div class="input-item">
                <som-input  type="tel" placeholder="请输入手机号" v-model="form.username"></som-input>
            </div>
            <div class="input-item">
                <som-input type="tel" placeholder="请输入验证码" v-model="form.code">
                    <span slot="right" class="smscode" :style="{ 'color': timeout !== 61 ? '#8D8E99' : '#508CEE' }"
                          @click="sendCode" >{{codeText}}
                    </span>
                </som-input>
            </div>
            <som-button :gradients="['#3684FF', '#3665FF']" @click="submit" class="submit" :delayTime="2000">下一步</som-button>
        </form>
    </div>
</template>

<script>
    import Api from '@/api';

    export default {
        name: 'getPassword',
        data () {
            return {
                form: {
                    username: '',
                    code: ''
                },
                timeout: 61,
                timer: null,
                codeText: '获取验证码'
            };
        },
        methods: {
            sendCode () {
                if (this.timeout === 61) {
                    if (!this.form.username || this.form.username.length !== 11) {
                        return this.$som.toast.text('请输入11位手机号码');
                    }
                    Api.sso.phoneCode_sendSms({username: this.form.username}).then(() => {
                        this.timer = setInterval(() => {
                            this.codeText = `${--this.timeout}s后重发`;
                            if (this.timeout === -1) {
                                clearInterval(this.timer);
                                this.timeout = 61;
                                this.codeText = '重发验证码';
                            }
                        }, 1000);
                    });
                }
            },
            submit () {
                if (!this.form.username || this.form.username.length !== 11) {
                    return this.$som.toast.text('请输入11位手机号码');
                }
                if (!this.form.code) {
                    return this.$som.toast.text('请输入验证码');
                }
                Api.sso.phoneCode_userCheck(this.form).then((res) => {
                    let {code, username} = this.form;
                    if (res) { // 基础服务不透穿底层短信服务接口的返回结果，只通过data true或false来表明短信服务接口成功失败
                        this.$router.push({path: 'new-password', query: {code, username}});
                    } else {
                        this.$som.toast.text('验证码有误');
                    }
                });
            }
        },
        destroyed() {
            clearInterval(this.timer);
            this.timer = null;
        },
        mounted () {
            this.$setBodyBack('#fff');
        }
    };
</script>

<style lang="less">

    .pg-user-getpassword {
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
            .smscode{
                margin-left: 8px;
                font-size: 16px;
            }
            .submit{
                margin-top: 48px;
            }
        }
    }
</style>
