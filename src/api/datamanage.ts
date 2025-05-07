import { IDataImportInfo, ITableInfo, ITableKeyConstrain, ITableResponse } from "@/typings/data";
import { FlyPromise } from "flyio";
import fly from "@/utils/fly";
import axios, { AxiosProgressEvent, AxiosResponse } from 'axios'
import { getUserInfo } from "@/utils/user";

/**
 * 新建表格
 */
export function createTable(tableName: string, columns: Array<ITableKeyConstrain>): FlyPromise<ITableResponse<ITableInfo>> {
    const requestBody = {
        tableName: tableName,
        columns: columns
    }
    return fly.post('/table/create', requestBody)
}

/**
 * 获取全部表格
 */
export function getTables(): FlyPromise<ITableResponse<ITableInfo[]>> {
    return fly.get('/table/allTables')
}

/**
 * 导入数据
 */
export function importFile(
    tableName: string,
    file: File,
    onProgressCallback: (percent: number) => void,
    signal?: AbortSignal
  ): Promise<ITableResponse<IDataImportInfo>> {
    const formData = new FormData();
    tableName = tableName.toUpperCase();
    formData.append('tableName', tableName);
    formData.append('file', file);
    const token = getUserInfo().token
    
    return axios.post<ITableResponse<IDataImportInfo>>('/import/data', formData, {
      signal,
      timeout: 600000,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total || file.size
        const percentage = Math.round((progressEvent.loaded * 100) / total)
        onProgressCallback(percentage)
      }
    }).then((res: AxiosResponse<ITableResponse<IDataImportInfo>>) => res.data)
  }