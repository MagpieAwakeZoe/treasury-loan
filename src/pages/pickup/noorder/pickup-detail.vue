<template>
    <!-- 未做业务提车详情 -->
    <div class="pg-pickup-detail-noorder">
        <title-bar>提车详情</title-bar>
        <div class="notice-bar">
            {{result.pickUpStatus === 50 ? '已发起提车申请，请携带身份证前往仓库提车' : '提车完成'}}
        </div>
        <div class="content">
            <div class="warehouse">
                <h2>仓库信息</h2>
                <p class="flex-between"><span>仓库名称</span><span>{{result.warehouseName}}</span></p>
                <p class="flex-between"><span>详细地址</span><span class="text-right">{{result.warehouseAddress}}</span></p>
            </div>
            <div class="car-info">
                <h2>车辆信息</h2>
                <p class="flex-between"><span>提车申请时间</span><span>{{result.pickUpCreateDate}}</span></p>
                <template v-for="(car, $index) in result.orderDeletedCarSiteVO">
                    <p class="car-name" :key="$index">{{car.modelName}}</p>
                    <p class="car-params" :key="$index">
                        <span>{{car.appearanceColor}}/{{car.interiorColor}}</span>
                        <span class="line-between"></span>
                        <span>车架号: {{car.vin}}</span>
                    </p>
                </template>
            </div>
            <div class="lift-info">
                <h2>提车人信息</h2>
                <p class="flex-between"><span>提车时间</span><span>{{result.pickUpDate}}</span></p>
                <p class="flex-between"><span>提车人姓名</span><span>{{result.carPickerName}}</span></p>
                <p class="flex-between"><span>手机号码</span><span>{{result.carPickerMobile}}</span></p>
                <p class="flex-between"><span>身份证号码</span><span>{{result.idCardNo}}</span></p>
            </div>
        </div>
        <p class="tip">注：提车人信息为库管核实依据，请确保与实际提车人一致，以免延误提车，提车请携带有效身份证件。</p>
    </div>
</template>

<script>
import Api from '@/api';

export default {
    name: 'PickupDetailNoOrder',
    data () {
        return {
            result: {}
        };
    },
    mounted () {
        Api.fsc.v1_orderDeletedCarApi_getDeletedCarPickupRequestInfo({
            carPickUpNo: this.$route.query.carPickUpNo
        }).then((res) => {
            this.result = res;
        });
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

.pg-pickup-detail-noorder{
    margin-bottom: 80px;
    .notice-bar{
        background: #FFFAEB;
        padding: 15px 16px;
        font-size: 17px;
        color: #FF982A;
        font-weight: bold;
    }
    .content{
        padding-left: 16px;
        background: #fff;
    }
    h2{
        font-size: 18px;
        font-weight: bold;
        margin: 0 16px 22px 0;
    }
    .line-between{
         .border-right();
         margin: 0 8px;
         height: 10px;
         display: inline-block;
     }
    .warehouse, .car-info, .lift-info{
        padding: 32px 16px 17px 0;
        position: relative;
        .border-bottom();
        p{
            line-height: 20px;
            margin-bottom: 7px;
        }
        .car-name,.car-params{
            line-height: 20px;
        }
        .deal-status{
            position: absolute;
            z-index: 2;
            right: 0;
            bottom: 0;
            width: 50px;
        }
    }
    .flex-between{
        display: flex;
        justify-content: space-between;
        span:first-child{
            min-width: 100px;
        }
    }
    .tip{
        color: #999;
        font-size: 12px;
        line-height: 21px;
        margin: 16px;
    }
}
</style>
