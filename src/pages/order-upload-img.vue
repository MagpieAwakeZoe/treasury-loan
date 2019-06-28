<template>
    <div class="pg-upload-img" >
        <title-bar>{{title}}</title-bar>
        <som-image-upload :imgList.sync="imgViewerArr"
                          :action="action"
                          :max="100"
                          :height="imgWH.height" :width="imgWH.width"
                          :lazy="false"
                          :deletable="true"></som-image-upload>
        <my-button :text="'上传'"
                   @click='uploadImg'
                   :isFixed="true" :is2Btn="false">
        </my-button>
    </div>
</template>

<script>
    import Helper from '@/utils/helper';
    import Api from '@/api';
    import myButton from '@/components/order/my-button';
    import SomImageUpload from '@souche-ui/som-image-upload';


    export default {
        components: {myButton, SomImageUpload},
        data () {
            return {
                width: 0,
                imgViewerArr: [],
                imgWH: {},
                title: '上传转账凭证',
                action: [{
                    action: 'quality',
                    q: 75
                }, {
                    action: 'auto-orient',
                    value: 0
                }]
            };
        },
        mounted() {
            this.imgWH = Helper.setUploadImageWH(document.body.clientWidth - 18);
        },
        methods: {
            uploadImg() {
                if (this.imgViewerArr.length <= 0) {
                    return this.$som.toast.text('请上传转账凭证');
                }
                const bodyData = {
                    orderId: this.$route.query.orderId,
                    attachmentType: 2, // 2:保证金支付凭证 4:还款凭证
                    attachmentContent: this.imgViewerArr// ['a','b']}
                };
                Api.fsc.v1_attachmentApi_uploadPaymentVoucher({
                    data: JSON.stringify(bodyData)
                }).then(() => {
                    this.$som.toast.text('上传成功');
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 2000);
                });
            }
        }
    };
</script>

<style lang="less">
    .pg-upload-img {
        background-color: #fff;
        padding: 16px;
        padding-right: 0;
        height: ~"calc(100vh - 44px)";
        .co-my-button {
            border-top: 1px solid #ECECEC;
        }
    }
</style>
