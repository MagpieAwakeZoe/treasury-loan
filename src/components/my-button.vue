<template>
  <button class="my-button">
      <slot></slot>
  </button>
</template>

<script>
export default {
    name: 'myButton'
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.my-button{
    text-align: center;
    color: #fff;
    padding: 0 10px;
    min-width: 80px;
    font-size: 13px;
    height: 26px;
    border-radius: 16px;
    outline: none;
    -webkit-appearance: none;
    border: none;
    box-sizing: border-box;
    background: linear-gradient(90deg, rgb(54, 132, 255), rgb(54, 101, 255));
    display: inline-block;
}
</style>
