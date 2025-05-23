// 数据管理相关
export interface ITableResponse<T> {
    code: number,
    message: string,
    data: T
}

/**
 * 数据导入相关
 */
export interface ITableInfo {
    tablename: string, // 表名
    lastupdate: string, // 最后更新日期
    progressVO?: IDataImportProgress
}
export class ITableKeyConstrain {
    name: string = '';      // 属性名
    type: string = '';     // 类型
    upperLimit?: string | number;   // 上限
    lowerLimit?: string | number;   // 下限
    notNull?: boolean = false;
    primaryKey?: boolean = false;
    length?: string | number
    
    constructor(options?: Partial<ITableKeyConstrain>) {
        Object.assign(this, options);
    }
}
export interface INewTable {
    tableName: string, // 表名
    columns: Array<ITableKeyConstrain>
}

export interface IDataImport {
    tableName: string,
    file: File | null
}

export interface IDataImportInfo {
    tableName: string,
    taskId: string
}

export interface IDataImportProgress {
    taskId: string,
    tableName: string,
    totalLines: number,
    processedLines: number,
    totalBytes: number,
    processedBytes: number,
    percentage: number,
    status: string
}