import { IDataImportInfo, IDataImportProgress, ITableInfo, ITableKeyConstrain, ITableResponse } from "@/typings/data";
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
 * 获取可导出的表格
 */
export function getExportableTables(): FlyPromise<ITableResponse<[]>> {
  return fly.get('/export/tables')
}

/**
 * 
 * @param tableName 表名
 * @param exportPath 路径 
 */
export function exportTable(tableName: string, exportPath: string): FlyPromise<any> {
  const encodedPath = encodeURIComponent(exportPath)
  const tableNameL = tableName.trim().toLowerCase()
  return fly.get(`/export/csv/${tableNameL}?exportPath=${encodedPath}`, null, {
    timeout: 120000
  })
}


/**
 * 导入数据
 */
export async function importFile(
  tableName: string,
  file: File,
  onProgressCallback: (percent: number) => void,
  signal?: AbortSignal
): Promise<ITableResponse<IDataImportInfo>> {
  const formData = new FormData()
  tableName = tableName.toUpperCase()
  formData.append('tableName', tableName)
  formData.append('file', file)
  const token = getUserInfo().token

  const res = await axios.post<ITableResponse<IDataImportInfo>>('/import/data', formData, {
    signal,
    timeout: 60000,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    onUploadProgress: (progressEvent_1: AxiosProgressEvent) => {
      const total = progressEvent_1.total || file.size;
      const percentage = Math.round((progressEvent_1.loaded * 100) / total);
      onProgressCallback(percentage);
    }
  });
  return res.data;
}

/**
 * 获取导入进度
 */
export function getImportProgress(taskId: string): FlyPromise<ITableResponse<IDataImportProgress>> {
  return fly.get(`/import/progress?taskId=${encodeURIComponent(taskId)}`)
}

/**
 * 导入完成删除任务
 */
export function removeImportTask(taskId: string): FlyPromise<ITableResponse<null>> {
  const formData = new FormData()
  formData.append('taskId', taskId)
  return fly.post('/import/remove-task', formData)
}