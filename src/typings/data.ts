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
}
export class ITableKeyConstrain {
    name: string = '';      // 属性名
    type: string = '';     // 类型
    upperLimit?: number;   // 上限
    lowerLimit?: number;   // 下限
    notNull?: boolean = false;
    primaryKey?: boolean = false;
    length?: number
    
    constructor(options?: Partial<ITableKeyConstrain>) {
        Object.assign(this, options);
    }
}
export interface INewTable {
    tableName: string, // 表名
    columns: Array<ITableKeyConstrain>
}