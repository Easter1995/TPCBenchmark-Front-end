import { ITableInfo, ITableKeyConstrain, ITableResponse } from "@/typings/data";
import { FlyPromise } from "flyio";
import fly from "@/utils/fly";

/**
 * 新建表格
 */
export function createTable(tableName: string, columns: Array<ITableKeyConstrain>): FlyPromise<ITableResponse<ITableInfo>> {
    const requestBody = {
        tableName: tableName,
        columns: columns.map(col => ({
            name: col.name,
            type: col.type,
            constraints: {
                upperLimit: col.upperLimit,
                lowerLimit: col.lowerLimit,
                notNull: col.notNull,
                primaryKey: col.primaryKey
            }
        }))
    }

    return fly.post('/table/create', requestBody)
}

/**
 * 获取全部表格
 */
export function getTables(): FlyPromise<ITableResponse<ITableInfo[]>> {
    return fly.get('/table/allTables')
}