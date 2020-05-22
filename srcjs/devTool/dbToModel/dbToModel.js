const SqlServerDbMaintenance = require("./sqlServerDbMaintenance");
const DbFirstTemplate = require("./dbFirstTemplate");
const fs = require("fs");
const func = require("./../func");
const mssql = require("mssql");
const path = require("path");

const DataTypeMapping={
    "varchar": "string",
    "nvarchar": "string",
    "bigint": "long",
    "bit": "bool",
    "uniqueidentifier": "Guid",
    "tinyint": "byte",
    "money": "decimal",
    "int": "int",
    "float": "float",
    "decimal": "decimal",
    "datetime": "DateTime",
    "char": "string"
};


class dbToModel {
    constructor(options = {}) {
        if (func.isPlainObject(options) === false) {
            throw new Error(`only accepts an options object.`);
        }

        //验证 sql server 连接字符串配置
        if (options === undefined) {
            throw new Error(`please set mssql connectionconfig`);
        } else {
            if (func.isPlainObject(options.connectionConfig) === false) {
                throw new Error(`only accepts an options.connectionConfig object.`);
            }
            
            if (options.connectionConfig.user === undefined) {
                throw new Error(`please set mssql connectionconfig user`);
            }
            if (options.connectionConfig.password === undefined) {
                throw new Error(`please set mssql connectionconfig password`);
            }
            if (options.connectionConfig.server === undefined) {
                throw new Error(`please set mssql connectionconfig server`);
            }
            if (options.connectionConfig.database === undefined) {
                throw new Error(`please set mssql connectionconfig database`);
            }

            if(options.outputPath === undefined){
                throw new Error(`please set outputPath`);
            }
            if(options.nameSpace === undefined){
                throw new Error(`please set nameSpace`);
            }
        }
        
        //连接字符串
        this.connectionConfig = options.connectionConfig;
        //默认值
        this.isDefaultValue = func.parseToBoolean(options.isDefaultValue,false);
        this.isAttribute = func.parseToBoolean(options.isAttribute,false);
        //输出目录
        this.outputPath = path.resolve(options.outputPath);
        //命名空间
        this.namespace=options.nameSpace;
        //忽略 Diagram
        this.ignoreDiagram = func.parseToBoolean(options.ignoreDiagram,true);
        //忽略列
        this.ignoreColumns = Array.isArray(options.ignoreColumns) ? options.ignoreColumns : [];
        //表和entity的映射关系
        this.mappingTables = func.isPlainObject(options.mappingTables) ? options.mappingTables : {};
        //列和属性的映射关系
        this.mappingColumns=func.isPlainObject(options.mappingColumns) ? options.mappingColumns : {};
        //自定义数据类型映射关系
        this.mappingDataType = func.isPlainObject(options.mappingDataType) ? options.mappingDataType : {};


        this.ClassTemplate = DbFirstTemplate.ClassTemplate;
        this.ConstructorTemplate = DbFirstTemplate.ConstructorTemplate;
        //using
        this.UsingTemplate = DbFirstTemplate.UsingTemplate;
        this.ClassDescriptionTemplate = DbFirstTemplate.ClassDescriptionTemplate;
        this.PropertyTemplate = DbFirstTemplate.PropertyTemplate;
        this.PropertyDescriptionTemplate = DbFirstTemplate.PropertyDescriptionTemplate;

        /**全局变量 */
        this.finalUsing;
        this.finalClassName;
    }

    async apply() {
        await mssql.connect(this.connectionConfig);
        console.log("connection success");
        this.request=new mssql.Request();

        //查询表 设置 TableInfoList
        await this.getTableInfoList();
        //查询视图 设置 TableInfoList
        await this.getViewInfoList();
        //类文件字符串
        let classStringList = await this.toClassStringList();
        if(!fs.existsSync(this.outputPath)){
            fs.mkdirSync(this.outputPath);
        }
        
        classStringList.forEach((classString,key)=>{
            let filePath=`${this.outputPath.trim()}/${key}.cs`;
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }

            fs.writeFileSync(filePath,classString);
        });

