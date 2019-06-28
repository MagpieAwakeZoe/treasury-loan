<template>
    <div class="pg-select-payment-account">
        <title-bar>{{editStatus ? '选择':'编辑'}}收款账户
            <span slot="right" v-if="showBtn" @click="toggleBtn">{{editStatus ? '编辑':'完成'}}</span>
        </title-bar>
        <ul class="list" v-if="list.length">
            <div v-transfer-dom>
                            <som-modal v-model="showModalStatus"
                                is-confirm
                                title="确定删除该收款账户"
                                @on-confirm="onConfirm">
                            </som-modal>
                        </div>
            <li v-for="(item,index) in list" :key="index" @click="jumpToStartOrder(item)">
                <div class="content">
                        <p>{{(item.dealerBankAccountNumber).replace(/\s/ig, '').replace(/(.{4})/g, '$1 ')}}</p>
                        <p class="gray">户名:&nbsp;{{item.dealerAccountName}}
                            <span v-if="rubbshStatus" class="icon-grey-delete rubbsh" @click="showModal(item.dealerBankId)"></span>
                            <span class="icon-checkbox yes-icon" v-if="lastSelected.replace(/\s/ig, '') === item.dealerBankAccountNumber && editStatus"></span></p>
                        <p class="gray">开户行:&nbsp;{{item.dealerBankName}}</p>
                </div>
            </li>
        </ul>
        <no-data v-else-if="!loading">暂无收款账户，请点击"新增"增加收款账户</no-data>
        <fixed-bottom v-if="addBtnStatus || !list.length">
            <som-button :gradients="['#3684FF', '#3665FF']" @click="goAddAccount"
            :delayTime="2000" class="save" >新增收款账户</som-button>
        </fixed-bottom>
    </div>
</template>

<script>
import Api from '@/api';
import ListCarInfo from '@/components/list-car-info.vue';
import NoData from '@/components/no-data.vue';
import fixedBottom from '@/components/fixed-bottom.vue';

export default {
    name: 'SelectPaymentAccount',
    data () {
        return {
            list: [],
            loading: true,
            editStatus: true,
            rubbshStatus: false,
            addBtnStatus: true,
            showModalStatus: false,
            dealerBankId: '',
            // lastSelected: JSON.parse(localStorage.getItem('treasury-loan-account')).dealerBankAccountNumber
            lastSelected: JSON.parse(localStorage.getItem('treasury-loan-detail')).dealerBankAccountNumber
        };
    },
    components: {
        ListCarInfo,
        NoData,
        fixedBottom
    },
    methods: {
            //页面数据渲染
        pageRender () {
            Api.fsc.v1_dealerBankApi_getDealerFrequentBankAccount().then((res) => {
                this.loading = false;
                this.list = res;
            }).catch(() => {
                this.loading = false;
            });
        },
        goAddAccount () {
            // 跳转添加账户
            this.$router.push({name: 'addPaymentAccount', query: {orderId: this.$route.query.orderId}});
        },
        toggleBtn () {
            this.editStatus = !this.editStatus;
            this.rubbshStatus = !this.rubbshStatus;
            this.addBtnStatus = !this.addBtnStatus;
        },
        //对话框
        showModal (id) {
            this.showModalStatus = !this.showModalStatus;
            this.dealerBankId = id;
        },
        //对话框确定后的操作
        onConfirm () {
            Api.fsc.v1_dealerBankApi_deleteDealerFrequentBankAccount({
                dealerBankId: this.dealerBankId
            }).then(() => {
                this.pageRender();
                localStorage.removeItem('treasury-loan-account');
            });
        },
        jumpToStartOrder (item) {
            localStorage.setItem('treasury-loan-account', JSON.stringify(item));
            if (this.editStatus) {
                this.$router.go(-1);
            }
        }
    },
    computed: {
        showBtn () {
            return this.list.length > 0;
        }
    },
    mounted () {
        this.$setBodyBack('#f2f2f2');
        this.pageRender();
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-select-payment-account{
    .list{
        margin-bottom: 52px;
        li {
            padding-left: 16px;
            background: #fff;
            margin-bottom: 2px;
                .gray{
                    color: #666;
                    font-size: 14px;
                    width: 85%;
                }
        }
        .title{
            color: #666;
            line-height: 46px;
            .border-bottom();
        }
        .content{
            font-size: 16px;
            padding: 16px 16px 6px 0;
            position: relative;
            .border-bottom();
            .info{
                color: #666;
            }
            p{
                margin-bottom: 4px;
            }
            .rubbsh{
                position: absolute;
                top: 40%;
                left: 88%;
            }
        }
        .status{
            color: @primary;
            padding: 16px 16px 16px 0;
        }
        .yes-icon{
            background: url("~@/assets/images/selected-account.png") no-repeat center;
            // background: url("~@/assets/images/checked.png") no-repeat center;
            position: absolute;
            top: 40%;
            left: 88%;

        }
    }
}
</style>
