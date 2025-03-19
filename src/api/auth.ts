import { IUserLoginResponse, IUserRegisterResponse, loginData, regisData } from '@/typings/userResponse'
import fly, { FlyPromise } from 'flyio'

/**
 * 用户登录
 * @param username 用户名
 * @param password 用户密码
 * @returns token name role
 */
export function userLogin(
    username: string,
    password: string,
): FlyPromise<IUserLoginResponse<loginData>> {
    return fly.post(
        '/users/login',
        JSON.stringify({
            name: username,
            password
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}

export function userRegister(
    username: string,
    password: string,
): FlyPromise<IUserRegisterResponse<regisData>> {
    return fly.post(
        '/users/register',
        JSON.stringify({
            name: username,
            password
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}