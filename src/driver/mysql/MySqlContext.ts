import { IDBContext } from "../IDBContext";

export class MySqlContext implements IDBContext{
    query<Entity>(sql: string): Promise<Entity[]> {
        throw new Error("Method not implemented.");
    }
    connect(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    close(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}