export default {
    setUploadImageWH (containerWidth) {
        let width = (containerWidth - 42) / 3;
        return {
            width: Number(width.toFixed(0)),
            height: Number(((width * 79) / 105).toFixed(0))
        };
    },
    isAlipay () {
        return !!navigator.userAgent.match(/Alipay/i);
    }
};
