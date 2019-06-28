<template>
    <div class="pg-contractList">
        <title-bar>签署合同</title-bar>
        <div class="list-box">
            <div class="box-container">
            <som-list>
                <som-list-item :title="'签署' + item.contractName" v-for="(item,index) in list" :key="index" @click.native = "judgeContract(index)">
                    <div>
                        <span class="unfinStatus" :class="{ finStatus: item.signStatus }">{{item.signStatus ? '已签署':'未签署'}}<i class="icon-right-arrow"></i></span>
                    </div>
                </som-list-item>
            </som-list>
            </div>
        </div>
        <div v-transfer-dom>
            <som-modal v-model="show"
                class="con-modal"
                title="确认已签署借款合同"
                content="若过程中遇到问题，请联系客服"
                confirm-text="我知道了"
                @on-confirm="onConfirm">
            </som-modal>
        </div>
    </div>
</template>

<script>
import Api from '@/api';

export default {
    name: 'ContractList',
    data () {
        return {
            show: false,
            list: [],
            contractTemplateId: '',
            contractType: '',
            signStatus: ''
        };
    },
    methods: {
        onConfirm () {
           this.$router.go(-1);
        },
        judgeContract(index) {
            let toast = [];
            if (this.list[index].signStatus === 1) {
                return;
            }
            for (let i = 0; i < index; i++) {       //如果是未签署的部分
                if (this.list[i].signStatus === 0) {
                    toast.push(this.list[i].contractName);
                }
            }
            if (toast.length !== 0) {
                this.$som.toast.text(`请先签署${toast.join(' , ')}`);
            } else if (this.list[index].contractPartyType === 0) {
                this.show = true;
                location.href = this.list[index].outContractSignURL;
            } else {
                this.$router.push({
                    path: '/contract',
                    query: {
                        orderId: this.$route.query.orderId,
                        contractType: this.list[index].contractType || '',
                        contractTemplateId: this.list[index].contractTemplateId || '',
                        contractName: this.list[index].contractName
                    }
                });
            }
        }
    },
    mounted () {
        this.$som.loading.hide();
        Api.fsc.v2_contractApi_getContractsSignStatus({orderId: this.$route.query.orderId}).then((res) => {
            this.list = res;
        });
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.con-modal{
    .som-button--plain--primary:not(.som-button--plain-disabled):active {
        color: #FFF;
        border-color: #FFF;
        background-color:  @blue;
    }
    .som-button--plain--primary {
        color: @blue;
    }
    .som-button {
        font-weight: normal;
    }
    .som-modal .som-modal__body-wrap {
        padding: 2px 16px;
    }
}
.pg-contractList{
    .list-box{
        margin: 60px 0 0 0;
        .icon-right-arrow{
            margin:0 0 2px 5px;
        }
        .box-container{
            margin: 60px 0 0 0;
        }
    }
    .unfinStatus{
        color:red;
    }
    .finStatus{
        color:gray;
    }
}
</style>
