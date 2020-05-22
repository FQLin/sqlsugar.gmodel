"use strict";

const mssql = require("mssql");
const { isPlainObject } = require("./func");
/*
function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
}*/

class devModelTool {
    constructor(options = { }) {
        if (isPlainObject(options) === false) {
            throw new Error(`only accepts an options object.`);
        }


        this.connectionConfig = options.connectionConfig;
        
    }

    dbToModel() {
        //验证 sql server 连接字符串配置
        if (this.connectionConfig === null) {
            throw new Error(`please set mssql connectionconfig`);
        } else {
            if (isPlainObject(this.connectionConfig) === false) {
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
}