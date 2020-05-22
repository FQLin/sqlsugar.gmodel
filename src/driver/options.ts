import { ConnectionOptions } from "./mssqlserver/ConnectionOptions"
import { mappingDataType } from "./mappingDataType";

export class Options{

    connectionOption: ConnectionOptions;

    nameSpace:string;

    isDefaultValue:boolean;

    isAttribute:boolean;

    outputPath: string;

    ignoreDiagram:boolean;

    ignoreColumns:object;

    mappingTables:object;

    mappingColumns:object;

    mappingDataType:mappingDataType;

    /**
     *
     */
    constructor(connectionOption: ConnectionOptions,outputPath: string,nameSpace:string,isDefaultValue:boolean = false,isAttribute:boolean = false,ignoreDiagram:boolean=true,
        ignoreColumns:Object={},mappingTables:Object = {},mappingColumns:Object = {},mappingDataType:mappingDataType) {
        this.connectionOption=connectionOption;
        this.outputPath=outputPath;
        this.nameSpace=nameSpace;
        this.isDefaultValue=isDefaultValue;
        this.isAttribute=isAttribute;
        this.ignoreDiagram=ignoreDiagram;
        this.ignoreColumns=ignoreColumns;
        this.mappingTables=mappingTables;
        this.mappingColumns=mappingColumns;
        this.mappingDataType=mappingDataType;
    }
}