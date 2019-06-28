/* eslint-disable */
import instance from './instance';
import Util from '../util';

const funcNames = [
    'accountApi_loginMerge', // 登录接口
    'accountApi_logout', // 登出接口
    'accountApi_uppwd', // 修改密码接口
    'phoneCode_sendSms', // 忘记密码-发送短信验证码
    'phoneCode_updatePwd', // 忘记密码-修改密码
    'phoneCode_userCheck' // 忘记密码-验证码校验
];

const funcs = Util.createApis(funcNames, instance);

export { funcs };
