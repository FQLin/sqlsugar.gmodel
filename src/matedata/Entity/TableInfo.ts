import { ColumnInfo } from "./ColumnInfo";

export class TableInfo{
    private _classString!:string;
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

    public get ClassString():string{
        return "";
    }
}