let lastTop = 0;
const oprRootStyle = (addStyleFlag) => {
    const styleId = 'html-body-disable-scroll';
    let style = document.getElementById(styleId);
    const styleStr = `html, body {
        position: fixed !important;
        overflow: hidden !important;
        width: 100% !important;
        height: 100% !important;
    }`;
    // 增加样式 && 样式不存在
    if (addStyleFlag && !style) {
        lastTop = document.documentElement.scrollTop || document.body.scrollTop;
        style = document.createElement('style');
        style.id = styleId;
        style.appendChild(document.createTextNode(styleStr));
        document.head.appendChild(style);
    }
    // 移除样式 && 样式存在
    if (!addStyleFlag && style) {
        style.parentNode.removeChild(style);
        window.scrollTo(0, lastTop);
    }
};

// 有弹窗时, 防止 背景页面 滚动
export default {
    data() {
        return {
            title: ''
        };
    },
    methods: {
        openComponent() {
            // 禁止背景页面 滚动
            oprRootStyle(true);
        },
        closeComponent() {
            // 恢复背景页面 滚动
            oprRootStyle(false);
            this.$emit && this.$emit('input', false);
        }
    },
    beforeRouteLeave(to, from, next) {
        // 导航离开该组件的对应路由时调用
        oprRootStyle(false);
        next();
    },
    beforeDestroy() {
        oprRootStyle(false);
    }
};
