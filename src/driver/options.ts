import { ConnectionOptions } from "./mssqlserver/ConnectionOptions"
import { mappingDataType } from "./mappingDataType";

export class options{

    connectionOption:ConnectionOptions;

    nameSpace:string;
    
    isDefaultValue:false;
    
    isAttribute:false;
    
    outputPath: string;
    
    ignoreDiagram:true;

    ignoreColumns:Object;

    mappingTables:Object;

    mappingColumns:Object;

    mappingDataType:mappingDataType;
}