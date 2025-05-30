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
 * TPC-H
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

export interface ISmallOrderQuery {
    years: number | null,
    brand: string,
    container: string
}

export interface ISmallOrderRes {
    avgrevenue: number
}

/**
 * TPC-C
 */
export interface INewOrder {
    warehouseId: number | null,
    districtId: number | null,
    customerId: number | null,
    items: Array<INewOrderItem>
}

export interface INewOrderItem {
    itemId: number | null,
    supplierId: number | null,
    quantity: number | null
}

export interface INewOrderRes {
    orderId: number,
    warehouseId: number,
    districtId: number,
    customerId: number,
    entryDate: string,
    totalAmount: number,
    executionTimeMs: number,
    sqlDetails: Array<sqlDetailsItem>
    items: Array<INewOrderResItem>
}

export interface INewOrderResItem {
    itemId: number,
    itemName: string,
    supplierId: number,
    quantity: number,
    amount: number,
    stockStatus: string,
    brand: string
}

export interface IPayment {
    warehouseId: number | null,
    districtId: number | null,
    customerId: number | null,
    paymentAmount: number | null
}

export interface IPaymentRes {
    warehouseId: number,
    warehouseName: string,
    districtId: number,
    districtName: string,
    customerId: number,
    customerName: string,
    paymentDate: string,
    paymentAmount: number,
    customerBalanceBeforePayment: number,
    customerBalanceAfterPayment: number,
    executionTimeMs: number,
    sqlDetails: Array<sqlDetailsItem>
}

export interface sqlDetailsItem {
    sqlType: string,
    description: string,
    executionTimeMs: number
}