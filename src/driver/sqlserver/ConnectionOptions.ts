import { IBaseConnectionOptions } from "../../connection/IBaseConnectionOptions";
import { DatabaseType } from "../type/DatabaseType";

export interface IConnectionOptions extends IBaseConnectionOptions{

    connectTimeout :number;
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