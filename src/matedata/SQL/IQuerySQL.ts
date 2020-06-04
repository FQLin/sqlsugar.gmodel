export interface IQuerySQL{
    /**
     * table info sql
     */
    readonly TableInfoSql:string;

    /**
     * vier info sql
     */
    readonly ViewInfoSql:string;

    /**
     * get column info by table name sql
     * @param tableName table name
     */
    GetColumnInfosByTableNameSql(tableName:string):string;
}