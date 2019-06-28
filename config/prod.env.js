var merge = require('webpack-merge');
var commonConf = require('./common.env');

var prodConf = merge(commonConf, {
    env: 'prod',
    assetsPublicPath: '//assets.souche.com/projects/finance/treasury-loan/',
    // globalConfig 中的 key 需要为 JSON 字符串
    globalConfig: {
        NODE_ENV: JSON.stringify("production")
    },
    sourceMap: true
});

module.exports = prodConf;
