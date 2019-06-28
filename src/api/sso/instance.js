import Util from '../util';

const baseUrl = function () {
    return {
        mock: 'https://mock.souche-inc.com/mock/5c10cf5c0a661838e5af6ea2/sso-supply/',
        development: 'http://sso-supply.dasouche-fin.net/',
        prepub: 'http://sso-supply.prepub.souche-fin.com/',
        production: 'https://sso-supply.souche-fin.com/'
    }[process.env.NODE_ENV || 'production'];
};

export default {
    baseUrl,
    init: Util.fsc(baseUrl)
};
