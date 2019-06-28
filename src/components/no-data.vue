<template>
  <div class="no-data">
      <img src="~@/assets/images/empty.png" class="empty">
      <slot></slot>
  </div>
</template>

<script>
export default {
    name: 'noData'
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.no-data{
    text-align: center;
    color: #999;
    font-size: 14px;
    .empty{
        width: 140px;
        display: block;
        padding-top: 95px;
        margin: 0 auto 16px auto;
    }
}
</style>
