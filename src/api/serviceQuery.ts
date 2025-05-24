import { IClientInfo, IClientQuery, IQueryResponse } from "@/typings/service";
import { FlyPromise } from "flyio";
import fly from "@/utils/fly";

export function getClientInfo(param: IClientQuery): FlyPromise<IQueryResponse<IClientInfo>> {
    return fly.post(
        '/query/client-info', param
    )
}

export function getTableInfo(tableName: String): FlyPromise<IQueryResponse<any>> {
    return fly.get(
        `/query/table-info?tableName=${tableName}`
    )
}