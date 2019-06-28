<template>
    <div class="treasury-loan-instructions">
        <title-bar>库融贷说明</title-bar>
        <ul>
            <li v-for="(item,index) in instructionWd" :key="index">
                <em>{{index + 1}}</em>
                <span>{{item.title}}</span>
                <p>{{item.content}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'instruction',
    data() {
        return {
            instructionWd: [
                {
                    title: '企业授权认证',
                    content:
                        '提交企业及个人相关信息，认证通过后即可发起库融贷申请'
                },
                {
                    title: '在线申请',
                    content: '在线提交申请，将会有专属客服与您联系'
                },
                {
                    title: '车辆入库',
                    content:
                        '申请通过后，将车辆运输至所选仓库，并移交车辆手续至我司保管人员'
                },
                {
                    title: '仓库验车',
                    content:
                        '车辆入库后，仓库将会安排验车，您需要在线查看验车图片并确认验车'
                },
                {
                    title: '签署合同',
                    content: '与平台签署合同，以保障双方权益'
                },
                {
                    title: '融资',
                    content: '合同签署完毕后，资方向您支付融资金额'
                },
                {
                    title: '还款',
                    content: '若需要还款，您可选择需要还款'
                },
                {
                    title: '仓库提车',
                    content:
                        '您完成还款且车辆进入仓库后，您可发起提车申请并前往仓库提车'
                }
            ]
        };
    }
};
</script>
<style lang="less" scoped>
.treasury-loan-instructions {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    user-select: none;
    overflow: scroll;

    ul {
        padding-top: 20px;

        * {
            word-wrap: break-word;
            word-break: break-all;
        }

        li {
            box-sizing: border-box;
            position: relative;
            padding-bottom: 15px;
            margin-left: 7.6%;
            margin-right: 4%;
            padding-left: 5.34%;
            border-left: 2px dashed #eee;

            &:last-child {
                border-left: none;
            }

            em {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 1px;
                left: -10px;
                width: 18px;
                height: 18px;
                color: #fff;
                font-style: normal;
                font-weight: bold;
                font-size: 14px;
                line-height: 18px;
                text-align: center;
                border-radius: 18px;
                background: #ff801a;
            }
            span {
                height: 16px;
                color: #1a1a1a;
                font-weight: bold;
                font-size: 16px;
            }
            p {
                margin-top: 8px;
                color: #666;
                font-size: 12px;
            }
        }
    }
}
</style>
