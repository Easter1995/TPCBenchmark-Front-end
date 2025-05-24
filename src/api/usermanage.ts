import { IUserList, IUserResponse, IUsersApproved } from "@/typings/user";
import { FlyPromise } from "flyio";
import fly from '@/utils/fly'

export function getApproveList(): FlyPromise<IUserResponse<IUserList>> {
    return fly.get(
        '/users/pending', null,
    )
}

export function approveUsers(
    ids: Array<number>
): FlyPromise<IUserResponse<IUsersApproved | null>> {
    return fly.post(
        '/users/approve',
        { ids },
    )
}

export function getAllUsers(): FlyPromise<IUserResponse<IUserList>> {
    return fly.get(
        '/users/all', null,
    )
}

export function delUsers(
    username: String
): FlyPromise<IUserResponse<null>> {
    return fly.delete(
        '/users/delete',
        { username },
    )
}