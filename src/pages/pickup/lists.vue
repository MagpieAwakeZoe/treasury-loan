<template>
    <div class="pg-pickup-lists">
        <title-bar>提车申请
            <template slot="right">
                <span @click="$router.push('/pickup-records/allorder')">提车记录</span>
            </template>
        </title-bar>
        <div class="fixed-top">
            <notice-bar>
            未做业务的车辆发起提车申请后，不允许修改或取消
            </notice-bar>
            <som-search-bar  type="light" placeholder="请输入车型/车架号后六位" :is-cancel="searchFocus"
                v-model="fuzzyQueryParam"
                ref="search"
                @on-focus="searchFocus = true"
                @on-cancel="searchCancel"
                @on-submit="search">
            </som-search-bar>
            <som-tabs>
                <som-tab-item :selected="$route.path === '/pickup-list/allorder'" @on-item-click="switchTab('allorder')">
                    已做业务
                </som-tab-item>
                <som-tab-item :selected="$route.path === '/pickup-list/noorder'" @on-item-click="switchTab('noorder')">
                    未做业务
                </som-tab-item>
            </som-tabs>
        </div>
        <!-- <no-data v-if="orderCarList.length === 0 && !searchFlag && !loading">暂无可提车辆</no-data> -->
        <router-view class="view-container"></router-view>
    </div>
</template>

<script>
import FixedBottom from '@/components/fixed-bottom.vue';
import NoticeBar from '@/components/common/notice-bar.vue';
/*
    stockStatus:
    10, "待起运",
    20, "待入库",
    30, "待出库",
    40, "已出库",
    50, "已交车";
*/

export default {
    name: 'pickupLists',
    data () {
        return {
            fuzzyQueryParam: '',
            searchFocus: false
        };
    },
    components: {
        FixedBottom,
        NoticeBar
    },
    methods: {
        switchTab (path) {
            this.fuzzyQueryParam = '';
            this.$store.commit('pickupList/search', this.fuzzyQueryParam);
            this.$router.replace({
                path: `/pickup-list/${path}`,
                query: {
                    orderId: this.$route.query.orderId
                }
            });
        },
        search () {
            this.$refs.search.setBlur();
            this.searchFocus = false;
            this.$store.commit('pickupList/search', this.fuzzyQueryParam);
        },
        searchCancel () {
            this.fuzzyQueryParam = '';
            this.search();
        }
    },
    mounted () {
        this.$setBodyBack();
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-pickup-lists{
    // reset
    .som-search-bar__result{
        font-size: 14px;
    }
    .fixed-top{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
    }
    .view-container{
        margin: 178px 0 0 0;
        height: ~"calc(100vh - 130px)";
    }
    @media screen and (max-width: 320px)  {
        .view-container{
            margin: 198px 0 0 0;
            height: ~"calc(100vh - 150px)";
        }
    }
}
</style>