        console.log("success");
    }

    async getViewInfoList() {
        let viewInfo = await this.request.query(SqlServerDbMaintenance.GetViewInfoListSql);
        //return viewInfo.recordset;
        //console.log(JSON.stringify(viewInfo.recordset));
    }
    async getTableInfoList() {
        let tableInfo = await this.request.query(SqlServerDbMaintenance.GetTableInfoListSql);
        this.TableInfoList = tableInfo.recordset;
        // tableInfo = { Name: null, Description: null }
        // console.log(JSON.stringify(tableInfo));
    }
    async toClassStringList() {
        let result = new Map();
        if (this.TableInfoList !== null) {
            for (let i = 0; i < this.TableInfoList.length; i++) {
                const tableInfo = this.TableInfoList[i];
                //去除系统表
                if(this.ignoreDiagram && tableInfo.Name === "sysdiagrams"){
                    continue;
                }
                try {
                    //let className = tableInfo.Name;
                    let classText = await this.getClassString(tableInfo);
                    result.delete(this.finalClassName);
                    result.set(this.finalClassName, classText);
                } catch (error) {
                    throw `Table '${tableInfo.Name}' error,\r\n Error message:${error}`;
                }
            }
        } else {
            console.log(`tableinfo null`);
        }

        return result;
    }
    //类字符串
    async getClassString(tableInfo) {
        let classText = this.ClassTemplate;
        this.finalUsing = this.UsingTemplate;
        this.finalClassName = tableInfo.Name;
        //自定义数据类型的命名空间
        if(this.mappingDataType[tableInfo.Name] && this.mappingDataType.nameSpace){
            //判断一下要添加的命名空间引用是否已经存在
            if(this.finalUsing.indexOf(`using ${this.mappingDataType.nameSpace};`) === -1){
                this.finalUsing += `using ${this.mappingDataType.nameSpace};\r\n`;
            }
            let classUsing=this.mappingDataType[tableInfo.Name].nameSpace;
            if(classUsing && this.finalUsing.indexOf(`using ${classUsing};`) === -1){
                this.finalUsing += `using ${classUsing};\r\n`;
            }
        }
        //设置了不同的映射关系
        if (this.mappingTables[tableInfo.Name]) {
            let entityName=this.mappingTables[tableInfo.Name];
            this.finalClassName = entityName;
            classText = classText.replace(new RegExp(DbFirstTemplate.KeyClassName,'g'),entityName);
            classText = classText.replace(new RegExp(DbFirstTemplate.KeySugarTable,'g'),(DbFirstTemplate.ValueSugarTable.replace("{0}", tableInfo.Name)));
        }

        let columnInfo = await this.getColumnInfosByTableName(tableInfo);
        //忽略列
        if (this.ignoreColumns.length > 0) {

        }
        
        let constructorText = this.isDefaultValue ? this.ConstructorTemplate : null;
        
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyClassName,'g'), this.finalClassName);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyNamespace,'g'), this.namespace);
        //classText = classText.replace(new RegExp(DbFirstTemplate.KeyUsing,'g'), this.UsingTemplate);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyClassDescription,'g'), this.ClassDescriptionTemplate.replace(new RegExp(DbFirstTemplate.KeyClassDescription,'g'), tableInfo.Description + "\r\n"));
        classText = classText.replace(new RegExp(DbFirstTemplate.KeySugarTable,'g'), this.IsAttribute ? (DbFirstTemplate.ValueSugarTable.replace("{0}", tableInfo.Name)) : "");
        if (columnInfo) {
            columnInfo.forEach((item, index) => {
                let isLast = columnInfo.Length === (index + 1);
                let propertyText = this.PropertyTemplate;
                let propertyDescriptionText = this.PropertyDescriptionTemplate;
                let propertyName = this.getPropertyName(item);
                //let propertyTypeName = this.getPropertyTypeName(item);
                propertyText = this.getPropertyText(item, propertyText);
                propertyDescriptionText = this.getPropertyDescriptionText(item, propertyDescriptionText);
                propertyText = propertyDescriptionText + propertyText;
                classText = classText.replace(new RegExp(DbFirstTemplate.KeyPropertyName,'g'), propertyText + (isLast ? "" : ("\r\n" + DbFirstTemplate.KeyPropertyName)));
                if (constructorText && item.DefaultValue !== null) {
                    var hasDefaultValue = columns.Skip(index + 1).Any(it => it.DefaultValue.HasValue());
                    constructorText = constructorText.replace(new RegExp(DbFirstTemplate.KeyPropertyName,'g'), propertyName);
                    constructorText = constructorText.replace(new RegExp(DbFirstTemplate.KeyDefaultValue,'g'), GetPropertyTypeConvert(item)) + (!hasDefaultValue ? "" : this.ConstructorTemplate);
                }
            });
        }

        let hasDefaultValue = false;
        columnInfo.find((value, index) => {
            if (value.DefaultValue !== null) {
                hasDefaultValue = true;
                return;
            }
        })
        if (!hasDefaultValue || constructorText === null) {
            constructorText = "";
        }
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyUsing,'g'), this.finalUsing);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyConstructor,'g'), constructorText);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyPropertyName,'g'), "");
        return classText;
    }
    //根据 tablename 查询字段
    async getColumnInfosByTableName(tableInfo) {
        if (tableInfo) {
            let sql = SqlServerDbMaintenance.GetColumnInfosByTableNameSql(tableInfo.Name);
            let columnInfo = await this.request.query(sql);
            return columnInfo.recordset;

        } else {
            return [];
        }

        let columnInfo = {
            "TableName": "tbl_Employment",
            "TableId": 1301579675,
            "DbColumnName": "Id",
            "DataType": "varchar",
            "Length": 32,
            "ColumnDescription": "Id",
            "DefaultValue": null,
            "IsNullable": 0,
            "IsIdentity": 0,
            "IsPrimaryKey": 1
        };
    }
    //属性名称
    getPropertyName(columnInfo) {
        if(this.mappingColumns[columnInfo.TableName]){
            let propertyName=this.mappingColumns[columnInfo.TableName].columns[columnInfo.DbColumnName];
            if(propertyName){
                return propertyName;
            }
        }

        return columnInfo.DbColumnName;
    }
    //属性 字符串
    getPropertyText(columnInfo, propertyText) {
        let sugarColumnText = DbFirstTemplate.ValueSugarCoulmn;
        let propertyName = this.getPropertyName(columnInfo);
        let isMappingColumn = propertyName !== columnInfo.DbColumnName;
        let joinList = [];
        if (columnInfo.IsPrimaryKey) {
            joinList.push("IsPrimaryKey=true");
        }
        if (columnInfo.IsIdentity) {
            joinList.push("IsIdentity=true");
        }
        if (isMappingColumn) {
            joinList.push(`ColumnName=\"${columnInfo.DbColumnName}\"`);
        }
        if (joinList.length > 0) {
            sugarColumnText = sugarColumnText.replace("{0}", joinList.join(','));
        } else {
            sugarColumnText = "";
        }

        let typeString = this.getPropertyTypeName(columnInfo);
        propertyText = propertyText.replace(new RegExp(DbFirstTemplate.KeySugarColumn,'g'), sugarColumnText);
        propertyText = propertyText.replace(new RegExp(DbFirstTemplate.KeyPropertyType,'g'), typeString);
        propertyText = propertyText.replace(new RegExp(DbFirstTemplate.KeyPropertyName,'g'), propertyName);
        return propertyText;
    }
    //属性类型
    getPropertyTypeName(columnInfo) {
        if(this.mappingDataType[columnInfo.TableName] && this.mappingDataType[columnInfo.TableName][columnInfo.DbColumnName]){
            let columnDT=this.mappingDataType[columnInfo.TableName][columnInfo.DbColumnName];
            console.log(columnDT);
            if(typeof(columnDT) === "string"){
                return columnDT;
            }else if(func.isPlainObject(columnDT)){
                if(columnDT.nameSpace && this.finalUsing.indexOf(columnDT.nameSpace) === -1){
                    this.finalUsing += `using ${columnDT.nameSpace};\r\n`;
                }
                return columnDT.dataType;
            }else{
                throw new Error(`mappingDataType column must be object or string`);
            }
        }else{
            let cSharpDataType = DataTypeMapping[columnInfo.DataType.toLowerCase()];
            return cSharpDataType ? cSharpDataType : "object";
        }
    }
    //属性备注
    getPropertyDescriptionText(columnInfo, propertyDescriptionText) {
        propertyDescriptionText = propertyDescriptionText.replace(new RegExp(DbFirstTemplate.KeyPropertyDescription,'g'), this.getColumnDescription(columnInfo.ColumnDescription));
        propertyDescriptionText = propertyDescriptionText.replace(new RegExp(DbFirstTemplate.KeyDefaultValue,'g'), this.getProertypeDefaultValue(columnInfo));
        propertyDescriptionText = propertyDescriptionText.replace(new RegExp(DbFirstTemplate.KeyIsNullable,'g'), columnInfo.IsNullable ? "true" : "false");
        return propertyDescriptionText;
    }
    getColumnDescription(columnDescription) {
        if (columnDescription == null) return columnDescription;
        columnDescription = columnDescription.replace(new RegExp("\r",'g'), "\t");
        columnDescription = columnDescription.replace(new RegExp("\n",'g'), "\t");
        columnDescription = columnDescription.replace(new RegExp("\t{2,}",'g'), "\t");
        return columnDescription;
    }
    getProertypeDefaultValue(columnInfo) {
        var result = columnInfo.DefaultValue;
        if (result == null) return null;
        // if (Regex.IsMatch(result, @"^\(\'(.+)\'\)$"))
        // {
        //     result = Regex.Match(result, @"^\(\'(.+)\'\)$").Groups[1].Value;
        // }
        // if (Regex.IsMatch(result, @"^\(\((.+)\)\)$"))
        // {
        //     result = Regex.Match(result, @"^\(\((.+)\)\)$").Groups[1].Value;
        // }
        // if (Regex.IsMatch(result, @"^\((.+)\)$"))
        // {
        //     result = Regex.Match(result, @"^\((.+)\)$").Groups[1].Value;
        // }
        // if (result.Equals(this.SqlBuilder.SqlDateNow, StringComparison.CurrentCultureIgnoreCase))
        // {
        //     result = "DateTime.Now";
        // }
        // result = result.replace(new RegExp("\r", "\t").replace(new RegExp("\n", "\t");
        // result = result.IsIn("''", "\"\"") ? string.Empty : result;
        return result;
    }
}

module.exports = dbToModel;