<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
require('normalize.css');
require('@/assets/less/basic.less');

export default {
    name: 'app'
};
</script>

<style lang="less">
#app{
    .title-bar+*{
       margin-top: 44px;
    }
}
</style>
