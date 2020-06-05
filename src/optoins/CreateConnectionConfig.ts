import { IConnectionOptions as SqlServerConnectionOptions } from "../driver/sqlserver/IConnectionOptions";
import { required } from "../decorators/property/required";
import { BaseCreateOptions } from "./BaseCreateOptions";

export class CreateConnectionConfig extends BaseCreateOptions{
    /**
     * 链接配置
     */
    @required
    connectionOptions!: SqlServerConnectionOptions;
}