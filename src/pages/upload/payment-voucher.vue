<template>
    <div class="pg-upload-image">
        <title-bar>上传还款凭证</title-bar>
        <div class="img-container">
            <som-image-upload :imgList.sync="imgList"
            :action="action"
            :width="imgWH.width" :height="imgWH.height" :deletable="true"></som-image-upload>
        </div>
        <fixed-bottom>
            <som-button :gradients="['#3684FF', '#3665FF']" @click="upload">上传</som-button>
        </fixed-bottom>
    </div>
</template>

<script>
import Api from '@/api';
import Helper from '@/utils/helper';
import FixedBottom from '@/components/fixed-bottom.vue';
import SomImageUpload from '@souche-ui/som-image-upload';


export default {
    data () {
        return {
            imgList: [],
            imgWH: {
                width: 105,
                height: 79
            },
            action: [{
                action: 'quality',
                q: 75
            }, {
                action: 'auto-orient',
                value: 0
            }]
        };
    },
    components: {
        FixedBottom,
        SomImageUpload
    },
    methods: {
        upload () {
            if (this.imgList.length === 0) {
                return this.$som.toast.text('请先上传转账凭证');
            }
            let arg = {
                orderId: this.$route.query.orderId,
                repaymentId: this.$route.query.repaymentId,
                attachmentType: 4,
                attachmentContent: this.imgList
            };
            Api.fsc.v1_attachmentApi_uploadPaymentVoucher({data: JSON.stringify(arg)}).then(() => {
                this.$som.toast.text('上传成功');
                this.$router.go(-1);
            });
        }
    },
    mounted () {
        this.$setBodyBack('#fff');
        this.imgWH = Helper.setUploadImageWH(document.body.clientWidth - 18);
    }
};
</script>

<style lang="less">
    .pg-upload-image {
        .img-container{
            padding: 16px 0 0 16px;
        }
    }
</style>
