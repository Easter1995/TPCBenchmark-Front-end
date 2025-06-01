import { IClientInfo, IClientQuery, INewOrder, INewOrderRes, IPayment, IPaymentRes, IQueryResponse, IShipPriorQuery, IShipPriorRes, ISmallOrderQuery, ISmallOrderRes } from "@/typings/service";
import { FlyPromise } from "flyio";
import fly from "@/utils/fly";

// TPC-H查询
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

export function exportCliInfo(param: IClientInfo, exportPath: string): FlyPromise<IQueryResponse<null>> {
    const encodedPath = encodeURIComponent(exportPath)
    return fly.post(
        `/export/client-info?exportPath=${encodedPath}`, param, {
            timeout: 120000
        }
    )
}

export function exportShipPrior(param: IShipPriorRes, exportPath: string): FlyPromise<IQueryResponse<null>> {
    const encodedPath = encodeURIComponent(exportPath)
    return fly.post(
        `/export/shipping-priority?exportPath=${encodedPath}`, param, {
            timeout: 120000
        }
    )
}

// TPC-C查询
export function addOrder(param: INewOrder): FlyPromise<IQueryResponse<INewOrderRes>> {
    return fly.post(
        '/tpcc/new-order', param
    )
}

export function updatePayment(param: IPayment): FlyPromise<IQueryResponse<IPaymentRes>> {
    return fly.post(
        '/tpcc/payment', param
    )
}