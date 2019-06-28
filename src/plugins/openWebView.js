export default {
    install(Vue) {
        // openWebView
        Vue.prototype.$openWebView = (href, data = {}, cb = () => {}) => {
            window.open(href, '_blank');
        };
    }
};
