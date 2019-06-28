<template>
    <div class="pg-pickup-detail">
        <title-bar>提车详情</title-bar>
        <div class="notice-bar">
            {{result.pickUpStatusDesc}}
        </div>
        <div class="content">
            <div class="car-info">
                <h2>车辆信息</h2>
                <p class="flex-between"><span>提车申请时间</span><span>{{result.carPickUpDateCreate}}</span></p>
                <template v-for="(car, $index) in result.carList">
                    <p class="car-name">{{car.modelName}}</p>
                    <p class="car-params">
                        <span>{{car.appearanceColor}}/{{car.interiorColor}}</span>
                        <span class="line-between"></span>
                        <span>车架号: {{car.vin}}</span>
                    </p>
                </template>
                <img src="~@/assets/images/deal-doing.png" class="deal-status" v-if="result.agencyStatus === 1">
                <img src="~@/assets/images/deal-done.png" class="deal-status" v-if="result.agencyStatus === 2">
            </div>
            <div class="imgs" v-if="result.carOutStockSheetContents && result.carOutStockSheetContents.length">
                <h2>出库单</h2>
                <div>
                    <img :src="img" v-for="(img, $index) in result.carOutStockSheetContents"
                    :key="$index" @click="seeImg($index)">
                </div>
            </div>
            <div class="lift-info">
                <h2>提车人信息</h2>
                <p class="flex-between"><span>提车时间</span><span>{{result.estimatedPickDate}}</span></p>
                <p class="flex-between"><span>提车人姓名</span><span>{{result.carPickerName}}</span></p>
                <p class="flex-between"><span>手机号码</span><span>{{result.carPickerMobile}}</span></p>
                <p class="flex-between"><span>身份证号码</span><span>{{result.idCardNo}}</span></p>
            </div>
        </div>
        <p class="tip">注：提车人信息为库管核实依据，请确保与实际提车人一致，以免延误提车，提车请携带有效身份证件。</p>
        <fixed-bottom v-if="result.pickUpStatus !== 20 && result.agencyStatus !== 1">
            <cancel-button style="margin-right: 16px" @click.native="show = true">取消提车申请</cancel-button>
            <som-button :gradients="['#3684FF', '#3665FF']" @click.native="editPicker">修改提车人信息</som-button>
        </fixed-bottom>
        <som-modal v-model="show"
                   title="确定取消提车？取消后该提车记录将被删除"
                   is-confirm
                   cancel-text="返回"
                   @on-confirm="cancel">
        </som-modal>
        <som-image-viewer ref="viewer"
                          :action="[{action: 'auto-orient', value: 0}]"
                          :list="imgViewerList"
        >
        </som-image-viewer>
    </div>
</template>

<script>
import Api from '@/api';
import fixedBottom from '@/components/fixed-bottom.vue';
import cancelButton from '@/components/cancel-button.vue';
import SomImageViewer from '@souche-ui/som-image-viewer';

export default {
    name: 'PickupDetail',
    data () {
        return {
            show: false,
            result: {}
        };
    },
    components: {
        fixedBottom,
        cancelButton,
        SomImageViewer
    },
    computed: {
        imgViewerList () {
            let arr = [];
            let imgList = this.result.carOutStockSheetContents || [];
            imgList.forEach((item) => {
                arr.push({
                    src: item
                });
            });
            return arr;
        }
    },
    methods: {
        cancel () {
            if (!this.result.isSheetCanBeModified) {
                return this.$som.toast.text('部分车辆已出库，不支持修改或取消提车申请');
            }
            Api.fsc.v1_carPickUpApi_cancelCarPickUp({carPickUpId: this.result.carPickUpId}).then(() => {
                this.$router.go(-1);
            });
        },
        seeImg (index) {
            this.$refs.viewer.show(index);
        },
        editPicker () {
            if (!this.result.isSheetCanBeModified) {
                return this.$som.toast.text('部分车辆已出库，不支持修改或取消提车申请');
            }
            this.$router.push({path: '/add-car-lift', query: {edit: true, carPickUpId: this.result.carPickUpId}});
        }
    },
    mounted () {
        Api.fsc.v1_carPickUpApi_getPickupRequestInfo({
            carPickUpId: this.$route.query.carPickUpId
        }).then((res) => {
            this.result = res;
        });
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

.pg-pickup-detail{
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
    .car-info, .lift-info{
        padding: 32px 16px 17px 0;
        position: relative;
        .border-bottom();
        p{
            line-height: 1;
            margin-bottom: 9px;
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
    .lift-info{
        p{
            margin-bottom: 12px;
        }
    }
    .imgs{
        padding: 32px 0 20px 0;
        div{
            display: flex;
            flex-wrap: wrap;
            img{
                width: 105px;
                height: 79px;
                margin-bottom: 12px;
                margin-right: 14px;
            }
        }
    }
    .flex-between{
        display: flex;
        justify-content: space-between;
    }
    .tip{
        color: #999;
        font-size: 12px;
        line-height: 21px;
        margin: 16px;
    }
}
</style>
