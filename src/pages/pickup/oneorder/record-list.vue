<template>
    <div class="pg-order-pickup-record">
        <ul class="list" v-if="list.length">
            <li v-for="(item, $index) in list" @click="goDetail(item)" :key="$index">
                <div class="title">{{item.carPickUpDateCreate}}</div>
                <div class="content">
                    <div class="car" v-for="(car, $index) in item.carList" :key="$index">
                        <list-car-info :data="car" :bold="true"></list-car-info>
                    </div>
                    <img src="~@/assets/images/deal-doing.png" class="status-img" v-if="item.agencyStatus === 1">
                    <img src="~@/assets/images/deal-done.png" class="status-img" v-if="item.agencyStatus === 2">
                </div>
                <div class="status">
                    {{item.pickUpStatus === 10 ? '已发起提车申请，请携带身份证前往仓库提车' : '提车完成'}}
                </div>
            </li>
        </ul>
        <no-data v-else-if="!loading">暂无提车记录</no-data>
    </div>
</template>

<script>
import Api from '@/api';
import ListCarInfo from '@/components/list-car-info.vue';
import NoData from '@/components/no-data.vue';

export default {
    name: 'pickupRecord',
    data () {
        return {
            list: [],
            loading: true
        };
    },
    components: {
        ListCarInfo,
        NoData
    },
    methods: {
        goDetail (item) {
            // 跳转提车详情
            this.$router.push({name: 'pickupDetail', query: {orderId: item.orderId, carPickUpId: item.carPickUpId}});
        },
        getData () {
            Api.fsc.v1_carPickUpApi_getOrderPickupRecordList({
                orderId: this.$route.query.orderId
            }).then((res) => {
                this.loading = false;
                this.list = res;
                if (this.list.length === 0) this.$setBodyBack('#ffff');
            }).catch(() => {
                this.loading = false;
                this.$setBodyBack('#fff');
            });
        }
    },
    mounted () {
        this.$setBodyBack();
        this.getData();
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-order-pickup-record{
    .list{
        margin-bottom: 80px;
        li {
            padding-left: 16px;
            background: #fff;
            margin-bottom: 12px;
        }
        .title{
            color: #666;
            line-height: 46px;
            .border-bottom();
        }
        .content{
            padding: 16px 16px 6px 0;
            position: relative;
            .cp-list-car-info{
                margin-bottom: 10px;
            }
            .border-bottom();
            .info{
                color: #666;
            }
            .status-img{
                position: absolute;
                z-index: 2;
                right: 0;
                bottom: 0;
                width: 50px;
                height: 50px;
            }
        }
        .status{
            color: @primary;
            padding: 16px 16px 16px 0;
        }
    }
}
</style>
