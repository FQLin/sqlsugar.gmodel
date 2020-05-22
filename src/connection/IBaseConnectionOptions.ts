import {DatabaseType} from "../driver/type/DatabaseType";

export interface IBaseConnectionOptions{
    /**
     * Database type. This value is required.
     */
    readonly type:DatabaseType

}