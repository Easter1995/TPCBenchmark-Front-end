export interface ISysResponse<T> {
    code: number,
    message: string,
    data: T
}

export interface IConnectionsRes {
    id: number,
    user: string,
    host: string,
    db: string,
    command: string,
    time: number,
    state: string,
    info: string
}

export interface IVariable {
    Variable_name: string,
    Value: string
}