import { DynamicType } from "./DynamicType";

export class MappingDataType{
    // nameSpace:string | undefined;
    [Key:string]:DynamicType|undefined;
}