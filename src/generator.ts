import { ConnectionOptions } from "./driver/mssqlserver/ConnectionOptions";
import { options } from "./driver/options";

const mssql = require("mssql");
const { isPlainObject } = require("./func");

export function generate(options:options){
    //验证 sql server 连接字符串配置
    if (options === null) {
        throw new Error(`please set sql connectionconfig`);
    } else {
        if (options.connectionOption === null) {
            throw new Error(`only accepts an options.connectionConfig object.`);
        }

        if (this.connectionConfig.user === null) {
            throw new Error(`please set mssql connectionconfig user`);
        }
        if (this.connectionConfig.password === null) {
            throw new Error(`please set mssql connectionconfig password`);
        }
        if (this.connectionConfig.server === null) {
            throw new Error(`please set mssql connectionconfig server`);
        }
        if (this.connectionConfig.database === null) {
            throw new Error(`please set mssql connectionconfig database`);
        }
    }

    mssql.connect(this.connectionConfig).then(() => {
        let request = new sql.Request();


    });
}