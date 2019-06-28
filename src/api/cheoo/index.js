/* eslint-disable */
import instance from './instance';

const funcs = {};
const funcNames = [
    'csl_loan_callInLog', // 用户线索 打客服电话前调用
    'csl_openApi_updateJcdMessage' // 更新借车贷消息已读
];


funcNames.forEach(item => {
    let url = item.replace(/_/g, '/');
    funcs[item] = (opts) => {
        opts = opts || {};
        return instance.init({
            method: opts['API_METHOD'] || 'get',  // 默认请求类型为get, 非get请求在调用参数中增加"API_METHOD"属性
            url,
            opts
        })
    };
});

export { funcs };
