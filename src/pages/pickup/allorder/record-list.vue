<template>
    <div class="pg-pickup-records-list">
        <som-scroll-refresh v-if="list.length" :prevent-default="true" :pull-up="getData">
            <ul class="list">
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
        </som-scroll-refresh>
        <no-data v-else-if="!loading">暂无提车记录</no-data>
    </div>
</template>

<script>
import Api from '@/api';
import ListCarInfo from '@/components/list-car-info.vue';
import NoData from '@/components/no-data.vue';
import Pages from '@/mixins/pages';

export default {
    name: 'pickupRecordAllOrder',
    data () {
        return {
            loading: true
        };
    },
    mixins: [Pages],
    components: {
        ListCarInfo,
        NoData
    },
    methods: {
        goDetail (item) {
            // 跳转提车详情
            this.$router.push({name: 'pickupDetail', query: {orderId: item.orderId, carPickUpId: item.carPickUpId}});
        },
        getData (e) {
            this.page.current ++;
            if (this.results.totalPage !== 0 && this.results.totalPage < this.page.current) {
                e && e.completed();
                return;
            }
            this.loading = true;
            Api.fsc.v1_carPickUpApi_getAllPickupRecordList({...this.page}).then((res) => {
                e && e.loaded();
                this.loading = false;
                this.results = res;
                this.list = this.list.concat(res.items);
                if (this.list.length === 0) this.$setBodyBack('#ffff');
            }).catch(() => {
                e && e.loaded();
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


.pg-pickup-records-list{
    .list{
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
