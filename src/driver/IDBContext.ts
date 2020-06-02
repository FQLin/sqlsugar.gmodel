export interface IDBContext{
    query<Entity>(sql:string):Promise<Entity[]>;
    connect(): Promise<any>;
    close(): Promise<void>;
}