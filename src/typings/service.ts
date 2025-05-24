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