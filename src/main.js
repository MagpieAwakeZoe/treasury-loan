// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import SomUI, { ToastPlugin, LoadingPlugin, TransferDom } from '@souche-ui/som-ui';
import SomScrollRefresh from '@souche-ui/som-scroll-refresh';
// eslint-disable-next-line
import Http from '@souche-f2e/http-request'; // 不要删,需要window上有HttpRequest对象
import Rhea from '@souche-vue/Rhea';  // 开发测试辅助工具
import plugins from '@souche-vue/loan-vue-plugins';
import TitleBar from '@/components/common/title-bar.vue';
import store from '@/vuex/store';
import '@souche-ui/som-ui/lib/styles/index.css';
// import '../theme/index.css';  // 针对som-ui的主题定制 有bug，重复类
import App from './App';
import router from './router';

Vue.use(SomUI);
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.directive('transfer-dom', TransferDom);
Vue.component('title-bar', TitleBar);
Vue.component('som-scroll-refresh', SomScrollRefresh);
Vue.use(plugins);
Vue.use(Rhea, {
    env: process.env.NODE_ENV,
    modules: [],
    info: {
        userData: store.state.userData
    }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
export default new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});
