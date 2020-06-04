import { IBaseConnectionOptions } from "./connection/IBaseConnectionOptions";
import { Driver } from "./driver/Driver";
import { IDBContext } from "./driver/IDBContext";
import { requiredParam } from "./decorators/Parameter/required";
import { DatabaseType } from "./driver/type/DatabaseType";
import { SqlServerContext } from "./driver/sqlserver/SqlServerContext";
import { IConnectionOptions } from "./driver/sqlserver/IConnectionOptions";
import { MySqlContext } from "./driver/mysql/MySqlContext";
import { Database } from "./matedata/Database";
import { IQuerySQL } from "./matedata/SQL/IQuerySQL";
import { SqlServerSQL } from "./matedata/SQL/SqlServerSQL";
import { TableInfo } from "./matedata/Entity/TableInfo";

export class Gmodel{
    private options:Driver;
    private context:IDBContext;
    private readonly _querySQL:IQuerySQL;

    private readonly _db:Database;

    /**
     * 全局变量
     */
    private finalUsing:string="";
    private finalClassName:string="";

    constructor(@requiredParam opt:Driver){
        this.options=opt;
        switch (this.options.connectionOptions.type) {
            case DatabaseType.sqlserver:
                this.context=new SqlServerContext(this.options.connectionOptions as IConnectionOptions);
                this._querySQL=new SqlServerSQL();
                break;
            case DatabaseType.mysql:
                this.context=new MySqlContext();
            default:
                throw new RangeError(`not a supported database type`);
                break;
        }

        this._db=new Database(this.context,this._querySQL);
    }
    create():void{

    }

    async GetClassTemString():Promise<Map<string,string>> {
        const result = new Map();
        for (const [index,table] of this._db.Tables.entries()) {
            // 去除系统表
            if(this.options.ignoreDiagram && table.Name === "sysdiagrams"){
                continue;
            }
            try {
                const classText = await this.getClassString(tableInfo);
                result.delete(this.finalClassName);
                result.set(this.finalClassName, classText);
            } catch (error) {
                throw new Error(`Table '${tableInfo.Name}' error,\r\n Error message:${error}`);
            }
        }
        if (this._db.Tables.length > 0) {
            for (let i = 0; i < this.TableInfoList.length; i++) {
                const tableInfo = this.TableInfoList[i];
                // 去除系统表
                if(this.ignoreDiagram && tableInfo.Name === "sysdiagrams"){
                    continue;
                }
                try {
                    // let className = tableInfo.Name;
                    const classText = await this.getClassString(tableInfo);
                    result.delete(this.finalClassName);
                    result.set(this.finalClassName, classText);
                } catch (error) {
                    throw new Error(`Table '${tableInfo.Name}' error,\r\n Error message:${error}`);
                }
            }
        } else {
            console.log(`tableinfo null`);
        }

        return result;
    }

    /**
     * 类字符串
     * @param tableInfo table info
     */
    async getClassString(tableInfo:TableInfo) {
        let classText = CSharpTemplate.ClassTemplate;
        this.finalUsing = CSharpTemplate.UsingTemplate;
        this.finalClassName = tableInfo.Name;
        // 自定义数据类型的命名空间
        if(this.options.mappingDataType && this.options.mappingDataType[tableInfo.Name] instanceof Object/* && this.options.mappingDataType.nameSpace*/){
            const mappingNameSpace=this.options.mappingDataType.nameSpace;
            if(mappingNameSpace){
                // 判断一下要添加的命名空间引用是否已经存在
                if(this.finalUsing.indexOf(`using ${mappingNameSpace};`) === -1){
                    this.finalUsing += `using ${mappingNameSpace};\r\n`;
                }
            }

            const mappingTable=this.options.mappingDataType[tableInfo.Name].nameSpace;
            const classUsing=m.nameSpace;
            if(classUsing && this.finalUsing.indexOf(`using ${classUsing};`) === -1){
                this.finalUsing += `using ${classUsing};\r\n`;
            }
        }
        // 设置了不同的映射关系
        if (this.mappingTables[tableInfo.Name]) {
            const entityName=this.mappingTables[tableInfo.Name];
            this.finalClassName = entityName;
            classText = classText.replace(new RegExp(DbFirstTemplate.KeyClassName,'g'),entityName);
            classText = classText.replace(new RegExp(DbFirstTemplate.KeySugarTable,'g'),(DbFirstTemplate.ValueSugarTable.replace("{0}", tableInfo.Name)));
        }

        const columnInfo = await this.getColumnInfosByTableName(tableInfo);
        // 忽略列
        if (this.ignoreColumns.length > 0) {

        }

        let constructorText = this.isDefaultValue ? this.ConstructorTemplate : null;

        classText = classText.replace(new RegExp(DbFirstTemplate.KeyClassName,'g'), this.finalClassName);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyNamespace,'g'), this.namespace);
        // classText = classText.replace(new RegExp(DbFirstTemplate.KeyUsing,'g'), this.UsingTemplate);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyClassDescription,'g'), this.ClassDescriptionTemplate.replace(new RegExp(DbFirstTemplate.KeyClassDescription,'g'), tableInfo.Description + "\r\n"));
        classText = classText.replace(new RegExp(DbFirstTemplate.KeySugarTable,'g'), this.IsAttribute ? (DbFirstTemplate.ValueSugarTable.replace("{0}", tableInfo.Name)) : "");
        if (columnInfo) {
            columnInfo.forEach((item, index) => {
                const isLast = columnInfo.Length === (index + 1);
                let propertyText = this.PropertyTemplate;
                let propertyDescriptionText = this.PropertyDescriptionTemplate;
                const propertyName = this.getPropertyName(item);
                // let propertyTypeName = this.getPropertyTypeName(item);
                propertyText = this.getPropertyText(item, propertyText);
                propertyDescriptionText = this.getPropertyDescriptionText(item, propertyDescriptionText);
                propertyText = propertyDescriptionText + propertyText;
                classText = classText.replace(new RegExp(DbFirstTemplate.KeyPropertyName,'g'), propertyText + (isLast ? "" : ("\r\n" + DbFirstTemplate.KeyPropertyName)));
                if (constructorText && item.DefaultValue !== null) {
                    const hasDefaultValue = columns.Skip(index + 1).Any(it => it.DefaultValue.HasValue());
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
        });
        if (!hasDefaultValue || constructorText === null) {
            constructorText = "";
        }
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyUsing,'g'), this.finalUsing);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyConstructor,'g'), constructorText);
        classText = classText.replace(new RegExp(DbFirstTemplate.KeyPropertyName,'g'), "");
        return classText;
    }
}