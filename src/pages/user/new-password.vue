<template>
    <div class="pg-user-newpassword">
        <h1>设置密码</h1>
        <form action="javascript:void(0)">
            <div class="input-item">
                <som-input  :type="pwdVisible1 ? 'text' : 'password'" placeholder="请输入密码" v-model="form.newPassword" :max="16">
                    <span slot="right" class="toggle-pwd" :class="{'visible': pwdVisible1}"
                    @click="togglePwd('1')"></span>
                </som-input>
            </div>
            <div class="input-item">
                <som-input :type="pwdVisible2 ? 'text' : 'password'" placeholder="请再次输入密码" v-model="form.newPassword2" :max="16">
                    <span slot="right" class="toggle-pwd" :class="{'visible': pwdVisible2}"
                    @click="togglePwd('2')"></span>
                </som-input>
            </div>
            <p>密码由8～16位数字和字母组成，字母区分大小写</p>
            <som-button :gradients="['#3684FF', '#3665FF']" @click="submit" class="submit" :delayTime="2000">确定</som-button>
        </form>
    </div>
</template>

<script>
    import Api from '@/api';

    export default {
        name: 'newPassword',
        data () {
            return {
                form: {
                    newPassword: '',
                    newPassword2: ''
                },
                pwdVisible1: false,
                pwdVisible2: false
            };
        },
        methods: {
            togglePwd (index) {
                this[`pwdVisible${index}`] = !this[`pwdVisible${index}`];
            },
            submit () {
                let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
                if (!this.form.newPassword || !this.form.newPassword2) {
                    return this.$som.toast.text('请输入密码');
                }
                if (this.form.newPassword !== this.form.newPassword2) {
                    return this.$som.toast.text('两次密码输入不一致');
                }
                if (!reg.test(this.form.newPassword)) {
                    return this.$som.toast.text('请按照规则设置密码');
                }
                Api.sso.phoneCode_updatePwd({
                    ...this.form,
                    ...this.$route.query
                }).then(() => {
                    this.$som.toast.text('设置成功');
                    setTimeout(() => {
                        this.$router.replace('login');
                    }, 200);
                });
            }
        },
        mounted () {
            this.$setBodyBack('#fff');
        }
    };
</script>

<style lang="less">

    .pg-user-newpassword {
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
                margin-top: 20px;
            }
        }
    }
</style>
