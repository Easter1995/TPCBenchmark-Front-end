import { IUserAllData, IUserList, IUserResponse, IUsersApproved } from "@/typings/user";
import { getUserInfo } from "@/utils/user";
import fly, { FlyPromise } from "flyio";

export function getApproveList(): FlyPromise<IUserResponse<IUserList>> {
    const token = getUserInfo().token
    return fly.get(
        '/users/pending', null,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export function approveUsers(
    ids: Array<number>
): FlyPromise<IUserResponse<IUsersApproved | null>> {
    const token = getUserInfo().token
    return fly.post(
        '/users/approve',
        { ids },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export function getAllUsers(): FlyPromise<IUserResponse<IUserList>> {
    const token = getUserInfo().token
    return fly.get(
        '/users/all', null,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export function delUsers(
    username: String
): FlyPromise<IUserResponse<null>> {
    const token = getUserInfo().token
    return fly.delete(
        '/users/delete',
        { username },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}