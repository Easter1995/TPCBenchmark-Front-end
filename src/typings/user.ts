export interface IUserResponse<T> {
    code: number
    data: T
    message: string
}
/**
 * 用户登录相关
 */
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
export interface regisData {
    name: String
}

/**
 * 用户审批相关
 */
export interface IUserList {
    users: Array<IUserApproveData | IUserAllData>
}
export interface IUserApproveData {
    name: String,
    id: number,
    status: String
}
export interface IUsersApproved {
    count: number,
    usernames: Array<string>
}

/**
 * 用户删除相关
 */
export interface IUserAllData {
    role: String,
    name: String,
    id: number,
    status: String
}