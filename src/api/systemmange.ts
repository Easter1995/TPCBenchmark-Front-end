import { Fly, FlyPromise } from "flyio";
import fly from "@/utils/fly";
import { IConnectionsRes, IPhysical, ISysResponse, IVariable } from "@/typings/system";

export function getConnections(): FlyPromise<ISysResponse<Array<IConnectionsRes>>> {
    return fly.get('/db/connections')
}

export function getVariables(): FlyPromise<ISysResponse<Array<IVariable>>> {
    return fly.get('/db/variables')
}

export function getStatus(): FlyPromise<ISysResponse<Array<IVariable>>> {
    return fly.get('/db/status')
}

export function getPhysicalInfo(schemaName: string, tableName: string): FlyPromise<ISysResponse<IPhysical>> {
    return fly.get(`/db/tables/${tableName}?schemaName=${schemaName}`)
}