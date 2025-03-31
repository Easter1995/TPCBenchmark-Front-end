import { IUserResponse, loginData, regisData } from '@/typings/user'
import { FlyPromise } from 'flyio'
import fly from '@/utils/fly'

/**
 * 用户登录
 * @param username 用户名
 * @param password 用户密码
 * @returns token name role
 */
export function userLogin(
    username: string,
    password: string,
): FlyPromise<IUserResponse<loginData>> {
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

/**
 * 用户注册
 * @param username 用户名
 * @param password 密码
 * @returns 
 */
export function userRegister(
    username: string,
    password: string,
): FlyPromise<IUserResponse<regisData>> {
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