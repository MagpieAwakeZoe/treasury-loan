<template>
  <div class="cancel-button">
      <img src="~@/assets/images/cancel.png" class="icon">
      <div><slot></slot></div>
  </div>
</template>

<script>
export default {
    name: 'cancelButton'
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.cancel-button{
    text-align: center;
    display: inline-block;
    min-width: 100px;
    line-height: 1;
    height: 40px;
    color: #444;
    font-size: 12px;
    .icon{
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-bottom: 5px;
    }
}
</style>
