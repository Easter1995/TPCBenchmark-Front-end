/**
 * 用户登录相关
 */
export interface IUserLoginResponse<T> {
    code: number
    data: T
    message: string
}
export interface loginData {
    token: string
    name: string
    role: string
}
export interface userInfo {
    token: string
    name: string
    role: string
    isLogin: boolean
}

/**
 * 用户注册相关
 */
export interface IUserRegisterResponse<T> {
    code: number
    data: T
    message: string
}
export interface regisData {
    name: String
}