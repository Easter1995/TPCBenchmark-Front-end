import { IClientInfo, IClientQuery, IQueryResponse, IShipPriorQuery, IShipPriorRes, ISmallOrderQuery, ISmallOrderRes } from "@/typings/service";
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

export function getShipPrior(param: IShipPriorQuery): FlyPromise<IQueryResponse<IShipPriorRes>> {
    return fly.post(
        '/query/shipping-priority', param, {
            timeout: 180000
        }
    )
}

export function getSmallOrder(param: ISmallOrderQuery): FlyPromise<IQueryResponse<ISmallOrderRes>> {
    return fly.post(
        '/query/small-order', param, {
            timeout: 180000
        }
    )
}