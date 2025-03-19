import { loginData, userInfo } from "@/typings/userResponse"
import { userInfoStore } from "@/store/index"

export function getUserInfo(): userInfo {
    const userStore = userInfoStore()
    return {
        role: userStore.role,
        name: userStore.username,
        token: userStore.token,
        isLogin: userStore.isLogin,
    }
}

export function writeUserInfo(userInfo: loginData) {
    // console.log('userInfo', userInfo)
    const userStore = userInfoStore()
    userStore.setUserInfo(userInfo)
}

export function delUserInfo() {
    const userStore = userInfoStore()
    userStore.clearUserInfo()
}