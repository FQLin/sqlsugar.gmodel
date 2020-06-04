export interface IDBContext{
    query<Entity>(sql:string):Promise<Entity[]>;
    // query<Entity>(sql:string):Entity[];
    connect(): Promise<any>;
    close(): Promise<void>;
}