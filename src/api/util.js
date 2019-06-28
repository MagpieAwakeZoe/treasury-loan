import Http from '@souche-f2e/http-request';
import store from '@/vuex/store';
import vm from '@/main';
import Const from '@/utils/const';
import CacheUtils from '@souche-f2e/souche-util/lib/cache';

const ajax = (url, params = {}) => {
    params.url = url;
    params.type = params.type || 'get';
    return Http.ajax(params).then((res) => {
        if (res.message === 'OK' || res.success || res.error === 0) { // error为0是168服务器的成功标识
            vm.$som.loading.hide();
            return Promise.resolve(res.data);
        } else {
            if (res.code === '10001') {
                CacheUtils.clearCookie('SUPPLY_CHAIN_USER_DATA');
                store.commit('setUserData', {});
                if (store.state.channel === Const.ZB_CHANNEL) {
                    setTimeout(() => {
                        vm.$router.replace('/login');
                    }, 2000);
                }
            }
            throw res;
        }
    }).catch((err) => {
        if (err.message === 'Network Error') {
            err.message = '网络异常';
        }
        vm.$som.loading.hide();
        return Promise.reject(err);
    });
};

export default {
    fsc(baseURL) {
        return function(params) {
            params.opts = params.opts || {};
            params.opts.businessMode = 2; // 1接车 2 库容
            params.opts.carType = store.state.carType; // 1 中规 2平行  接车贷定死是1
            params.opts.channelIdentifier = store.state.channel; // 渠道标识
            params.opts._security_token_inc = store.state.userData.userToken;
            return ajax(baseURL() + params.url, {
                data: params.opts,
                type: params.method
            });
        };
    },
    createApis(funcNames, instance) {
        let funcs = {};
        funcNames.forEach((item) => {
            let url = `${item.replace(/_/g, '/')}.json`;
            funcs[item] = (opts) => {
                opts = opts || {};
                return instance.init({
                    method: opts['API_METHOD'] || 'post',  // 默认请求类型为post, 非post请求在调用参数中增加"API_METHOD"属性
                    url,
                    opts
                });
            };
        });
        return funcs;
    }
};
