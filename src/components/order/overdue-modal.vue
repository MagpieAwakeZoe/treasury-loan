<template>
    <div class="co-overdue-modal" v-if="innerShow">
        <som-modal
            is-confirm
            v-model="innerShow"
            title="订单逾期通知">
            <div class="content">
                <p>截止今日您的逾期订单待还款金额：</p>
                <p>待还本金: <span>{{data.toRepayPrinAmt | reverseYuan}} 元 </span></p>
                <p>待还利息: <span>{{data.toRepayAmt | reverseYuan}} 元 </span></p>
                <p>待还总额: <span class="text-primary bold">{{data.toRepayIntAmt | reverseYuan}} 元 </span></p>
                <p>请将逾期的金额充值到您的企业支付宝中（账号一般为XXX@XX.com），等待资方扣除结清后，您就能还款其他正常订单的车辆</p>
            </div>
            <som-button slot="footer" @click.native="clickKnow">我知道了</som-button>
        </som-modal>
    </div>
</template>

<script>
    export default {
        name: 'overdue-modal',
        props: {
            data: {
                type: Object,
                default: () => {}
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        model: {
            prop: 'show',
            event: 'switchShow'
        },
        data() {
            return {
                innerShow: false
            };
        },
        created() {
            this.innerShow = this.show;
        },
        watch: {
            show (val) {
                this.innerShow = val;
            },
        },
        methods: {
            clickKnow () {
                this.$emit('switchShow', false);
            }
        }
    };
</script>

<style lang="less" scoped>
    .co-overdue-modal {
        background-color: #FFFAEB;
        padding: 12px 16px;
        .content {
            padding-top: 15px;
            font-size: 14px;
            text-align: left;
            line-height: 1.7;
            span {
                padding-left: 5px;
            }
        }
        .som-button:after {
            border: none;
            border-radius: 0;
        }
        .som-button {
            border: none;
            border-radius: 0;
        }
        .som-button--default {
            color: @blue;
        }
    }
</style>
