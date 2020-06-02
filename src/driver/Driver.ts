import { IBaseConnectionOptions } from "../connection/IBaseConnectionOptions";
import { DynamicType } from "../matedata/type/DynamicType";
import { required } from "../decorators/property/required";
import { IConnectionOptions as SqlServerConnectionOptions } from "./sqlserver/IConnectionOptions";

export class Driver{

    /**
     * 链接配置
     */
    @required
    connectionOptions!: SqlServerConnectionOptions;

    /**
     * 命名空间
     */
    @required
    nameSpace!:string;

    /**
     * 输出路径
     */
    @required
    outputPath!:string;

    /**
     * 默认值
     */
    isDefaultValue:boolean = false;

    /**
     * 属性
     */
    isAttribute:boolean = false;

    /**
     * 忽略
     */
    ignoreDiagram:boolean = true;

    /**
     * 忽略列
     */
    ignoreColumns:DynamicType[] | undefined;

    /**
     * table name map to class name
     */
    mappingTables:DynamicType | undefined={
        tbl_Role:"jc_role"
    };

    /**
     * table.colums name map to class.property name
     */
    mappingColumns:DynamicType = {
        tbl_Role:{
            columns:{
                Name:"roleName"
            }
        }
    };

    /**
     * column datatype map to c# datatype
     */
    mappingDataType:DynamicType = {
        nameSpace:"Enum",
        tbl_Role:{
            nameSpace:null,
            CreateDate:{
                dataType:"RoleDate",
                nameSpace:null
            },
            CreateUser:"UserDate"
        }
    };
}