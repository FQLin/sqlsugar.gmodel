import { ColumnInfo } from "./ColumnInfo";

export class TableInfo{
    /**
     * table view name
     */
    Name!:string;

    /**
     * table view description
     */
    Description?:string;

    /**
     * table column
     */
    Columns: ColumnInfo[]=new Array<ColumnInfo>();
}