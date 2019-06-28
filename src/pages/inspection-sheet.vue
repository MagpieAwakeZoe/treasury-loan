<template>
    <div class="pg-inspection-sheet">
        <title-bar>验车单</title-bar>
        <div class="result">
            <div class="summary">
                <h2>验车结果</h2>
                <p class="detail">{{result.validateCarResult}}</p>
            </div>
            <ul>
                <li v-for="(item, $index) in result.validateCarList" :key="$index">
                    <div class="model-name">{{item.modelName}}</div>
                    <div class="info">
                        <span>{{item.appearanceColor}}/{{item.interiorColor}}</span>
                        <span class="line-between"></span>
                        <span>车架号: {{item.vin}}</span>
                    </div>
                    <div class="imgs">
                        <img :src="img | toHttps" v-for="(img, $index) in item.urlList"
                        :key="$index" @click="seeImg(item.urlList, $index)">
                    </div>
                    <div class="remark" v-if="item.remark">
                        备注: <span class="text-primary">{{item.remark}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <fixed-bottom>
            <som-button class="som-button--default168" style="margin-right: 8px"
            @click.native="show1 = true">验车不通过</som-button>
            <som-button :gradients="['#3684FF', '#3665FF']" style="margin-left: 8px"
                @click.native="show2 = true">确认验车</som-button>
        </fixed-bottom>
        <som-modal v-model="show1"
                   title="确定验车不通过？"
                   is-confirm
                   cancel-text="返回"
                   @on-confirm="confirm(4)">
        </som-modal>
        <som-modal v-model="show2"
                   is-confirm
                   title="请确定车辆状况无误"
                   confirm-text="确认验车"
                   cancel-text="返回"
                   @on-confirm="confirm(3)">
        </som-modal>
        <som-image-viewer ref="viewer"
                          :list="imgViewerList"
                          :action="[{action: 'auto-orient', value: 0}]"
        >
        </som-image-viewer>
    </div>
</template>

<script>
import Api from '@/api';
import FixedBottom from '@/components/fixed-bottom.vue';
import SomImageViewer from '@souche-ui/som-image-viewer';

export default {
    name: 'inspectionSheet',
    data () {
        return {
            show1: false,
            show2: false,
            result: {},
            imgViewerList: []
        };
    },
    components: {
        FixedBottom,
        SomImageViewer
    },
    methods: {
        confirm (operateType) {
            this.$som.loading.show({
                text: '提交中...'
            });
            Api.fsc.v1_carApi_confirmCarInspectResult({
                orderId: this.$route.query.orderId,
                operateType: operateType
            }).then(() => {
                this.$router.go(-1);
            });
        },
        seeImg (urlList, index) {
            this.imgViewerList.splice(0, this.imgViewerList.length);
            urlList.forEach((item) => {
                this.imgViewerList.push({
                    src: item
                });
            });
            this.$refs.viewer.show(index);
        }
    },
    mounted () {
        Api.fsc.v1_orderApi_getOrderValidateCarInfo({
            orderId: this.$route.query.orderId
        }).then((res) => {
            this.result = res;
        });
    }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">


.pg-inspection-sheet{
    .result{
        background: #fff;
        padding-left: 16px;
        margin-bottom: 70px;
        .summary{
            .border-bottom();
            padding: 32px 16px 32px 0;
            h2{
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 18px;
                line-height: 1;
            }
            .detail{
                line-height: 28px;
            }
        }
        li{
            .border-bottom();
            padding: 26px 0 20px 0;
            .model-name,.info{
                padding-right: 16px;
            }
            .model-name{
                margin-bottom: 12px;
                line-height: 22px;
                font-size: 16px;
            }
            .imgs{
                display: flex;
                /*justify-content: space-between;*/
                flex-wrap: wrap;
                img{
                    width: 105px;
                    height: 79px;
                    margin-bottom: 12px;
                    margin-right: 14px;
                }
            }
            .info{
                padding-right: 16px;
                color: #666;
                font-size: 0;
                span{
                    display: inline-block;
                    color: #666;
                    line-height: 1;
                    font-size: 14px;
                    vertical-align: middle;
                    margin-bottom: 10px;
                }
            }
            .remark{
                margin-bottom: 8px;
                padding-right: 16px;
            }
            .line-between{
                .border-right();
                margin: 0 8px;
                height: 10px;
                display: inline-block;
            }
        }
    }
}
</style>
