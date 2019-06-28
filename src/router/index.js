import Vue from 'vue';
import Router from 'vue-router';
import store from '@/vuex/store';
import vm from '@/main';
import CacheUtils from '@souche-f2e/souche-util/lib/cache';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            // 订单详情
            path: '/index',
            name: 'index',
            component: () =>
                import('pages/index.vue')
        }, {
            // 订单详情
            path: '/order-detail/:orderId',
            name: 'orderDetail',
            component: () =>
                import('pages/order-detail.vue')
        }, {
            // 发起订单
            path: '/start-order',
            name: 'startOrder',
            meta: { hideLoading: true },
            component: () =>
                import('pages/start-order.vue')
        }, {
            // 填写车架号
            path: '/add-car-vin',
            name: 'add-car-vin',
            component: () =>
                import('pages/add-car-vin.vue')
        },
        {
            // 发起订单
            path: '/order-upload-img',
            name: 'orderUploadImg',
            meta: { hideLoading: true },
            component: () =>
                import('pages/order-upload-img.vue')
        },
        {
            // 添加车辆
            path: '/add-car',
            name: 'addCar',
            meta: { hideLoading: true },
            component: () =>
                import('pages/add-car.vue')
        },
        {
            path: '/pickup-records', // 提车记录列表
            name: 'pickupRecords',
            component: () =>
                import('pages/pickup/records.vue'),
            children: [{
                    path: 'allorder',
                    name: 'pickupRecordAllOrder',
                    component: () =>
                        import('pages/pickup/allorder/record-list.vue')
                },
                {
                    path: 'noorder',
                    name: 'pickupRecordNoOrder',
                    component: () =>
                        import('pages/pickup/noorder/record-list.vue')
                }
            ]
        },
        {
            path: '/inspection-sheet', // 验车单
            name: 'inspectionSheet',
            component: () =>
                import('pages/inspection-sheet.vue')
        },
        {
            path: '/inspection-letter', // 验车函
            name: 'inspectionLetter',
            component: () =>
                import('pages/inspection-letter.vue')
        },
        {
            path: '/repayment-record', // 还款记录列表
            name: 'repaymentRecord',
            component: () =>
                import('pages/repayment/repayment-record.vue')
        },
        {
            path: '/instructions', // 库融贷说明
            name: 'instructions',
            meta: { hideLoading: true },
            component: () =>
                import('pages/instructions.vue')
        },
        {
            path: '/logistics-detail', // 物流详情
            name: 'logistics-detail',
            meta: { hideLoading: true },
            component: () =>
                import('pages/logistics-detail.vue')
        },
        {
            path: '/add-car-lift', // 录入提车人
            name: 'addCarLift',
            meta: { hideLoading: true },
            component: () =>
                import('pages/pickup/add-car-lift.vue')
        },
        {
            path: '/add-car-lift/noorder', // 未做业务录入提车人
            name: 'addCarLiftNoOrder',
            meta: { hideLoading: true },
            component: () =>
                import('pages/pickup/noorder/add-car-lift.vue')
        },
        {
            path: '/pickup-list', // 提车申请列表
            name: 'pickupLists',
            component: () =>
                import('pages/pickup/lists.vue'),
            children: [{
                    path: 'allorder',
                    name: 'pickupListAllOrder',
                    component: () =>
                        import('pages/pickup/allorder/apply-list.vue')
                },
                {
                    path: 'noorder',
                    name: 'pickupListNoOrder',
                    component: () =>
                        import('pages/pickup/noorder/apply-list.vue')
                }
            ]
        },
        {
            path: '/pickup-detail', // 提车详情
            name: 'pickupDetail',
            component: () =>
                import('pages/pickup/pickup-detail.vue')
        },
        {
            path: '/pickup-detail/noorder', // 提车详情(未做业务)
            name: 'pickupDetailNoOrder',
            component: () =>
                import('pages/pickup/noorder/pickup-detail.vue')
        },
        {
            path: '/repayment-detail', // 还款详情
            name: 'repaymentDetail',
            component: () =>
                import('pages/repayment/repayment-detail.vue')
        },
        {
            path: '/repayment-list', // 还款申请列表
            name: 'repaymentList',
            component: () =>
                import('pages/repayment/repayment-list.vue')
        },
        {
            path: '/contract', // 签署合同
            name: 'contract',
            component: () =>
                import('pages/contract.vue')
        },
        {
            path: '/contract-list', // 签署合同
            name: 'contractList',
            component: () =>
                import('pages/contract-list.vue')
        },
        {
            path: '/records', // 还款/提车记录
            name: 'records',
            component: () =>
                import('pages/records.vue'),
            children: [{
                    path: 'order-pickup',
                    name: 'recordsOrderPickup',
                    component: () =>
                        import('pages/pickup/oneorder/record-list.vue')
                },
                {
                    path: 'order-repayment',
                    name: 'recordsOrderRepayment',
                    component: () =>
                        import('pages/repayment/order-repayment-record.vue')
                }
            ]
        },
        {
            path: '/order-pickup-list', // 单个订单提车申请列表
            name: 'orderPickupList',
            component: () =>
                import('pages/pickup/oneorder/apply-list.vue')
        },
        {
            path: '/order-repayment-list', // 单个订单还款申请列表
            name: 'orderRepaymentList',
            component: () =>
                import('pages/repayment/order-repayment-list.vue')
        },
        {
            path: '/financing-collection', // 融易收
            name: 'financing-collection',
            meta: { hideLoading: true },
            component: () =>
                import('pages/financing-collection.vue')
        },
        {
            path: '/authorize', // 支付宝授权
            name: 'authorize',
            component: () =>
                import('pages/authorize.vue')
        },
        {
            path: '/upload-payment-voucher', // 通用上传图片页面
            name: 'uploadPaymentVoucher',
            meta: { hideLoading: true },
            component: () =>
                import('pages/upload/payment-voucher')
        },
        {
            path: '/login', // 登录页面
            name: 'login',
            meta: { hideLoading: true },
            component: () =>
                import('pages/user/login')
        },
        {
            path: '/get-password', // 重置密码-校验手机
            name: 'getPassword',
            meta: { hideLoading: true },
            component: () =>
                import('pages/user/get-password')
        },
        {
            path: '/new-password', // 重置密码-新密码
            name: 'newPassword',
            meta: { hideLoading: true },
            component: () =>
                import('pages/user/new-password')
        },
        {
            path: '*',
            name: '404',
            meta: { hideLoading: true },
            component: () =>
                import('pages/404.vue')
        },
        {
            path: '/add-payment-account',
            name: 'addPaymentAccount',
            component: () =>
                import('pages/add-payment-account.vue')
        },
        {
            path: '/select-payment-account',
            name: 'selectPaymentAccount',
            component: () =>
                import('pages/select-payment-account.vue')
        }
    ]
});
// 测试环境
// 17764591316
// dasouche2018

// 预发环境
// 18668493063
// souche2015

// 每次路由进入前,先获取用户数据
router.beforeEach((to, from, next) => {
    if (to.query.channel) { // 渠道方标识
        localStorage.setItem('SUPPLY_CHAIN_CHANNEL', to.query.channel);
        store.commit('setChannel', to.query.channel);
    }
    if (store.state.userData.userToken) {
        next();
    } else {
        // 接入方是搜车体系app时，需要通过协议取用户信息，其他app内，返回的res是{noJockey}
        store.dispatch('getUserData').then((res) => {
            let userData = res;
            if (userData && userData.userToken) {
                userData.dealerId = userData.uid;
            } else if (to.query.userToken) {
                userData = Object.assign({}, userData, to.query);
            }
            CacheUtils.setCookie('SUPPLY_CHAIN_USER_DATA', JSON.stringify(userData), 15, '', '/');
            store.commit('setUserData', userData);
            next();
        });
    }
});

router.afterEach((to) => {
    if (to.matched.some(record => record.meta.hideLoading)) {
        // 如果是静态页面,需要添加路由meta:{ hideLoading: true}, 以此作为移除loading的判断条件
        setTimeout(() => {
            vm.$som.loading.hide();
        }, 100);
    }
});

export default router;
