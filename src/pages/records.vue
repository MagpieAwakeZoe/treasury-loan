<template>
    <div class="pg-records">
        <title-bar>记录</title-bar>
        <som-tabs class="fixed-top">
            <som-tab-item :selected="$route.path === '/records/order-repayment'" @on-item-click="switchTab('order-repayment')">
                还款记录
            </som-tab-item>
            <som-tab-item :selected="$route.path === '/records/order-pickup'" @on-item-click="switchTab('order-pickup')">
                提车记录
            </som-tab-item>
        </som-tabs>
        <router-view class="view-container"></router-view>
        <fixed-bottom v-if="carList.length">
            <som-button :gradients="['#3684FF', '#3665FF']" @click.native="toPickup">发起提车申请({{carList.length}})</som-button>
        </fixed-bottom>
    </div>
</template>

<script>
import Api from '@/api';
import FixedBottom from '@/components/fixed-bottom.vue';

export default {
    name: 'Records',
    data () {
        return {
            carList: []
        };
    },
    components: {
        FixedBottom
    },
    methods: {
        switchTab (path) {
            this.$router.replace({
                path: `/records/${path}`,
                query: {
                    orderId: this.$route.query.orderId
                }
            });
        },
        toPickup () {
            this.$router.push({path: '/order-pickup-list', query: {orderId: this.$route.query.orderId}});
        }
    },
    mounted () {
        // 获取可提车数量
        Api.fsc.v1_carApi_getAllCarToPick({
            orderId: this.$route.query.orderId
        }).then((res) => {
            this.carList = res.carList;
        });
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-records{
    .view-container{
        //height: ~"calc(100vh - 100px)";
        margin-top: 88px;
    }
    .fixed-top{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 2;
    }
}
</style>
