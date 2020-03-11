import { ConnectionOptions } from "./driver/mssqlserver/ConnectionOptions";
import { options } from "./driver/options";
import {Request} from "mssql";

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

        if (options.connectionOption.user === null) {
            throw new Error(`please set mssql connectionconfig user`);
        }
        if (options.connectionOption.password === null) {
            throw new Error(`please set mssql connectionconfig password`);
        }
        if (options.connectionOption.server === null) {
            throw new Error(`please set mssql connectionconfig server`);
        }
        if (options.connectionOption.database === null) {
            throw new Error(`please set mssql connectionconfig database`);
        }
    }

    
    mssql.connect(options.connectionOption).then((obj:any) => {
        console.log(obj);
    });
}