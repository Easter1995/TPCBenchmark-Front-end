// 数据管理相关

/**
 * 数据导入相关
 */
export interface ITableInfo {
    name: string, // 表名
    lastUpdate: string, // 最后更新日期
    size: string // 大小
}
export interface ITableKeyConstrain {
    key: string, // 属性名
    type: string // 类型
    // 可选
    upperLimit?: number // 上限 <=
    lowerLimit?: number // 下限 >=
    notNull?: boolean // 非空
    primary?: boolean // 主键，默认不是
}
export interface INewTable {
    name: string, // 表名
    keys: Array<ITableKeyConstrain>
}