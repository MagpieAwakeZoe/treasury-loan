import Vue from 'vue';
import Vuex from 'vuex';
import CacheUtils from '@souche-f2e/souche-util/lib/cache';
import actions from './actions';
import mutations from './mutations';
import pickupList from './modules/pickup-list';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        carType: JSON.parse(CacheUtils.getCookie('CAR_TYPE') || 1), //  1 中规 2平行
        userData: JSON.parse(CacheUtils.getCookie('SUPPLY_CHAIN_USER_DATA') || '{}'),
        accessInfo: JSON.parse(CacheUtils.getCookie('SUPPLY_CHAIN_ACCESS_INFO') || '{}'),
        channel: localStorage.getItem('SUPPLY_CHAIN_CHANNEL') || '',
    },
    mutations,
    actions,
    modules: {
        pickupList
    }
});
