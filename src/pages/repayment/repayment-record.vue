<template>
    <div class="pg-repayment-record">
        <title-bar>还款记录</title-bar>
        <som-scroll-refresh :prevent-default="true" v-if="list.length" :pull-up="getData">
            <ul class="list" v-if="list.length">
                <li v-for="(item, $index) in list" @click="goDetail(item)" :key="$index">
                    <div class="title">{{item.dateCreate}}</div>
                    <div class="content">
                        <div class="car" v-for="(car, $index) in item.carList" :key="$index">
                            <list-car-info :data="car" :bold="true"></list-car-info>
                        </div>
                        <div class="money">还款总额: <span class="text-primary">{{item.totalRepayAmount | reverseYuan}}元</span></div>
                    </div>
                    <div class="footer" v-if="item.repaymentStatusDesc || [10, 20, 40, 50, 70].indexOf(item.repaymentStatus) > -1">
                        <div class="status" :class="{'grey': item.repaymentStatus === 60}">{{item.repaymentStatusDesc}}</div>
                        <my-button v-if="[10, 20, 40, 50].indexOf(item.repaymentStatus) > -1 || (item.repaymentStatus === 70 && item.capitalAscription !== 10)">
                            {{item.repaymentStatus | buttonText}}
                        </my-button>
                    </div>
                </li>
            </ul>
        </som-scroll-refresh>
        <no-data v-else-if="!loading">暂无还款记录</no-data>
    </div>
</template>

<script>
import Api from '@/api';
import ListCarInfo from '@/components/list-car-info.vue';
import myButton from '@/components/my-button.vue';
import NoData from '@/components/no-data.vue';
import Pages from '@/mixins/pages';

export default {
    name: 'repaymentRecord',
    data () {
        return {
            height: 'calc(100vh - 44px)',
            loading: true
        };
    },
    mixins: [Pages],
    components: {
        ListCarInfo,
        myButton,
        NoData
    },
    methods: {
        goDetail (item) {
            // 跳转还款详情
            this.$router.push({name: 'repaymentDetail', query: {orderId: item.orderId, repaymentId: item.repaymentId}});
        },
        getData (e) {
            this.page.current ++;
            if (this.results.totalPage !== 0 && this.results.totalPage < this.page.current) {
                e && e.completed();
                return;
            }
            this.loading = true;
            Api.fsc.v1_repaymentApi_getAllRepaymentRecords({...this.page}).then((res) => {
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
    filters: {
        buttonText: (value) => {
            let text = '';
            switch (value) {
                case 10:
                    text = '确认还款';
                    break;
                case 20:
                case 50:
                    text = '上传转账凭证';
                    break;
                case 40:
                case 70:
                    text = '查看转账凭证';
                    break;
            }
            return text;
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


.pg-repayment-record{
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
            padding: 16px 16px 16px 0;
            position: relative;
            .cp-list-car-info{
                margin-bottom: 10px;
            }
            .border-bottom();
            .info,.money{
                color: #666;
            }
            .money{
                span{
                    font-weight: bold;
                }
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
        .footer{
            height: 50px;
            padding: 0 16px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .status{
                color: @primary;
                flex: 1;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 1;
                overflow: hidden;
                height: 14px ;
                margin-right: 20px;
                &.grey{
                    color: #999999;
                }
            }
        }
    }
}
</style>
