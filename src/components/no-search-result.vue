<template>
    <div class="no-search-result">
        <div class="n-s-r-content">
            <img src="~@/assets/images/no-search-result.png">
            <p>未搜索到结果</p>
        </div>
        <div class="n-s-r-place"></div>
    </div>
</template>

<script>
// 无搜索结果
export default {
    name: 'noSearchResult',
    data: () => ({})
};
</script>

<style lang="less" scoped>
.no-search-result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    width: 100%;
    height: 100%;

    .n-s-r-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-self: center;
        flex: 2;

        img {
            display: block;
            width: 140px;
            height: 135px;
        }
        p {
            margin-top: 20px;
            color: #999;
            font-size: 14px;
            text-align: center;
        }
    }
    .n-s-r-place {
        width: 100%;
        flex: 1;
    }
}
</style>
