import { IBaseConnectionOptions } from "../../connection/IBaseConnectionOptions";
import { DatabaseType } from "../type/DatabaseType";
import { config } from "mssql";

export interface IConnectionOptions extends config, IBaseConnectionOptions{

    connectTimeout :number;

    readonly type:DatabaseType;
    /**
     * 构造函数
     * constructor(user:string,password:string,server:string,database:string) {
     * this.user=user;
     * this.password=password;
     * this.server=server;
     * this.database=database;
     * }
     */
}