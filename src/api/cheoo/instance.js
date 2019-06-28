import Util from '../util';

const baseUrl = function () {
    return {
        mock: 'http://sctest-apich.cheoo.com/',
        development: 'http://sctest-apich.cheoo.com/',
        prepub: 'http://apich.prepub.cheoo.com/',
        production: 'https://api.chehang168.com/'   // 非https
    }[process.env.NODE_ENV || 'production'];
};

export default {
    baseUrl,
    init: Util.fsc(baseUrl)
};
