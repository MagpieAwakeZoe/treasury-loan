<template>
    <div class="pg-add-payment-account">
        <title-bar>新增收款账户</title-bar>
        <div class="notice-bar">
            <!-- 提车人信息为库管核实依据，请确保与实际提车人一致，以免延误提车，提车请携带有效身份证件 -->
            &nbsp;
        </div>
        <som-list label-width="100px" style="margin: 12px 0">
            <som-input :show-clear="false" title="<i class='require-icon' style='color: transparent'>*</i>账户类型"
                        placeholder="账户类型"  value="对公账户" readonly style="color: #999">
            </som-input>
        </som-list>
        <som-list label-width="100px">
            <som-textarea :show-clear="false" title="<i class='require-icon'>*</i>账户名称" :max="50"
                     @on-blur="trim"  placeholder="请输入账户" v-model="form.dealerAccountName" :rows="1" :autosize="autosize" :show-counter="false">
            </som-textarea>
            <som-input :show-clear="false" title="<i class='require-icon'>*</i>收款账号"
                       placeholder="请输入收款账号" v-model="form.dealerBankAccountNumberSpace" @on-blur="addSpace" type="tel">
            </som-input>
            <som-input type="tel" :show-clear="false" title="<i class='require-icon'>*</i>开户银行"
                       placeholder="请选择" v-model="form.dealerHeadBankName" @click.native="bankBehavior" readonly>
                       <som-icon :size="16" name="arrow-right" slot="right" color="#bfbfbf"></som-icon>
            </som-input>
            <div class="branch-bank">
            <som-icon :size="16" name="arrow-right" slot="label" color="#bfbfbf" class="right-icon"></som-icon>
            <som-textarea :show-clear="false" title="<i class='require-icon'>*</i>开户支行"
                       placeholder="请选择" v-model="form.dealerBankName" @click.native="branchBankBehavior" readonly :rows="1" :autosize="autosize" :show-counter="false">
            </som-textarea>
            </div>
        </som-list>
        <fixed-bottom>
            <som-button :gradients="['#3684FF', '#3665FF']" @click="submit"
            :delayTime="2000" class="save">保存</som-button>
        </fixed-bottom>
          <bank-selector v-model="showBank"
                       :title="title"
                       @selected="selectedBank"></bank-selector>
        <branch-bank-selector :bankId="supplierHeadBankId"
                              :title="title"
                              v-model="showBranchBank"
                              @selected="selectedBranchBank"></branch-bank-selector>
    </div>
</template>

<script>
import Api from '@/api';
import fixedBottom from '@/components/fixed-bottom.vue';
import BankSelector from '@/components/selector/bank-selector';
import BranchBankSelector from '@/components/selector/branch-bank-selector';

export default {
    name: 'AddPaymentAccount',
    data () {
        return {
            form: {
                dealerAccountName: '',                 //开户名称
                dealerCNAPSCode: '',                //库融贷车商支行联行号
                dealerBankAccountNumberSpace: '',   //库融贷车商支行银行账号,带空格
                dealerBankAccountNumber: '',         //库融贷车商支行银行账号
                dealerBankName: '',                //开户支行的名称
                dealerHeadBankName: '',             //开户总行名称
                dealerHeadCNAPSCode: '',             //开户总行联行号
                dealerBankType: 0 // 账户类型 0：对公 1：对私
            },
            supplierHeadBankId: '',              //id,不必添加
            title: '',
            showBank: false,
            showBranchBank: false,
            autosize: {
                maxHeight: 60,
                minHeight: 20
            }
        };
    },
    components: {
        fixedBottom,
        BankSelector,
        BranchBankSelector
    },
    methods: {
        bankBehavior () {
            this.showBank = true;
            this.form.dealerBankName = '';
        },
        branchBankBehavior () {
            if (!this.form.dealerHeadBankName) {
                this.$som.toast.text('请选择开户银行');
            } else {
                this.showBranchBank = true;
            }
        },
        selectedBank (res) {
            this.form = Object.assign({}, this.form, {
                    dealerHeadBankName: res.name, // 供应商开户银行 总行
                    dealerHeadCNAPSCode: res.code, // 供应商开户银行 总行联行号
                });

            this.supplierHeadBankId = res.id;   // 供应商开户银行 总行 ID
        },
        selectedBranchBank (res) {
            this.form = Object.assign({}, this.form, {
                    dealerBankName: res.name, // 供应商开户银行 支行
                    dealerCNAPSCode: res.code, // 开户行联行号
                });
        },
        submit () {
            if (this.validForm()) {
                this.addNewPaymentAccount();
            }
        },
        //每4位银行卡号加一个空格
        addSpace () {
            this.form.dealerBankAccountNumberSpace = this.form.dealerBankAccountNumberSpace.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ');
            this.form.dealerBankAccountNumber = this.form.dealerBankAccountNumberSpace.replace(/\s+/g, '');
        },
        validForm () {
            if (!this.form.dealerAccountName) {
                this.$som.toast.text('请输入账户名称');
                return false;
            }
            if (!this.form.dealerBankAccountNumber) {
                this.$som.toast.text('请输入收款账号');
                return false;
            }
            if (!this.form.dealerHeadBankName) {
                this.$som.toast.text('请选择开户行');
                return false;
            }
            if (!this.form.dealerBankName) {
                this.$som.toast.text('请选择开户支行');
                return false;
            }
            if (!/^\d*$/g.test(this.form.dealerBankAccountNumber)) {
                this.$som.toast.text('请输入数字');
                return false;
            }
            if (this.form.dealerBankAccountNumber.length > 25) {
                this.$som.toast.text('银行账号过长');
                return false;
            }
            return true;
        },
        trim () {
            this.form.dealerAccountName = this.form.dealerAccountName.replace(/\s+/g, '');
        },
        addNewPaymentAccount () {
            Api.fsc.v1_dealerBankApi_addDealerFrequentBankAccount({...this.form}).then(() => {
                this.$router.go(-1);
            });
        },
        //获取经销商信息
        getCompanyName () {
            Api.fsc.v1_accessApplyApi_getAccessInfo().then((res) => {
                this.form.dealerAccountName = res.licenseCompanyName;
            });
        }
    },
    mounted () {
        this.getCompanyName();
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-add-payment-account{
    // reset
    .som-input--disabled .som-list-item__bd, .som-input--disabled .som-list-item__hd{
        color: #1a1a1a;
    }
    .som-input__elm:disabled{
        background: none;
        color: #1a1a1a;
    }
    .notice-bar{
        background: #FFF2BD;
        padding: 0 16px;
        font-size: 14px;
        line-height: 0;
        color: @primary;
    }
    .som-textarea__elm{
        padding-left: 12px;
        width: 86%
    }
    .branch-bank{
        position: relative;
        .right-icon{
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
        }
    }
}
</style>
