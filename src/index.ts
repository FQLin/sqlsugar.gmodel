import { IBaseConnectionOptions } from "./connection/IBaseConnectionOptions";
import { Driver } from "./driver/Driver";
import { IDBContext } from "./driver/IDBContext";
import { requiredParam } from "./decorators/Parameter/required";
import { DatabaseType } from "./driver/type/DatabaseType";
import { SqlServerContext } from "./driver/sqlserver/SqlServerContext";
import { IConnectionOptions } from "./driver/sqlserver/IConnectionOptions";
import { MySqlContext } from "./driver/mysql/MySqlContext";

export class Gmodel{
    private options:Driver;
    private context:IDBContext;

    constructor(@requiredParam opt:Driver){
        this.options=opt;
        switch (this.options.connectionOptions.type) {
            case DatabaseType.sqlserver:
                this.context=new SqlServerContext(this.options.connectionOptions as IConnectionOptions);
                break;
            case DatabaseType.mysql:
                this.context=new MySqlContext();
            default:
                throw new RangeError(`not a supported database type`);
                break;
        }
    }
    create():void{

    }


}