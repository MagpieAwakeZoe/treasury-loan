<template>
  <div class="fixed-bottom">
      <slot></slot>
  </div>
</template>

<script>
export default {
    name: 'fixedBottom'
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

.fixed-bottom{
    .border-top();
    position: fixed;
    z-index: 9;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 6px 16px;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button .som-button {
        line-height: 100%;
    }
    .som-button + .som-button {
        margin-top: 0;
    }
}
</style>
