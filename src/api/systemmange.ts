import { Fly, FlyPromise } from "flyio";
import fly from "@/utils/fly";
import qs from 'qs'
import { IConnectionsRes, IModifyQuery, IModifyRes, IPhysical, ISysResponse, IVariable } from "@/typings/system";

export function getConnections(): FlyPromise<ISysResponse<Array<IConnectionsRes>>> {
    return fly.get('/db/connections')
}

export function getVariables(): FlyPromise<ISysResponse<Array<IVariable>>> {
    return fly.get('/db/variables')
}

export function getStatus(): FlyPromise<ISysResponse<Array<IVariable>>> {
    return fly.get('/db/status')
}

export function getPhysicalInfo(tableName: string): FlyPromise<ISysResponse<IPhysical>> {
    return fly.get(`/db/tables/${tableName}?schemaName=dbs_proj`, null, {
        timeout: 60000
    })
}

export function modifyConnection(param: IModifyQuery): FlyPromise<ISysResponse<IModifyRes>> {
    return fly.post('/db/connection-timeout/modify', qs.stringify(param), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}