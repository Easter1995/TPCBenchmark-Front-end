import { Fly } from "flyio";
import { delUserInfo, getUserInfo } from "./user";
import router from "@/router";
import { ElNotification } from "element-plus";

const EtimeoutStep = 4000

export function flyInit(fly: Fly) {
    fly.config.timeout = EtimeoutStep
    // 请求token自动注入
    fly.interceptors.request.use((request) => {
        if (getUserInfo().isLogin) {
            const token = getUserInfo().token
            request.headers['Authorization'] = `Bearer ${token}`
        }
        return request
    })
    // 响应拦截
    fly.interceptors.response.use(
        (res) => {
            if (res?.data?.code === 403) {
                router.replace('/denied');
                // 可选：中断请求链，防止后续再处理这个异常
                return new Promise(() => { });
            }
            return res;
        },
        (err: unknown) => {
            const flyioError = err as {
                status?: number;
                response?: { headers: Record<string, string> };
            };

            if (flyioError.status === 401 || flyioError.response?.headers['x-token-expired']) {
                delUserInfo();
                ElNotification.error({
                    title: '认证过期',
                    message: '请重新登录'
                })
                router.replace('/login');
                return new Promise(() => { });
            }
            return Promise.reject(err);
        }
    )
}