<template>
    <div class="pg-pickup-records">
        <title-bar>提车记录</title-bar>
        <som-tabs>
            <som-tab-item :selected="$route.path === '/pickup-records/allorder'" @on-item-click="switchTab('allorder')">
                已做业务
            </som-tab-item>
            <som-tab-item :selected="$route.path === '/pickup-records/noorder'" @on-item-click="switchTab('noorder')">
                未做业务
            </som-tab-item>
        </som-tabs>
        <router-view class="view-container"></router-view>
    </div>
</template>

<script>
export default {
    name: 'pickupRecords',
    methods: {
        switchTab (path) {
            this.$router.replace({
                path: `/pickup-records/${path}`
            });
        }
    },
    mounted () {
        this.$setBodyBack();
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-pickup-records{
    .view-container{
        height: ~"calc(100vh - 88px)";
    }
}
</style>
