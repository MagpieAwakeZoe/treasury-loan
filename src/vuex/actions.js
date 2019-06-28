import Tower from '@souche-f2e/tower';

export default {
    getUserData() {
        /*userToken,userId,userTag,userPhone,avatar,iid,sessionId,nickName,version*/
        return Tower.getUserData().then((res) => {
            return res;
        });
    }
};
