export interface IQueryResponse<T> {
    code: number
    data: T
    message: string
}

/**
 * 客户信息相关
 */
export interface IClientInfoList {
    cuskey: number,
    name: string,
    address: string,
    phone: string,
    acctbal: number,
    mktsegment: string,
    comment: string,

    nationCom: string,
    nationKey: number,
    nationName: string,
    
    regionCom: string,
    regionKey: number,
    regionName: string
}

export interface IClientInfo {
    clientInfoList: Array<IClientInfoList>
    total: number,
    currentPage: number,
    pageSize: number
}

export interface IClientQuery {
    currentPage: number,
    pageSize: number,
    nationKeyword?: string,
    nameKeyword?: string
}

/**
 * 订单 ORDER 或零部件 PART 相关的查询
 */
export interface IShipPriorQuery {
    marketSegment: string,
    orderlimit: number | null,
    shipDateAfter: string,
    orderDateBefore: string
}

interface Oinfo {
    orderKey: number,
    revenue: number,
    orderDate: string,
    shipPriority: number
}

export interface IShipPriorRes {
    count: number,
    orders: Array<Oinfo>
}