<template>
  <div class="cp-list-car-info">
      <div class="model-name" :class="{'text-weight': bold}">{{data.modelName}}</div>
      <div class="info">
          <span>{{data.appearanceColor}}/{{data.interiorColor}}</span>
          <span class="line-between"></span>
          <span>车架号: {{data.vin && data.vin.substr(data.vin.length - 6)}}</span>
      </div>
  </div>
</template>

<script>
export default {
    name: 'listCarInfo',
    props: {
        data: {
            type: Object,
            default: {}
        },
        bold: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

.cp-list-car-info{
    position: relative;
    font-size: 0;
    .model-name{
        font-size: 16px;
        line-height: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 16px;
        width: 100%;
        position: absolute;
    }
    .info{
        padding-top: 16px;
    }
    span{
        color: #666;
        line-height: 1;
        margin-top: 10px;
        font-size: 14px;
        display: inline-block;
    }
    .line-between{
        .border-right();
        margin: 0 8px;
        height: 10px;
        display: inline-block;
    }
}
</style>
