var merge = require('webpack-merge');
var commonConf = require('./common.env');
var projectConfig = require('./project.config');
try {
    var localConfig = require('../src/local-config.json')
} catch (err) {
    console.error(err);
}

var devConf = merge(commonConf, {
    env: 'dev',
    assetsPublicPath: '/projects/finance/treasury-loan/',
    // globalConfig 中的 key 需要为 JSON 字符串
    globalConfig: {
        NODE_ENV: JSON.stringify((!process.env.BUILD_ENV && localConfig) ? localConfig.env : "development"),
    },
    port: projectConfig.port,
    proxyTable: {}
});

module.exports = devConf;
