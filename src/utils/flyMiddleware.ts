import { Fly, FlyRequestConfig } from "flyio";
import { getUserInfo } from "./user";

const EtimeoutStep = 4000

export interface ExtendedRequest extends FlyRequestConfig {
    form?: boolean
    metaIgnoreErr?: number[]
    params?: Record<string, any>
    startTime?: number
    endTime?: number
    errorPrefix?: string
    auth?: boolean
    retry?: number
    _alreadyRetry?: number
}

export function flyInit(fly: Fly) {
    fly.config.timeout = EtimeoutStep
    // 请求token自动注入
    fly.interceptors.request.use((request: ExtendedRequest) => {
        if (request.form) {
            request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        if (request.headers['Content-Type'] === '') {
            delete request.headers['Content-Type']
        }
        if (getUserInfo().isLogin) {
            const token = getUserInfo().token
            request.headers['Authorization'] = `Bearer ${token}`
        }
    })
    // 响应拦截
    // fly.interceptors.response.use(
    //     (response) => {

    //     }
    // )
}