import { IDBContext } from "../IDBContext";
import mssql,{Request,config, ConnectionPool} from "mssql";
import { requiredParam } from "../../decorators/Parameter/required";

export class SqlServerContext implements IDBContext{
    readonly _db:ConnectionPool;
    constructor(@requiredParam options:config){
        this._db= new mssql.ConnectionPool(options);
    }

    connect(): Promise<ConnectionPool> {
        return this._db.connect();
    }

    async query<Entity>(command: string): Promise<Entity[]> {
        return (await this._db.query<Entity>(command)).recordset;
    }

    close(): Promise<void> {
        return this._db.close();
    }

}