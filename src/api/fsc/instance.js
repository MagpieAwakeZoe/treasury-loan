import Util from '../util';

const baseUrl = function () {
    return {
        mock: 'https://mock.souche-inc.com/mock/5baf4c14c2dba1352852bb79/fsc-site/',
        development: 'http://fsc-site.sqaproxy.dasouche-inc.net/',
        prepub: 'http://fsc-site.prepub.souche-inc.com/',
        production: 'https://fsc-site.souche-inc.com/'
    }[process.env.NODE_ENV || 'production'];
};

export default {
    baseUrl,
    init: Util.fsc(baseUrl)
};
