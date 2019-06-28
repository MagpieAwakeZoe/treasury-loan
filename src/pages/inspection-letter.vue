<template>
    <div class="pg-inspection-letter">
        <title-bar>验车函</title-bar>
        <div class="container">
            <img src="~@/assets/images/sure.png" class="sure-img">
            <h1>验车函</h1>
            <p class="result"><span class="im">验车结果：</span>{{result.validateCarResult}}</p>
            <ul class="car-list">
                <li v-for="(item, $index) in result.validateCarList" :key="$index">
                    <div class="title">车辆基本信息</div>
                    <div class="params">
                        <div class="pl"><b>品牌：</b><span class="line-text">{{item.brandName}}</span></div>
                        <div class="pr"><b>车系：</b><span class="line-text">{{item.seriesName}}</span></div>
                        <div class="full-line"><b>车型：</b><span class="line-text">{{item.modelName}}</span></div>
                        <div class="pl"><b>外观颜色：</b><span class="line-text">{{item.appearanceColor}}</span></div>
                        <div class="pr"><b>内饰颜色：</b><span class="line-text">{{item.interiorColor}}</span></div>
                        <div class="full-line"><b>车架号：</b><span class="line-text">{{item.vin}}</span></div>
                        <div class="full-line" v-if="item.remark"><b>备注：</b><span class="text-primary remark">{{item.remark}}</span></div>
                        <div class="full-line"><b>验车图片：</b></div>
                    </div>
                    <div class="imgs">
                        <img :src="img"  v-for="(img, $index) in item.urlList" :key="$index"
                        @click="seeImg(item.urlList, $index)">
                    </div>
                </li>
            </ul>
            <div class="footer">
                <p>确认人：<span class="value">{{result.confirmerName}}</span></p>
                <p>确认时间：<span class="value">{{result.confirmValidateCarTime}}</span></p>
            </div>
        </div>
        <som-image-viewer ref="viewer"
                          :action="[{action: 'auto-orient', value: 0}]"
                          :list="imgViewerList"
        >
        </som-image-viewer>
    </div>
</template>

<script>
import Api from '@/api';
import SomImageViewer from '@souche-ui/som-image-viewer';


export default {
    name: 'inspectionLetter',
    data () {
        return {
            result: {},
            imgViewerList: []
        };
    },
    components: {
        SomImageViewer
    },
    methods: {
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
        this.$setBodyBack('#fff');
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


.pg-inspection-letter{
    .container{
        position: relative;
        padding: 32px 0 0 0;
        h1{
            text-align: center;
            font-size: 24px;
            margin:0 auto 32px auto;
            line-height: 1;
        }
        .result{
            margin:0 16px 32px 16px;
            .im{
                font-size: 18px;
                font-weight: bold;
            }
        }
        .car-list{
            li{
                margin-bottom: 32px;
                .border-bottom();
                padding-bottom: 20px;
            }
            .title{
                font-size: 18px;
                font-weight: bold;
                text-align: center;
                padding-bottom: 22px;
                border-bottom: 2px solid #1a1a1a;
                margin:0 16px 32px 16px;
            }
            .params{
                display: flex;
                flex-wrap: wrap;
                padding: 0 16px;
                line-height: 20px;
                .pl, .pr{
                    width: 47%;
                    margin-bottom: 22px;
                    display: flex
                }
                .pl{
                    margin-right: 6%;
                }
                .full-line{
                    width: 100%;
                    margin-bottom: 22px;
                    display: flex;
                    flex-wrap: wrap;
                }
                .line-text{
                    .border-bottom(#1a1a1a);
                    flex: 1;
                    padding-left: 11px;
                }
                .remark{
                    flex: 1;
                }


            }
            .imgs{
                padding: 0 0 0 16px;
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
        .footer{
            text-align: right;
            margin:0 16px 40px 16px;
            line-height: 20px;
            p{
                margin-bottom: 12px;
            }
            .value{
                display: inline-block;
                width: 151px;
                vertical-align: top;
                text-align: left;
            }
        }
        .sure-img{
            position: absolute;
            right: 16px;
            top: 21px;
            z-index: 2;
            width: 60px;
        }
    }
}
</style>
