import { defineStore } from "pinia";
import { ref } from "vue";

export const userInfoStore = defineStore('userInfo', () => {
    const role = ref(''); // 角色
    const isLogin = ref(false); // 是否登录
    const username = ref(''); // 用户名
    const token = ref(''); // jwt token

    // 设置用户信息
    const setUserInfo = (userInfo) => {
        role.value = userInfo.role || 'USER';
        username.value = userInfo.name || '';
        token.value = userInfo.authorization || '';
        isLogin.value = true;
    };

    // 清除用户信息
    const clearUserInfo = () => {
        role.value = '';
        username.value = '';
        token.value = '';
        isLogin.value = false;
    };

    return {
        username,
        isLogin,
        role,
        token,
        setUserInfo,
        clearUserInfo,
    };
}, {
    // 持久化配置
    persist: {
        key: 'userInfo',
        paths: ['role', 'isLogin', 'username', 'token'],
        storage: localStorage,
    }
});