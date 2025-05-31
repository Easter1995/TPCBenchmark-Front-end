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

export interface IPhysical {
    indexes: Array<Indexes>,
    tableInfo: TableInfo,
    physicalStorage: PhysicalStorage
}

export interface Indexes {
    INDEX_NAME: string,
    COLUMN_NAME: string,
    NON_UNIQUE: number,
    SEQ_IN_INDEX: number,
    CARDINALITY: number
}

export interface TableInfo {
    TABLE_CATALOG: string,
    TABLE_SCHEMA: string,
    TABLE_NAME: string,
    TABLE_TYPE: string,
    ENGINE: string,
    VERSION: number,
    ROW_FORMAT: string,
    TABLE_ROWS: number,
    AVG_ROW_LENGTH: number,
    DATA_LENGTH: number,
    MAX_DATA_LENGTH: number,
    INDEX_LENGTH: number,
    DATA_FREE: number,
    AUTO_INCREMENT: number,
    CREATE_TIME: string,
    UPDATE_TIME: string,
    CHECK_TIME: string,
    TABLE_COLLATION: string,
    CHECKSUM: number,
    CREATE_OPTIONS: string,
    TABLE_COMMENT: string
}

export interface PhysicalStorage {
    createStatement: string,
    dataDirectory: string
}