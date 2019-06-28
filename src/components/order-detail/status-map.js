const map = {
    // 申请已提交，待审核
    10: {
        steps: 1.5,
        btnText: ''
    },
    // 信息审核不通过，请修改申请
    20: {
        steps: 1.5,
        btnText: '修改订单'
    },
    // 初审通过，等待物流验车
    30: {
        steps: 2,
        btnText: ''
    },
    // 物流已验车，请确认验车
    40: {
        steps: 2,
        btnText: '确认验车'
    },
    // 验车已确认，等待资方审核
    50: {
        steps: 2.5,
        btnText: ''
    },
    // 资方审核通过，待支付首付款
    60: {
        steps: 2.5,
        btnText: '上传转账凭证'
    },
    // 凭证审核不通过，请重新上传
    70: {
        steps: 2.5,
        btnText: '上传转账凭证'
    },
    // 凭证已上传，等待资方审核首付款凭证
    80: {
        steps: 2.5,
        btnText: ''
    },
    // 首付款已支付，等待签署合同
    90: {
        steps: 3,
        btnText: '签署合同',
    },
    // 网商资金需要先签署服务合同，再签署借款合同 首付款已支付，等待签署借款合同
    91: {
        steps: 3,
        btnText: '签署合同'
    },
    // 合同已签署，等待资方付款
    100: {
        steps: 4,
        btnText: ''
    },
    // 资方已付款至供应商，等待物流运输
    110: {
        steps: 5,
        btnText: ''
    },
    // 物流已起运
    120: {
        steps: 5,
        btnText: '还款',
        leftBtnText: ''
    },
    // 部分车辆入库
    125: {
        steps: '5',
        btnText: '还款',
        leftBtnText: '发起提车'
    },
    // 全部车辆入库
    130: {
        steps: 5,
        btnText: '还款',
        leftBtnText: '发起提车'
    },
    // 订单已逾期
    140: {
        steps: 5,
        btnText: '还款',
        leftBtnText: '发起提车'
    },
    // 平台处理车辆，订单结束
    150: {
        steps: 5,
        btnText: ''
    },
    // 还款已结清
    160: {
        steps: 5,
        btnText: '发起提车'
    },
    // 逾期已还款
    170: {
        steps: 5.5,
        btnText: ''
    },
    // 已全部提车，订单完成
    200: {
        steps: 5.5,
        btnText: ''
    },
    // 订单取消中
    998: {
        steps: 0,
        btnText: '重新下单'
    },
    // 订单关闭
    999: {
        steps: 0,
        btnText: '重新下单'
    }
};
export default map;
