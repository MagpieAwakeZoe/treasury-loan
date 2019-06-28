/* eslint-disable */
import instance from './instance';
import Util from '../util';
import getContractUrl from '@/utils/getContractUrl';

const funcNames = [
    'v1_dealerAccessApi_getDealerBusinessAccess', // 获取经销商是否能做平行进口车
    'v2_contractApi_getContractsSignStatus', // 查看订单合同以及合同签署状态
    'v1_accessApplyApi_getAccessInfo', // 查看经销商信息
    'v1_repaymentApi_getOrderLastRepaymentRecord', // 168APP订单详情页最新还款记录查询接口
    'v1_contractApi_getContractImgURL', // 查看订单合同图片
    'v1_orderApi_operateOrder', // 确认订单
    'v1_repaymentApi_consultInventoryOutInfo', // 网商资金订单还款前出库咨询接口请求
    'v1_orderApi_getOrderValidateCarInfo', // 查询验车单
    'v1_orderApi_modifyOrder', // 修改订单
    'v1_urlApi_getMybankContractLink', // 获取网商协议签订链
    'v1_attachmentApi_uploadPaymentVoucher', // 上传转账凭证
    'v1_orderApi_getOrderUnRepayInfo', // 查询订单待还款金额信息
    'v1_dealerAccessApi_getDealerCapitalAmountInfo', // 获取额度相关信息
    'v1_dealerAccessApi_getChannelPhoneByShopCode', // 获取客服电话
    'v1_orderApi_getOrderList', // 查询订单列表
    'v1_orderApi_getOrderByOrderId', // 查询订单详情
    'v1_orderApi_addNewOrder', // 新增订单
    'v1_carApi_getAllCarToPickAllOrders', // 查看所有订单的可提车的车辆列表分页查询
    'v1_carApi_getAllCarToPick', // 查看单个订单的可提车的车辆列表
    'v1_orderApi_getOrderValidateCarInfo', // 查询验车单（函)
    'v1_carPickUpApi_getAllPickupRecordList', // 查看客户所有提车记录列表
    'v1_repaymentApi_getAllRepaymentRecords', // 查看客户所有还款记录列表
    'v1_carApi_getAllCarToRepayForAllOrders', // 查看客户所有订单可还款的车辆列表
    'v1_carApi_getAllCarToRepay', // 查看单个订单可还款的车辆列表
    'v1_repaymentApi_addNewRepayment', // 新增还款申请
    'v1_carApi_confirmCarInspectResult', // 确认验车结果
    'v1_accessApplyApi_getAccessApplication', // 查看业务资质申请
    'v1_dealerAccessApi_getDealerCapitalAmountInfo', // 获取额度相关信息
    'v1_orderApi_getOrderList', // 查询订单列表
    'v1_carPickerApi_getFrequentCarPicker', // 查询常用提车人信息列表
    'v1_carPickerApi_deleteFrequentCarPicker', // 删除某条常用提车人
    'v1_carPickUpApi_addNewPickupRequest', // 新增提车申请
    'v1_carPickUpApi_getPickupRequestInfo', // 查看提车申请详情
    'v1_repaymentApi_getRepaymentRecordInfo', // 查看还款申请详情
    'v1_repaymentApi_cancelRePayment', // 取消还款
    'v1_repaymentApi_getPaymentConfirm', // 还款确认
    'v1_repaymentApi_getPaymentPrompt', // 获取还款确认提示
    'v1_attachmentApi_uploadPaymentVoucher', // 提交转账凭证
    'v1_repaymentApi_getOrderRepaymentRecordList', // 查看某个订单还款记录列表
    'v1_carPickUpApi_getOrderPickupRecordList', // 查看某个订单提车记录列表
    'v1_carPickUpApi_cancelCarPickUp', // 取消提车
    'v1_carPickUpApi_editPickerInfo', // 修改提车人信息
    'v1_contractApi_getCaptcha', // 获取验证码
    'v1_contractApi_signServiceContract', // 签订服务合同
    'v2_contractApi_getContractsSignStatus', //查看订单合同以及合同签署状态
    'v1_carApi_getCarLogisticsInfo', // 查看物流信息
    'v1_bankApi_queryHotBank',  // 查询热门银行信息
    'v1_bankApi_queryUsableBank',  // 查询启用的开户银行总行信息
    'v1_bankApi_queryProvinces', // 查询省级行政区划信息
    'v1_bankApi_queryCitiesByProvinceId', // 查询省级行政区划下属地级市信息
    'v1_bankApi_queryByCityIdAndBankId', // 根据地级市id和银行id查询支行信息
    'v1_carApi_getCarModelByCode', // 根据车型代码查询车型信息
    'v1_areaApi_getDepartureList', // 查询所有始发地市列表
    'v1_areaApi_getDestinationList', // 查询所有目的地市列表
    'v1_areaApi_getWarehouseList', // 查询所在地的仓库地址列表
    'v1_carApi_getCarBrandList', // 查询可申请的车辆品牌列表
    'v1_carApi_getCarSeriesList', // 查询可申请的车辆车系列表
    'v1_carApi_getCarModelList', // 查询可申请的车辆车型列表
    'v1_urlApi_getAlipayUserInfo', // 查询支付宝信息
    'v1_urlApi_getRYSLinkUrl', // 获取融易收开通链接
    'v1_urlApi_setAuthorAlipayUserAccount', // 授权支付宝账户
    'unlogin_unloginApi_getCustomerServicePhone', // 查询渠道端客服电话信息
    'v1_dealerBankApi_getDealerFrequentBankAccount',//查询经销商常用银行卡账号信息列表
    'v1_dealerBankApi_deleteDealerFrequentBankAccount',//删除经销商常用银行卡账号信息列表
    'v1_accessApplyApi_getAccessInfo', //查看经销商信息
    'v1_dealerBankApi_addDealerFrequentBankAccount', //新增经销商常用银行卡账号信息列表
    'v1_orderDeletedCarApi_getNotDoingBusinessAllCar', // 查看该车商所有未做业务的车辆列表
    'v1_orderDeletedCarApi_getDeletedCarPickupRequestInfo', // 未做业务提车申请详情
    'v1_orderDeletedCarApi_getDeletedCarPickupRecords', // 未做业务提车申请记录列表
    'v1_orderDeletedCarApi_orderDeletedAddNewPickupRequest' // 未做业务新增提车申请
];

const funcs = Util.createApis(funcNames, instance);

// 合同接口
const contractUrls = [
    'v2_contractApi_getContractTemplate'
];

contractUrls.forEach(item => {
    let url = item.replace(/_/g, '/') + '.json';
    funcs[item] = (params) => {
        return getContractUrl(params, instance.baseUrl(), url);
    }
});

export { funcs };
