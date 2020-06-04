import { IDBContext } from "../driver/IDBContext";
import { TableInfo } from "./Entity/TableInfo";
import { requiredParam } from "../decorators/Parameter/required";
import { IQuerySQL } from "./SQL/IQuerySQL";
import { ViewInfo } from "./Entity/ViewInfo";
import { RowInfo } from "./Entity/RowInfo";

export class Database{

    private readonly _db:IDBContext;
    private readonly _sql:IQuerySQL;

    public _tables!:TableInfo[];
    public _views!:ViewInfo[];
    public _rows!:RowInfo[];

    constructor(@requiredParam context:IDBContext,@requiredParam sql:IQuerySQL){
        this._db=context;
        this._db.connect();
        this._sql=sql;
    }

    public get Tables() : TableInfo[] {
        // tslint:disable-next-line:no-unused-expression
        async()=> await this._setTable();
        return this._tables;
    }
    private async _setTable():Promise<void>{
        if(this._tables===undefined||this._tables === null){
            this._tables= await this._db.query<TableInfo>(this._sql.TableInfoSql);
        }
        if(this._tables===undefined||this._tables === null){
            this._tables=new Array<TableInfo>();
        }
    }

    public get Views():ViewInfo[]{
        // tslint:disable-next-line:no-unused-expression
        async()=>await this._setView();
        return this._views;
    }

    private async _setView():Promise<void>{
        if(this._views===undefined||this._views === null){
            this._views= await this._db.query<ViewInfo>(this._sql.ViewInfoSql);
        }
        if(this._views===undefined||this._views === null){
            this._views=new Array<ViewInfo>();
        }
    }
}